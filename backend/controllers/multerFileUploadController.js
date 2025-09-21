// fileUploadBucketController.js
import { Storage } from '@google-cloud/storage';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const storage = new Storage({
  keyFilename: process.env.GOOGLECLOUDSERVICEACCOUNTKEY,
});
const bucketName = process.env.GCS_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

// ✅ 1. Upload from Multer (frontend)
export const uploadToGCS = async (file) => {
  if (!file) throw new Error('No file provided');

  const fileName = `${Date.now()}_${file.originalname}`;
  const blob = bucket.file(fileName);
  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: file.mimetype,
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (err) => reject(err));
    blobStream.on('finish', async () => {
      try {
        const signedUrl = await generateSignedUrl(bucketName, fileName);
        resolve({
          signedUrl,
          fileName,
          mimeType: file.mimetype,
        });
      } catch (err) {
        reject(err);
      }
    });

    blobStream.end(file.buffer);
  });
};

// ✅ 2. Upload from local path (backend)
export const uploadFile = async (bucketName, filePath, destination) => {
  await storage.bucket(bucketName).upload(filePath, {
    destination,
    resumable: false,
  });

  return { bucketName, destination };
};

// ✅ 3. Generate Signed URL
export const generateSignedUrl = async (bucketName, fileName) => {
  const options = {
    version: 'v4',
    action: 'read',
    expires: Date.now() + 60 * 60 * 1000, // 1 hour
  };

  const [url] = await storage.bucket(bucketName).file(fileName).getSignedUrl(options);
  return url;
};

export default {
  uploadToGCS,
  uploadFile,
  generateSignedUrl
};
