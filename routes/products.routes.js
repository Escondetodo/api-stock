import express from 'express';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { authentication } from '../middleware/authentication.js';
const router = express.Router();

router.get('/api/products', getAllProducts);
router.get('/api/products/:id', getProductById);
router.post('/api/products/create', authentication, createProduct);
router.put('/api/products/:id', authentication, updateProduct);
router.delete('/api/products/:id', authentication, deleteProduct);

export default router;