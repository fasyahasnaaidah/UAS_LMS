const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET Assignments by Course ID (Instructor View - see all assignments created)
router.get('/course/:courseId', async (req, res) => {
    const { courseId } = req.params;
    // Check if teacher owns course? For now just list.

    try {
        const [rows] = await db.query(`
            SELECT * FROM assignments
            WHERE course_id = ?
            ORDER BY due_date ASC
        `, [courseId]);
        
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;