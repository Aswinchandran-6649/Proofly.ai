const multer = require('multer');

// Configure how and where the file is stored
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads'); // Files will be stored in the 'uploads' folder
    },
    filename: (req, file, callback) => {
        // Create a unique name: image-1712345678-receipt.jpg
        const filename = `image-${Date.now()}-${file.originalname}`;
        callback(null, filename);
    }
});

// Filter to allow only specific image types
const fileFilter = (req, file, callback) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        callback(null, true);
    } else {
        callback(null, false);
        return callback(new Error("Only .png, .jpg and .jpeg formats are allowed!"));
    }
};

const multerConfig = multer({
    storage,
    fileFilter
});

module.exports = multerConfig;