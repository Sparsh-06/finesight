import express from 'express';
const router = express.Router();
import upload from '../middleware/multer.js';
import multerFileUploadController from '../controllers/multerFileUploadController.js';
import unifiedDocumentController from '../controllers/unifiedDocumentController.js';
import expenseWrapper from '../controllers/expenseWrapper.js';
import { authenticateToken } from '../middleware/auth.js';

// POST /api/file/upload - Original simple upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const url = await multerFileUploadController.uploadToGCS(req.file);
    res.status(200).json({ message: 'File uploaded.', url: url.signedUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to upload file.' });
  }
});

// POST /api/file/process - Unified document processing with AI analysis
router.post('/process', authenticateToken, upload.single('file'), unifiedDocumentController.processLegalDocument);

// POST /api/file/process-expense - Expense document processing
router.post('/process-expense', authenticateToken, upload.single('file'), expenseWrapper.processExpenseDocument);

// POST /api/file/rag-chat - RAG chat with uploaded document
router.post('/rag-chat', authenticateToken, unifiedDocumentController.ragChatWithPDF);

// GET /api/file/user-files - Get user's uploaded files
router.get('/user-files', authenticateToken, unifiedDocumentController.getUserFiles);

// GET /api/file/:id - Get specific file by ID
router.get('/:id', authenticateToken, unifiedDocumentController.getFileById);

export default router;
