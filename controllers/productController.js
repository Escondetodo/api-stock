import { getAllProductsService, getProductByIdService, getProductsByFiltersService, createProductService, updateProductService, deleteProductService } from '../services/productService.js';

export const getAllProducts = async (req, res) => {
    try {
        const category = req.query.category;
        const price = req.query.price;
        const products = await getProductsByFiltersService({ categoria: category, precio: price });

        if (products.length === 0 && (category !== undefined || price !== undefined)) {
            return res.status(404).json({ error: 'No se encontraron productos con esos filtros' });
        }

        return res.status(200).json(products);

    } catch (error) {
        console.error('Error en getAllProducts:', error);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
}

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await getProductByIdService(id);
        if (!result) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(result);
    } catch (error) {
        console.error('Error en getProductById:', error);
        res.status(500).json({ message: 'Error al obtener el producto' });
    }
}

export const createProduct = async (req, res) => {
    try {
        const { nombre, categoria, precio, stock } = req.body;
        if (!nombre || !categoria || precio === undefined || stock === undefined) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }
        const newProduct = await createProductService(nombre, categoria, Number(precio), Number(stock));
        if (!newProduct) {
            return res.status(400).json({ message: 'Error al crear el producto' });
        }
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error en createProduct:', error);
        res.status(500).json({ message: 'Error al crear el producto' });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const productData = req.body;
        const updatedProduct = await updateProductService(id, productData);
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error en updateProduct:', error);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await deleteProductService(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.json(deletedProduct);
    } catch (error) {
        console.error('Error en deleteProduct:', error);
        res.status(500).json({ message: 'Error al eliminar el producto' });
    }
}