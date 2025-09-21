// Multer middleware setup
import multer from 'multer';

const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

export default upload;
