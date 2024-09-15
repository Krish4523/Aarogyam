import multer, { StorageEngine } from "multer";
import { Request } from "express";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

// Define the base upload directory
const secureUploadDir = path.join(__dirname, "../../uploads");
const publicUploadDir = path.join(__dirname, "../../public");

// Ensure the base directory exists
if (!fs.existsSync(publicUploadDir)) {
  fs.mkdirSync(publicUploadDir, { recursive: true });
}
if (!fs.existsSync(secureUploadDir)) {
  fs.mkdirSync(secureUploadDir, { recursive: true });
}
/**
 * Multer storage configuration for handling file uploads.
 */
const storage: StorageEngine = multer.diskStorage({
  /**
   * Sets the destination directory for uploaded files.
   *
   * @param req - The request object.
   * @param file - The file being uploaded.
   * @param cb - Callback function to set the destination directory.
   */
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ): void => {
    let folder = "others";
    const uploadDir = publicUploadDir;
    if (file.fieldname === "profileImage") {
      folder = "profile";
    }

    const filePath = path.join(uploadDir, folder);

    // Ensure the subdirectory exists
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true });
    }

    cb(null, filePath);
  },
  /**
   * Sets the filename for uploaded files.
   *
   * @param req - The request object.
   * @param file - The file being uploaded.
   * @param cb - Callback function to set the filename.
   */
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ): void => {
    // Generate a unique UUID for the file
    const uniqueName = uuid();

    // Get the file extension (e.g., .jpg, .png)
    const extension = path.extname(file.originalname);

    // Replace spaces in the original filename and append the extension
    const sanitizedFilename = `${uniqueName}${extension}`;

    cb(null, sanitizedFilename); // Save as unique name with UUID
  },
});

/**
 * Multer middleware for handling file uploads.
 */
const upload = multer({ storage });

export default upload;
