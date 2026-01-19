import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'etincelle_secret_key_12345';

export const authMiddleware = (req, res, next) => {
    // 1. Récupérer le token du header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentification requise.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Vérifier le token
        const decoded = jwt.verify(token, JWT_SECRET);

        // 3. Ajouter les infos de l'utilisateur à la requête
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token invalide ou expiré.' });
    }
};
