const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET /api/instructor/dashboard/summary
router.get('/summary', async (req, res) => {
    const userId = req.user.id;

    try {
        // 1. Get User Info
        const [userRows] = await db.query('SELECT name FROM users WHERE id = ?', [userId]);
        const userName = userRows.length > 0 ? userRows[0].name : 'User';

        // 2. Get Today's Schedules for courses taught by this teacher
        const [scheduleRows] = await db.query(`
            SELECT s.id, s.session_topic, s.session_date, s.location, c.title as course_title, c.id as course_id,
                   (SELECT COUNT(*) FROM enrollments e WHERE e.course_id = c.id) as student_count
            FROM schedules s 
            JOIN courses c ON s.course_id = c.id 
            WHERE c.teacher_id = ? AND c.status = 'active' AND DATE(s.session_date) = CURDATE() 
            ORDER BY s.session_date ASC 
        `, [userId]);

        res.json({
            user: { name: userName },
            schedules: scheduleRows,
            isInstructor: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
