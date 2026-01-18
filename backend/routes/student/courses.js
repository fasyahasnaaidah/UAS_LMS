const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET /api/student/courses/enrolled
router.get('/enrolled', async (req, res) => {
    const userId = req.user.id;

    try {
        const [courses] = await db.query(`
            SELECT 
                c.id, 
                c.title, 
                c.description, 
                c.start_date,
                c.end_date,
                u.name as teacher_name,
                (SELECT COUNT(*) FROM enrollments e2 WHERE e2.course_id = c.id) as student_count,
                (SELECT COUNT(*) FROM materials m WHERE m.course_id = c.id) as material_count,
                ld.message as last_message,
                ld.posted_at as last_message_time,
                lu.name as last_sender
            FROM enrollments e
            JOIN courses c ON e.course_id = c.id
            LEFT JOIN users u ON c.teacher_id = u.id
            LEFT JOIN discussions ld ON ld.id = (
                SELECT d2.id
                FROM discussions d2
                WHERE d2.course_id = c.id
                ORDER BY d2.posted_at DESC, d2.id DESC
                LIMIT 1
            )
            LEFT JOIN users lu ON ld.user_id = lu.id
            WHERE e.student_id = ? AND c.status = 'active'
        `, [userId]);

        res.json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/student/courses/:courseId/schedules
router.get('/:courseId/schedules', async (req, res) => {
    const { courseId } = req.params;
    try {
        const userId = req.user.id;
        const [rows] = await db.query(
            `SELECT 
                s.*,
                a.status AS attendance_status
             FROM schedules s
             LEFT JOIN attendances a 
                ON a.schedule_id = s.id AND a.student_id = ?
             WHERE s.course_id = ?
             ORDER BY s.session_date ASC`, 
            [userId, courseId]
        );
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/student/schedules/:scheduleId/attendance
router.get('/schedules/:scheduleId/attendance', async (req, res) => {
    const { scheduleId } = req.params;
    const userId = req.user.id;
    try {
        const [rows] = await db.query(
            'SELECT status FROM attendances WHERE schedule_id = ? AND student_id = ?',
            [scheduleId, userId]
        );
        const status = rows.length > 0 ? rows[0].status : null;
        res.json({ status });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
