// Wrapper for the existing expense controller to integrate with API
import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import File from '../models/File.js';

dotenv.config();

// Initialize Google Cloud services  
const client = new DocumentProcessorServiceClient({
    keyFilename: process.env.GOOGLECLOUDSERVICEACCOUNTKEY,
});

const storage = new Storage({
    keyFilename: process.env.GOOGLECLOUDSERVICEACCOUNTKEY,
});

// Helper function to upload file to GCS
async function uploadToGCS(file) {
    if (!file) throw new Error('No file provided');

    const bucketName = process.env.GCS_BUCKET_NAME;
    const bucket = storage.bucket(bucketName);
    const fileName = `expenses_${Date.now()}_${file.originalname}`;
    const blob = bucket.file(fileName);

    const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
    });

    return new Promise((resolve, reject) => {
        blobStream.on('error', (err) => {
            console.error('❌ [EXPENSE UPLOAD] Upload failed:', err.message);
            reject(err);
        });
        blobStream.on('finish', async () => {
            try {
                console.log('✅ [EXPENSE UPLOAD] File uploaded successfully');
                const [signedUrl] = await blob.getSignedUrl({
                    action: 'read',
                    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
                });

                resolve({
                    signedUrl,
                    fileName,
                    mimeType: file.mimetype,
                    filePath: `gs://${bucketName}/${fileName}`
                });
            } catch (err) {
                console.error('❌ [EXPENSE UPLOAD] Error generating signed URL:', err.message);
                reject(err);
            }
        });

        blobStream.end(file.buffer);
    });
}

// Main expense processing function adapted from your controller
export const processExpenseDocument = async (req, res) => {
    const startTime = Date.now();
    console.log('\n💰 ====== EXPENSE DOCUMENT PROCESSING STARTED ======');
    console.log(`⏰ [EXPENSE] Request started at: ${new Date().toISOString()}`);

    try {
        // Step 1: Validate file upload
        if (!req.file) {
            return res.status(400).json({
                error: 'No file uploaded. Please upload a PDF expense document.'
            });
        }

        console.log(`✅ [EXPENSE] File received: ${req.file.originalname}`);

        // Step 2: Upload to GCS
        const uploadResult = await uploadToGCS(req.file);

        // Step 3: Process with your expense processor
        const name = `projects/812205926269/locations/us/processors/19ef56a06b2fa229`;

        // Download file from GCS
        const bucketName = process.env.GCS_BUCKET_NAME;
        const fileName = uploadResult.filePath.replace(`gs://${bucketName}/`, '');
        const file = storage.bucket(bucketName).file(fileName);
        const [fileContents] = await file.download();
        
        const encodedImage = Buffer.from(fileContents).toString('base64');

        const request = {
            name,
            rawDocument: {
                content: encodedImage,
                mimeType: 'application/pdf',
            },
        };

        const [result] = await client.processDocument(request);
        const { document } = result;
        const { text, entities } = document;

        // Extract first entity mention as summary (like your original code)
        const summary = entities && entities.length > 0 ? entities[0].mentionText : 'No summary available';

        // Step 4: Save to MongoDB
        const documentId = uuidv4();
        const fileData = {
            fileName: req.file.originalname,
            fileUrl: uploadResult.signedUrl,
            uploadedBy: req.user ? req.user.id : null, // Will be null if no auth
            documentId: documentId,
            size: req.file.size,
            summary: summary,
            documentType: 'expense', // Mark as expense document
            // Expense-specific fields
            expenseData: {
                documentText: text,
                entities: entities || [],
                entityCount: entities?.length || 0
            }
        };

        // Only save to DB if user is authenticated
        let savedFile = null;
        console.log(`🔍 [EXPENSE AUTH] Checking user authentication:`, {
            hasUser: !!req.user,
            userId: req.user?.id,
            userEmail: req.user?.email
        });

        if (req.user && req.user.id) {
            try {
                console.log(`💾 [EXPENSE MONGO] Attempting to save file to MongoDB...`);
                savedFile = await File.create(fileData);
                console.log(`✅ [EXPENSE MONGO] File saved to MongoDB with ID: ${savedFile._id}`);
            } catch (mongoError) {
                console.error(`❌ [EXPENSE MONGO] Could not save to MongoDB:`, mongoError);
            }
        } else {
            console.warn(`⚠️ [EXPENSE AUTH] No authenticated user found - file will not be saved to database`);
        }

        // Step 5: Prepare response
        const processingTime = Date.now() - startTime;
        
        const response = {
            success: true,
            processingTime: `${processingTime}ms`,
            documentId: documentId,
            fileInfo: {
                originalName: req.file.originalname,
                fileName: uploadResult.fileName,
                fileUrl: uploadResult.signedUrl,
                size: req.file.size
            },
            expenseAnalysis: {
                documentText: text,
                summary: summary,
                entities: entities || [],
                entityCount: entities?.length || 0
            },
            savedToDatabase: savedFile ? true : false,
            fileId: savedFile ? savedFile._id : null,
            timestamp: new Date().toISOString()
        };

        console.log(`✅ [EXPENSE] Processing completed in ${processingTime}ms`);
        res.status(200).json(response);

    } catch (error) {
        const processingTime = Date.now() - startTime;
        console.error(`❌ [EXPENSE ERROR] ${error.message}`);

        res.status(500).json({
            success: false,
            error: 'Error processing expense document',
            processingTime: `${processingTime}ms`,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default {
    processExpenseDocument
};