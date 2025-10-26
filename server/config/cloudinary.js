const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const makeUploader = (folder) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder, // dynamic folder name (mirrors your local structure)
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    },
  });
  return multer({ storage });
};

module.exports = { cloudinary, makeUploader };
