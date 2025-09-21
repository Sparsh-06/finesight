// Simple middleware to validate required fields
export default (fields) => (req, res, next) => {
  for (const field of fields) {
    if (!req.body[field]) {
      return res.status(400).json({ error: `${field} is required` });
    }
  }
  next();
};
