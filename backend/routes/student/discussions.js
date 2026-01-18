const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET /api/student/discussions/course/:courseId
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
                u.name AS sender_name,
                u.role AS sender_role
            FROM discussions d
            JOIN users u ON d.user_id = u.id
            JOIN courses c ON c.id = d.course_id AND c.status = 'active'
            JOIN enrollments e ON e.course_id = d.course_id AND e.student_id = ?
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

// POST /api/student/discussions/course/:courseId
router.post('/course/:courseId', async (req, res) => {
    const { courseId } = req.params;
    const userId = req.user.id;
    const { message } = req.body;

    if (!message || !String(message).trim()) {
        return res.status(400).json({ message: 'Message is required' });
    }

    try {
        // Ensure student is enrolled in the course
        const [enrolledRows] = await db.query(
            `
            SELECT e.id
            FROM enrollments e
            JOIN courses c ON c.id = e.course_id AND c.status = 'active'
            WHERE e.student_id = ? AND e.course_id = ?
            LIMIT 1
            `,
            [userId, courseId]
        );
        if (enrolledRows.length === 0) {
            return res.status(403).json({ message: 'Not enrolled in this course' });
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
                u.name AS sender_name,
                u.role AS sender_role
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
