const express = require('express');
const router = express.Router();
const db = require('../../db');

const multer = require('multer');
const path = require('path');

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/materials/');
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

// POST /api/instructor/materials/upload
router.post('/upload', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'files', maxCount: 20 }]), async (req, res) => {
    const { courseId, title, content } = req.body;
    const files = [
        ...(req.files && req.files.files ? req.files.files : []),
        ...(req.files && req.files.file ? req.files.file : [])
    ];

    if (!courseId || !title || files.length === 0) {
        return res.status(400).json({ message: 'Title, Course ID, and File are required' });
    }

    try {
        await Promise.all(
            files.map(async (file) => {
                const filePath = `/uploads/materials/${file.filename}`;
                await db.query(`
                    INSERT INTO materials (course_id, title, content, file_path, uploaded_at)
                    VALUES (?, ?, ?, ?, NOW())
                `, [courseId, title, content || '', filePath]);
            })
        );

        res.status(201).json({ message: 'Material uploaded successfully', count: files.length });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/instructor/materials/schedule/:scheduleId
router.get('/schedule/:scheduleId', async (req, res) => {
    const { scheduleId } = req.params;
    try {
        const [rows] = await db.query(
            'SELECT * FROM materials WHERE schedule_id = ? ORDER BY uploaded_at ASC', 
            [scheduleId]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/instructor/materials/:courseId (Read all course materials)
router.get('/:courseId', async (req, res) => {
    const { courseId } = req.params;
    try {
        const [rows] = await db.query(
            'SELECT * FROM materials WHERE course_id = ? ORDER BY uploaded_at ASC', 
            [courseId]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
