const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET /api/instructor/discussions/course/:courseId
router.get('/course/:courseId', async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user.id;

    try {
        const [rows] = await db.query(
            `
            SELECT 
                d.id,
                d.course_id,
                d.user_id,
                d.message,
                d.posted_at,
                u.name AS sender_name
            FROM discussions d
            JOIN users u ON d.user_id = u.id
            JOIN courses c ON c.id = d.course_id AND c.teacher_id = ? AND c.status = 'active'
            WHERE d.course_id = ?
            ORDER BY d.posted_at ASC, d.id ASC
            `,
            [userId, courseId]
        );

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/instructor/discussions/course/:courseId
router.post('/course/:courseId', async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user.id;
    const { message } = req.body;

    if (!message || !String(message).trim()) {
        return res.status(400).json({ message: 'Message is required' });
    }

    try {
        const [courseRows] = await db.query(
            'SELECT id FROM courses WHERE id = ? AND teacher_id = ? AND status = \'active\' LIMIT 1',
            [courseId, userId]
        );
        if (courseRows.length === 0) {
            return res.status(403).json({ message: 'Not assigned to this course' });
        }

        const [result] = await db.query(
            'INSERT INTO discussions (course_id, user_id, message) VALUES (?, ?, ?)',
            [courseId, userId, message]
        );

        const [rows] = await db.query(
            `
            SELECT 
                d.id,
                d.course_id,
                d.user_id,
                d.message,
                d.posted_at,
                u.name AS sender_name
            FROM discussions d
            JOIN users u ON d.user_id = u.id
            WHERE d.id = ?
            `,
            [result.insertId]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
