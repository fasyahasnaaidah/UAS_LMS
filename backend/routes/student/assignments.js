const express = require('express');
const router = express.Router();
const db = require('../../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/submissions/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now();
        let name = file.originalname;
        try {
            name = decodeURIComponent(name);
        } catch {}
        name = name.replace(/%20/g, ' ');
        const sanitizedName = name.replace(/\s+/g, '_');
        cb(null, uniqueSuffix + '-' + sanitizedName);
    }
});
const upload = multer({ storage: storage });

// GET Assignments by Course ID
router.get('/course/:courseId', async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user.id;

    try {
        const [rows] = await db.query(`
            SELECT a.*, 
                   (SELECT id FROM submissions s WHERE s.assignment_id = a.id AND s.student_id = ? ORDER BY s.submitted_at DESC LIMIT 1) as submission_id,
                   (SELECT submitted_at FROM submissions s WHERE s.assignment_id = a.id AND s.student_id = ? ORDER BY s.submitted_at DESC LIMIT 1) as submitted_at
            FROM assignments a
            WHERE a.course_id = ?
            ORDER BY a.due_date ASC
        `, [userId, userId, courseId]);
        
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET Assignment Detail & Status
router.get('/:assignmentId/status', async (req, res) => {
    const { assignmentId } = req.params;
    const userId = req.user.id;

    try {
        const [assignmentRows] = await db.query('SELECT * FROM assignments WHERE id = ?', [assignmentId]);
        if (assignmentRows.length === 0) return res.status(404).json({ message: 'Assignment not found' });
        const assignment = assignmentRows[0];

        const [submissionRows] = await db.query(`
            SELECT id, file_path, submitted_at, score, content, feedback 
            FROM submissions 
            WHERE assignment_id = ? AND student_id = ?
        `, [assignmentId, userId]);

        res.json({
            assignment,
            submissions: submissionRows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST Upload Submission
router.post('/upload', upload.array('files'), async (req, res) => {
    const userId = req.user.id;
    const { assignmentId, content } = req.body;
    const files = req.files;

    if (!assignmentId) {
        return res.status(400).json({ message: 'Assignment ID is required' });
    }

    try {
        const queries = files.map(file => {
            const filePath = `/uploads/submissions/${file.filename}`;
            return db.query(`
                INSERT INTO submissions (assignment_id, student_id, file_path, content, submitted_at)
                VALUES (?, ?, ?, ?, NOW())
            `, [assignmentId, userId, filePath, content || '']);
        });

        await Promise.all(queries);

        res.json({ message: 'Submission successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE Cancel Submission
router.delete('/:assignmentId/submission', async (req, res) => {
    const userId = req.user.id;
    const { assignmentId } = req.params;

    try {
        const [filesToDelete] = await db.query(`
            SELECT file_path FROM submissions 
            WHERE assignment_id = ? AND student_id = ?
        `, [assignmentId, userId]);

        const backendDir = path.join(__dirname, '../..');
        const projectRoot = path.join(__dirname, '../../..');
        const roots = [backendDir, projectRoot];

        const safeDecode = (value) => {
            try {
                return decodeURIComponent(value);
            } catch {
                return value;
            }
        };

        filesToDelete.forEach(row => {
            if (!row.file_path) return;

            const rawName = path.basename(row.file_path);
            const decodedName = safeDecode(rawName);
            const sanitizedName = decodedName.replace(/\s+/g, '_');

            const nameCandidates = Array.from(new Set([rawName, decodedName, sanitizedName]));
            const relPath = row.file_path.replace(/^[/\\]+/, '');

            const pathCandidates = new Set();
            roots.forEach((root) => {
                if (relPath) {
                    pathCandidates.add(path.join(root, relPath));
                }
                nameCandidates.forEach((name) => {
                    pathCandidates.add(path.join(root, 'uploads', 'submissions', name));
                });
            });

            let deleted = false;
            pathCandidates.forEach((physicalPath) => {
                if (!fs.existsSync(physicalPath)) return;
                try {
                    fs.rmSync(physicalPath, { force: true });
                    deleted = true;
                } catch (err) {
                    console.error(`Failed to delete file: ${physicalPath}`, err);
                }
            });

            if (!deleted) {
                console.error('Failed to delete submission file. Candidates:', Array.from(pathCandidates));
            }
        });

        await db.query(`
            DELETE FROM submissions 
            WHERE assignment_id = ? AND student_id = ?
        `, [assignmentId, userId]);

        res.json({ message: 'Submission cancelled' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
