import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Accès refusé. Token manquant." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "etincelle_secret_key_12345");
        req.user = decoded; // On attache les infos du token à req.user
        next();
    } catch (error) {
        res.status(401).json({ message: "Token invalide ou expiré" });
    }
};