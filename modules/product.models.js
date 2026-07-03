import { db } from "../data/product.data.js";
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export const getAllProductsModel = async () => {
    const productsCollection = collection(db, 'products');
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export const getProductByIdModel = async (id) => {
    const productDocById = doc(db, 'products', id);
    const snapshot = await getDoc(productDocById);
    if (!snapshot.exists()) {
        return null;
    }
    return { id: snapshot.id, ...snapshot.data() };
}

export const createProductModel = async (newProduct) => {
    const productsCollection = collection(db, 'products');
    const snapshot = await addDoc(productsCollection, newProduct);
    return snapshot.id;
}


export const updateProductModel = async (id, updateProduct) => {
    const productDocById = doc(db, 'products', id);
    const docSnap = await getDoc(productDocById);
    if (!docSnap.exists()) return null;
    await updateDoc(productDocById, updateProduct);
    return { id, ...updateProduct };
}

export const deleteProductModel = async (id) => {
    const productDocById = doc(db, 'products', id);
    const docSnap = await getDoc(productDocById);
    if (!docSnap.exists()) return null;
    await deleteDoc(productDocById);
    return { id };
}