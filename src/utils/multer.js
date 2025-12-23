// import multer from 'multer'

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Specify the directory where files should be saved
//     cb(null, 'uploads/'); 
//   },
//   filename: function (req, file, cb) {
//     // Use the original name for the file
//     cb(null, file.originalname); 
//   }
// });

// const upload = multer({ storage: storage })

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Allow all images + PDF
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error("Only image files and PDF documents are allowed"),
        false
      );
    }
  },
});

export default upload;
