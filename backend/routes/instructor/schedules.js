const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET /api/instructor/schedules/:scheduleId/attendance
router.get('/:scheduleId/attendance', async (req, res) => {
    const { scheduleId } = req.params;

    try {
        // 1. Get Course ID from Schedule
        const [scheduleRows] = await db.query('SELECT course_id FROM schedules WHERE id = ?', [scheduleId]);
        if (scheduleRows.length === 0) return res.status(404).json({ message: 'Schedule not found' });
        const courseId = scheduleRows[0].course_id;

        // 2. Get Students Enrolled + Attendance Status
        const [rows] = await db.query(`
            SELECT 
                u.id as student_id, 
                u.name, 
                a.status 
            FROM enrollments e
            JOIN users u ON e.student_id = u.id
            LEFT JOIN attendances a ON a.student_id = u.id AND a.schedule_id = ?
            WHERE e.course_id = ?
            ORDER BY u.name ASC
        `, [scheduleId, courseId]);

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/instructor/schedules/attendance
router.post('/attendance', async (req, res) => {
    const { scheduleId, attendances } = req.body; // attendances: [{ student_id, status }]

    if (!scheduleId || !Array.isArray(attendances)) {
        return res.status(400).json({ message: 'Invalid data' });
    }

    try {
        // Use a transaction or Promise.all. Simple loop with ON DUPLICATE KEY UPDATE logic?
        // MySQL doesn't have a simple bulk upsert for different values easily without case statements or loop.
        // Since student count is small (~30), a loop of queries is acceptable for this scale.
        
        // First, verify records exist to decide INSERT vs UPDATE, or just DELETE all for this schedule and INSERT new?
        // DELETE & INSERT is risky if we want to keep logs/timestamps.
        // Let's use INSERT ... ON DUPLICATE KEY UPDATE or just Check then Insert/Update.
        
        // Better: Use a loop with simple logic.
        
        const queries = attendances.map(async (att) => {
            // Check if record exists
            const [rows] = await db.query(
                'SELECT id FROM attendances WHERE schedule_id = ? AND student_id = ?', 
                [scheduleId, att.student_id]
            );

            if (rows.length > 0) {
                // Update
                return db.query(
                    'UPDATE attendances SET status = ?, recorded_at = NOW() WHERE id = ?',
                    [att.status, rows[0].id]
                );
            } else {
                // Insert
                return db.query(
                    'INSERT INTO attendances (schedule_id, student_id, status, recorded_at) VALUES (?, ?, ?, NOW())',
                    [scheduleId, att.student_id, att.status]
                );
            }
        });

        await Promise.all(queries);

        res.json({ message: 'Attendance saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;