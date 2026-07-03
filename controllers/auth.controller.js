import { generateToken } from "../data/token.js";

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (email === "admin@gmail.com" && password === "123456") {
            const token = generateToken({ id: 1, email: email });
            res.json({ token });
        } else {
            res.status(401).json({ message: 'Credenciales inválidas' });
        }
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
}
