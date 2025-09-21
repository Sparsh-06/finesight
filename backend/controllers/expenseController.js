/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
// const projectId = 'YOUR_PROJECT_ID';
// const location = 'YOUR_PROJECT_LOCATION'; // Format is 'us' or 'eu'
// const processorId = 'YOUR_PROCESSOR_ID'; // Create processor in Cloud Console
const filePath = '/home/sparshsharma/Downloads/Samples/expensessamples/Sample-Financial-Statements-1.pdf';

import { DocumentProcessorServiceClient } from '@google-cloud/documentai';
import fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

console.log(process.env.GOOGLECLOUDSERVICEACCOUNTKEY);
// Instantiates a client
const client = new DocumentProcessorServiceClient({
    keyFilename: '/home/sparshsharma/Desktop/Genhack/backend/keys/future-snowfall-440806-g2-9363f8ce8a28.json',
});



async function processDocument() {
  // The full resource name of the processor, e.g.:
  // projects/project-id/locations/location/processor/processor-id
  // You must create new processors in the Cloud Console first
  const name = `projects/812205926269/locations/us/processors/19ef56a06b2fa229/processorVersions/1d2f5bf512b0e5a5`;

  // Read the file into memory.
  const imageFile = await fs.readFile(filePath);

  // Convert the image data to a Buffer and base64 encode it.
  const encodedImage = Buffer.from(imageFile).toString('base64');

  const request = {
    name,
    rawDocument: {
      content: encodedImage,
      mimeType: 'application/pdf',
    },
  };

  // Recognizes text entities in the PDF document
  const [result] = await client.processDocument(request);
  const {document} = result;

  // Get all of the document text as one big string
  const {text} = document;
  const summary = document.entities[0].mentionText
  console.log(`Document Text: ${summary}`);
  console.log('Document processing complete.', document);
  // Extract shards from the text field
  // Form parsing provides additional output about
  // form-formatted PDFs. You  must create a form
  // processor in the Cloud Console to see full field details.
  console.log('\nThe following form key/value pairs were detected:');

}

processDocument().catch(err => {
  console.error(err);
  process.exitCode = 1;
}); 