const Work = require("../models/works");
const mongoose = require("mongoose")

// Get all works
const getWorks = async (req, res) => {
  const { artistId, limit } = req.query;

  try {
    let query = {};

    // Only add the author filter if authorId is provided and valid
    if (artistId && mongoose.Types.ObjectId.isValid(artistId)) {
      query.artist = artistId;
    }
    const works = await Work.find(query).populate("comic").limit(limit); 
    res.status(200).json(works);
  } catch (error) {
    res.status(500).json({ message: "Error fetching works", error: error.message });
  }
};

// Get a work by ID
const getWorkById = async (req, res) => {
  try {
    const work = await Work.findById(req.params.id).populate("comic", "name coverImage");
    if (!work) {
      return res.status(404).json({ message: "Work not found" });
    }
    res.status(200).json(work);
  } catch (error) {
    res.status(500).json({ message: "Error fetching work", error: error.message });
  }
};

// Create a new work
const createWork = async (req, res) => {
  try {
    const newWork = new Work(req.body);
    await newWork.save();
    res.status(201).json(newWork);
  } catch (error) {
    res.status(500).json({ message: "Error creating work", error: error.message });
  }
};

// Update a work
const updateWork = async (req, res) => {
  try {
    const updatedWork = await Work.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedWork) {
      return res.status(404).json({ message: "Work not found" });
    }
    res.status(200).json(updatedWork);
  } catch (error) {
    res.status(500).json({ message: "Error updating work", error: error.message });
  }
};

// Delete a work
const deleteWork = async (req, res) => {
  try {
    const deletedWork = await Work.findByIdAndDelete(req.params.id);
    if (!deletedWork) {
      return res.status(404).json({ message: "Work not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting work", error: error.message });
  }
};

// Get random works (optional helper)
const getRandomWorks = async (req, res) => {
  try {
    const count = await Work.countDocuments();
    if (count === 0) {
      return res.status(200).json([]);
    }

    const randomIndex = Math.floor(Math.random() * count);
    const work = await Work.findOne().skip(randomIndex).populate("artist", "name");

    res.status(200).json(work);
  } catch (error) {
    res.status(500).json({ message: "Error fetching random work", error: error.message });
  }
};

module.exports = {
  getWorks,
  getWorkById,
  createWork,
  updateWork,
  deleteWork,
  getRandomWorks,
};
