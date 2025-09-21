// documentProcessor.js
const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1;
const { uploadFile, generateSignedUrl } = require('./fileUploadBucketController');
const fs = require('fs').promises;
const path = require('path');

const client = new DocumentProcessorServiceClient({
  keyFilename: process.env.GOOGLECLOUDSERVICEACCOUNTKEY,
});

async function processDocument({ filepath }) {
  const projectId = process.env.GCP_PROJECT_ID;
  const location = process.env.GCP_LOCATION || 'us';
  const processorId = process.env.GCP_PROCESSOR_ID;

  const name = `projects/${projectId}/locations/${location}/processors/${processorId}`;

  const imageFile = await fs.readFile(filepath);
  const encodedImage = Buffer.from(imageFile).toString('base64');

  const request = {
    name,
    rawDocument: {
      content: encodedImage,
      mimeType: 'application/pdf',
    },
  };

  const [result] = await client.processDocument(request);

  if (!result) {
    throw new Error('No document found in the response');
  }

  const originalName = path.basename(filepath);
  const destination = `uploads/${Date.now()}_${originalName}`;
  const bucketName = process.env.GCS_BUCKET_NAME;

  // Upload to GCS
  await uploadFile(bucketName, filepath, destination);

  // Generate signed URL
  const signedUrl = await generateSignedUrl(bucketName, destination);

  return {
    documentAIResult: result,
    fileUrl: signedUrl,
  };
}

exports.processDocument = processDocument;

