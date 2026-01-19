import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Générer un JWT (L'étincelle de connexion)
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, nom: user.nom },
    process.env.JWT_SECRET || "etincelle_secret_key_12345",
    { expiresIn: "7d" }
  );
};

// --- REGISTER ---
export const register = async (req, res) => {
  try {
    const { nom, prenom, email, mot_de_passe } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "Email déjà utilisé" });

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // Créer et sauvegarder dans MongoDB Atlas
    const newUser = new User({ nom, prenom, email, mot_de_passe: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'inscription", error: error.message });
  }
};

// --- LOGIN ---
export const login = async (req, res) => {
  try {
    const { email, mot_de_passe } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Identifiants invalides" });

    // Comparer les mots de passe
    const isValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isValid) return res.status(401).json({ message: "Identifiants invalides" });

    const token = generateToken(user);
    res.json({ message: "Connexion réussie", token, user: { id: user._id, nom: user.nom, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// --- GET PROFILE ---
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-mot_de_passe"); // On exclut le MDP
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};