const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET /api/instructor/courses/taught
router.get('/taught', async (req, res) => {
    const userId = req.user.id;

    try {
        const [courses] = await db.query(`
            SELECT 
                c.id, 
                c.title, 
                c.description, 
                c.start_date,
                c.end_date,
                (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) as student_count,
                ld.message as last_message,
                ld.posted_at as last_message_time,
                lu.name as last_sender
            FROM courses c
            LEFT JOIN discussions ld ON ld.id = (
                SELECT d2.id
                FROM discussions d2
                WHERE d2.course_id = c.id
                ORDER BY d2.posted_at DESC, d2.id DESC
                LIMIT 1
            )
            LEFT JOIN users lu ON ld.user_id = lu.id
            WHERE c.teacher_id = ? AND c.status = 'active'
        `, [userId]);

        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/instructor/courses/:courseId/schedules
router.get('/:courseId/schedules', async (req, res) => {
    const { courseId } = req.params;
    try {
        const [rows] = await db.query(
            'SELECT * FROM schedules WHERE course_id = ? ORDER BY session_date ASC', 
            [courseId]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/instructor/courses/schedule
router.post('/schedule', async (req, res) => {
    const { courseId, sessionTopic, sessionDate, location } = req.body;
    
    if (!courseId || !sessionTopic || !sessionDate || !location) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        await db.query(`
            INSERT INTO schedules (course_id, session_topic, session_date, location)
            VALUES (?, ?, ?, ?)
        `, [courseId, sessionTopic, sessionDate, location]);

        res.status(201).json({ message: 'Schedule created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
