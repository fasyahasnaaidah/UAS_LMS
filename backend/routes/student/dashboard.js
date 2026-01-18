const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET /api/student/dashboard/summary
router.get('/summary', async (req, res) => {
    const userId = req.user.id;

    try {
        // 1. Get User Info
        const [userRows] = await db.query('SELECT name FROM users WHERE id = ?', [userId]);
        const userName = userRows.length > 0 ? userRows[0].name : 'User';

        // 2. Get Learning Progress (Courses enrolled + completion rate)
        const [courses] = await db.query(`
            SELECT c.id, c.title 
            FROM enrollments e 
            JOIN courses c ON e.course_id = c.id 
            WHERE e.student_id = ? AND c.status = 'active'
        `, [userId]);

        const progressData = [];

        for (const course of courses) {
            const [totalRows] = await db.query('SELECT COUNT(*) as total FROM assignments WHERE course_id = ?', [course.id]);
            const total = totalRows[0].total;

            const [submittedRows] = await db.query(`
                SELECT COUNT(DISTINCT s.assignment_id) as submitted 
                FROM submissions s 
                JOIN assignments a ON s.assignment_id = a.id 
                WHERE a.course_id = ? AND s.student_id = ?
            `, [course.id, userId]);
            
            const submitted = submittedRows[0].submitted;
            const percentage = total === 0 ? 0 : (submitted / total);

            progressData.push({
                id: course.id,
                title: course.title,
                submitted: submitted,
                total: total,
                percentage: parseFloat(percentage.toFixed(2))
            });
        }

        // 3. Get Today's Schedules
        const [scheduleRows] = await db.query(`
            SELECT s.session_topic, s.session_date, s.location, c.title as course_title, u.name as teacher_name 
            FROM schedules s 
            JOIN enrollments e ON s.course_id = e.course_id 
            JOIN courses c ON s.course_id = c.id 
            JOIN users u ON c.teacher_id = u.id 
            WHERE e.student_id = ? AND c.status = 'active' AND DATE(s.session_date) = CURDATE() 
            ORDER BY s.session_date ASC 
        `, [userId]);

        res.json({
            user: { name: userName },
            progress: progressData,
            schedules: scheduleRows
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
