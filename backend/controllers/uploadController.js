const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const storage = multer.memoryStorage();

const upload = multer({
  storage,

  limits: {
    fileSize: 12 * 1024 * 1024,
    files: 6,
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Lejohen vetëm JPG, PNG dhe WEBP."
        )
      );
    }

    cb(null, true);
  },
});

function uploadBuffer(file) {
  return new Promise((resolve, reject) => {
    const stream =
      cloudinary.uploader.upload_stream(
        {
          folder: "apar/products",
          resource_type: "image",

          /*
            INCOMING TRANSFORMATION

            Fotoja transformohet PARA
            se të ruhet në Cloudinary.

            - max 1600 x 2000
            - nuk zmadhohet nëse është më e vogël
            - quality auto
            - ruhet WebP
          */
          transformation: [
            {
              width: 1600,
              height: 2000,
              crop: "limit",
              quality: "auto:good",
              fetch_format: "webp",
            },
          ],
        },

        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(result);
        }
      );

    stream.end(file.buffer);
  });
}

async function uploadImages(req, res) {
  try {
    if (
      !req.files ||
      req.files.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Zgjidh të paktën një fotografi.",
      });
    }

    const uploaded =
      await Promise.all(
        req.files.map(uploadBuffer)
      );

    const images =
      uploaded.map((image) => ({
        url: image.secure_url,
        publicId: image.public_id,
        width: image.width,
        height: image.height,
        bytes: image.bytes,
        format: image.format,
      }));

    res.status(201).json({
      success: true,
      count: images.length,
      images,
    });
  } catch (error) {
    console.error(
      "Cloudinary upload error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Fotot nuk u ngarkuan.",
    });
  }
}

module.exports = {
  upload,
  uploadImages,
};