const Artist = require("../models/artists");
const Comic = require("../models/comics")
const { cloudinary } = require("../config/cloudinary");

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
    const { name, bio, email, socialLinks, location, phone } = req.body;

    // Cloudinary automatically gives us hosted URLs
    const image = req.files?.image?.[0]?.path || "";
    const coverImage = req.files?.coverImage?.[0]?.path || "";

    // Handle social links (stringified JSON from frontend)
    const parsedLinks =
      typeof socialLinks === "string" ? JSON.parse(socialLinks) : socialLinks;

    // Create new artist document
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
      msg: " Artist created successfully!",
      data: newArtist,
    });
  } catch (error) {
    console.error("Error creating artist:", error);
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

    // --- Handle uploaded Cloudinary files ---
    let image = artist.image;
    let coverImage = artist.coverImage;

    // If new profile image uploaded, delete old one
    if (req.files?.image?.[0]) {
      if (artist.image) {
        try {
          const parts = artist.image.split("/");
          const folderAndFile = parts.slice(-2).join("/");
          const publicId = folderAndFile.split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Error deleting old profile image from Cloudinary:", err.message);
        }
      }
      image = req.files.image[0].path; // Cloudinary URL
    }

    // If new cover image uploaded, delete old one
    if (req.files?.coverImage?.[0]) {
      if (artist.coverImage) {
        try {
          const parts = artist.coverImage.split("/");
          const folderAndFile = parts.slice(-2).join("/");
          const publicId = folderAndFile.split(".")[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Error deleting old cover image from Cloudinary:", err.message);
        }
      }
      coverImage = req.files.coverImage[0].path; // Cloudinary URL
    }

    // --- Parse socialLinks safely ---
    let parsedLinks = req.body.socialLinks;
    if (typeof parsedLinks === "string") {
      try {
        parsedLinks = JSON.parse(parsedLinks);
      } catch {
        parsedLinks = {};
      }
    }

    // --- Build update object ---
    const updateData = {
      name: req.body.name || artist.name,
      bio: req.body.bio || artist.bio,
      email: req.body.email || artist.email,
      location: req.body.location || artist.location,
      phone: req.body.phone || artist.phone,
      socialLinks: parsedLinks || artist.socialLinks,
      image,
      coverImage,
    };

    const updatedArtist = await Artist.findByIdAndUpdate(artistId, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      msg: "Artist updated successfully",
      data: updatedArtist,
    });
  } catch (error) {
    console.error("Error updating artist:", error);
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

    // --- Delete all comics belonging to this artist ---
    await Comic.deleteMany({ author: deletedArtist._id });

    // --- Delete artist images from Cloudinary ---
    const deleteFromCloudinary = async (fileUrl) => {
      if (!fileUrl) return;
      try {
        const parts = fileUrl.split("/");
        const folderAndFile = parts.slice(-2).join("/");
        const publicId = folderAndFile.split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error("Error deleting image from Cloudinary:", err.message);
      }
    };

    await Promise.all([
      deleteFromCloudinary(deletedArtist.image),
      deleteFromCloudinary(deletedArtist.coverImage),
    ]);

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