import { getAllProductsModel, getProductByIdModel, createProductModel, updateProductModel, deleteProductModel} from "../modules/product.models.js";

export const getAllProductsService = async () => {
    return await getAllProductsModel();
}

export const getProductByIdService = async (id) => {
    const productById = await getProductByIdModel(id);
    return productById || null;
}

export const getProductsByFiltersService = async (filters) => {
    const { categoria, precio } = filters;
    const products = await getAllProductsModel();

    if (categoria === undefined && precio === undefined) {
        return products;
    }

    return products.filter(product => {
        let match = true;
        if (categoria !== undefined) {
            match = match && product.categoria === categoria;
        }
        if (precio !== undefined) {
            match = match && product.precio <= Number(precio);
        }
        return match;
    });
}

export const createProductService = async (nombre, categoria, precio, stock) => {
    const newProduct = { nombre, categoria, precio, stock };
    return await createProductModel (newProduct);
}

export const updateProductService = async (id, updatedProduct) => {
    return await updateProductModel(id, updatedProduct);
}

export const deleteProductService = async (id) => {
    return await deleteProductModel(id);
}
