const { updateProductImage } = require('../services/upload.service');
const { logger } = require('../../../utils/logger');

const uploadImageController = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const sellerId = req.user.id; // From JWT
    const file = req.file;
    if (!file) {
      throw new Error('No file uploaded');
    }
    const imageUrl = `/uploads/${file.filename}`; // Local storage path
    const result = await updateProductImage(productId, sellerId, imageUrl);
    res.json({ imageUrl: result.image_url });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadImageController };