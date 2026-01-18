const express = require('express');
const router = express.Router();
const db = require('../../db');

// GET /api/student/materials/:courseId
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