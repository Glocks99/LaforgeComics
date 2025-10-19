const Artist = require("../models/artists");
const Comic = require("../models/comics")
const fs = require("fs");
const path = require("path");

const getArtists = async (req, res) => {
    try {
        const artists = await Artist.find();
        res.status(200).json({success: true, msg: artists});
    } catch (error) {
        res.status(500).json({ message: "Error fetching artists" });
    }
};

const getArtistById = async (req, res) => {
    try {
        const artist = await Artist.findById(req.params.id);
        if (!artist) {
            return res.status(404).json({ message: "Artist not found" });
        }
        res.status(200).json({ success: true, msg: artist });
    } catch (error) {
        res.status(500).json({ message: "Error fetching artist" });
    }
};

const createArtist = async (req, res) => {
  try {
    const {
      name,
      bio,
      email,
      socialLinks,
      location,
      phone,
    } = req.body;

    const basePath = req.protocol + "://" + req.get("host") + "/uploads/artists/";

    const image = req.files?.image?.[0]
      ? `${basePath}${req.files.image[0].filename}`
      : "";
    const coverImage = req.files?.coverImage?.[0]
      ? `${basePath}${req.files.coverImage[0].filename}`
      : "";

    const parsedLinks =
      typeof socialLinks === "string" ? JSON.parse(socialLinks) : socialLinks;

    const newArtist = new Artist({
      name,
      bio,
      email,
      location,
      phone,
      socialLinks: parsedLinks || {},
      image,
      coverImage,
    });

    await newArtist.save();

    res.json({
      success: true,
      msg: "Artist created successfully",
      data: newArtist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Error creating artist",
      error: error.message,
    });
  }
};

const updateArtist = async (req, res) => {
  try {
    const artistId = req.params.id;
    const artist = await Artist.findById(artistId);

    if (!artist) {
      return res.status(404).json({ success: false, msg: "Artist not found" });
    }

    // handle uploaded files
    const basePath = req.protocol + "://" + req.get("host") + "/uploads/artists/";
    const image =
      req.files?.image?.[0] && `${basePath}${req.files.image[0].filename}`;
    const coverImage =
      req.files?.coverImage?.[0] &&
      `${basePath}${req.files.coverImage[0].filename}`;

    // parse socialLinks safely
    let parsedLinks = req.body.socialLinks;
    if (typeof parsedLinks === "string") {
      try {
        parsedLinks = JSON.parse(parsedLinks);
      } catch {
        parsedLinks = {};
      }
    }

    // build update object
    const updateData = {
      name: req.body.name || artist.name,
      bio: req.body.bio || artist.bio,
      email: req.body.email || artist.email,
      location: req.body.location || artist.location,
      phone: req.body.phone || artist.phone,
      socialLinks: parsedLinks || artist.socialLinks,
      image: image || artist.image,
      coverImage: coverImage || artist.coverImage,
    };

    const updatedArtist = await Artist.findByIdAndUpdate(
      artistId,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      msg: "Artist updated successfully",
      data: updatedArtist,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      msg: "Error updating artist",
      error: error.message,
    });
  }
};

const deleteArtist = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedArtist = await Artist.findByIdAndDelete(id);

    if (!deletedArtist) {
      return res.status(404).json({ success: false, msg: "Artist not found" });
    }

    // Delete all comics belonging to this artist
    await Comic.deleteMany({ author: deletedArtist._id });

  

    const deleteFile = (fileName) => {
      if (!fileName) return;

      const filename = fileName.split("/uploads/artists/")[1];
      const filepath = path.join(__dirname, "../public/uploads/artists", filename);
      try {
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      } catch (err) {
        console.error("Error deleting cover image:", err.message);
      }
    };

    // Delete both image and coverImage if they exist
    deleteFile(deletedArtist.image);
    deleteFile(deletedArtist.coverImage);

    res.status(200).json({
      success: true,
      msg: "Artist and all related comics deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting artist:", error);
    res.status(500).json({
      success: false,
      msg: "Server error while deleting artist",
      error: error.message,
    });
  }
};

const getRandomArtist = async (req, res) => {
    try {
        // If you want to use the id passed (req.params.id) to *narrow down*, you can add conditions here
        const count = await Artist.countDocuments();
        if (count === 0) {
            return res.json({ message: "No artists available" });
        }

        // Generate random skip
        const random = Math.floor(Math.random() * count);

        const randomArtist = await Artist.findOne().skip(random);

        res.status(200).json({ success: true, msg: randomArtist });
    } catch (error) {
        res.status(500).json({success: false, msg: error.message});
    }
};


module.exports = {
    getArtists,
    createArtist,
    updateArtist,
    deleteArtist,
    getRandomArtist,
    getArtistById
};