const Genre = require('../models/genre');

const getAllGenres = async (req, res) => {
    try {
        const genres = await Genre.find();
        res.status(200).json({ success: true, msg: genres });
    } catch (error) {
        console.error("Error fetching genres:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { getAllGenres };