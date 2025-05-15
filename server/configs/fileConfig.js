import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Manually define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper: Create upload path if it doesn't exist
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { category, subCategory } = req.body;

    let uploadPath;

    if (file.fieldname === "bookImage") {
      uploadPath = path.join(process.cwd(), "uploads", "images", category, subCategory);
    } else if (file.fieldname === "bookPdf") {
      uploadPath = path.join(process.cwd(), "uploads", "pdfs", category, subCategory);
    } else {
      return cb(new Error("Invalid fieldname for upload!"), false);
    }

    ensureDirExists(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// File Filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "bookImage") {
    if (["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .jpeg, .png files are allowed for images!"), false);
    }
  } else if (file.fieldname === "bookPdf") {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only .pdf files are allowed for books!"), false);
    }
  } else {
    cb(new Error("Unsupported file field!"), false);
  }
};

// Upload Middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export default upload;
