import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
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
    const user = await User.findById(req.user.id).select("-mot_de_passe");
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    // Formater la réponse selon le format attendu
    res.json({
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      date_inscription: user.date_inscription,
      avatar: user.avatar || "",
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// --- UPDATE PROFILE ---
export const updateProfile = async (req, res) => {
  try {
    const { prenom, nom, email } = req.body;

    // Validation des données
    if (!prenom || !nom || !email) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email !== req.user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.user.id) {
        return res.status(409).json({ message: "Cet email est déjà utilisé" });
      }
    }

    // Mettre à jour l'utilisateur
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { prenom, nom, email },
      { new: true, runValidators: true }
    ).select("-mot_de_passe");

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json({
      message: "Profil mis à jour avec succès",
      user: {
        prenom: updatedUser.prenom,
        nom: updatedUser.nom,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
};

// --- GET USER STATS ---
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Import des modèles nécessaires (dynamique pour éviter les dépendances circulaires)
    const Spark = (await import("../models/Spark.js")).default;
    const BreathingSession = (await import("../models/BreathingSession.js")).default;
    const GameProgress = (await import("../models/GameProgress.js")).default;

    // 1. Compter les sparks (étincelles/notes quotidiennes)
    const sparksCount = await Spark.countDocuments({ user: userId });

    // 2. Compter les sessions de respiration
    const breathingSessions = await BreathingSession.countDocuments({ user: userId });

    // 3. Calculer le temps total de respiration (en minutes)
    const breathingTimeResult = await BreathingSession.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: null, total: { $sum: "$duration" } } }
    ]);
    const totalBreathingTime = breathingTimeResult.length > 0 ? breathingTimeResult[0].total : 0;

    // 4. Compter les jeux complétés
    const gamesPlayed = await GameProgress.countDocuments({
      user: userId,
      status: 'completed'
    });

    // 5. Calculer les jours actifs (jours uniques avec au moins une activité)
    const allActivities = await Promise.all([
      Spark.find({ user: userId }).select('createdAt').lean(),
      BreathingSession.find({ user: userId }).select('createdAt').lean(),
      GameProgress.find({ user: userId }).select('lastPlayed').lean(),
    ]);

    // Extraire toutes les dates et les convertir en jours uniques
    const uniqueDays = new Set();
    allActivities.flat().forEach(activity => {
      const date = activity.createdAt || activity.lastPlayed;
      if (date) {
        const dayKey = new Date(date).toISOString().split('T')[0];
        uniqueDays.add(dayKey);
      }
    });

    res.json({
      sparks_count: sparksCount,
      breathing_sessions: breathingSessions,
      total_breathing_time: totalBreathingTime,
      games_played: gamesPlayed,
      days_active: uniqueDays.size,
    });
  } catch (error) {
    console.error("Erreur dans getUserStats:", error);
    res.status(500).json({ message: "Erreur lors du calcul des statistiques", error: error.message });
  }
};

// --- UPDATE PREFERENCES ---
export const updatePreferences = async (req, res) => {
  try {
    const { notifications, daily_quote, dark_mode } = req.body;

    // Construire l'objet de préférences (ne mettre à jour que les champs fournis)
    const preferencesUpdate = {};
    if (typeof notifications === 'boolean') preferencesUpdate['preferences.notifications'] = notifications;
    if (typeof daily_quote === 'boolean') preferencesUpdate['preferences.daily_quote'] = daily_quote;
    if (typeof dark_mode === 'boolean') preferencesUpdate['preferences.dark_mode'] = dark_mode;

    // Mettre à jour les préférences
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: preferencesUpdate },
      { new: true, runValidators: true }
    ).select('preferences');

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json({
      message: "Préférences enregistrées",
      preferences: updatedUser.preferences,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour des préférences", error: error.message });
  }
};

// --- DELETE ACCOUNT ---
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Import des modèles nécessaires
    const Spark = (await import("../models/Spark.js")).default;
    const BreathingSession = (await import("../models/BreathingSession.js")).default;
    const GameProgress = (await import("../models/GameProgress.js")).default;

    // 1. Supprimer toutes les données associées à l'utilisateur
    console.log(`🗑️ Suppression des données pour l'utilisateur ${userId}...`);

    // Supprimer les sparks (étincelles)
    const deletedSparks = await Spark.deleteMany({ user: userId });
    console.log(`  ✓ ${deletedSparks.deletedCount} sparks supprimés`);

    // Supprimer les sessions de respiration
    const deletedSessions = await BreathingSession.deleteMany({ user: userId });
    console.log(`  ✓ ${deletedSessions.deletedCount} sessions de respiration supprimées`);

    // Supprimer les progressions de jeux
    const deletedProgress = await GameProgress.deleteMany({ user: userId });
    console.log(`  ✓ ${deletedProgress.deletedCount} progressions de jeux supprimées`);

    // 2. Supprimer le compte utilisateur
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    console.log(`✅ Compte utilisateur ${deletedUser.email} supprimé avec succès`);

    // 3. Retourner une confirmation
    res.json({
      message: "Compte supprimé avec succès",
      deleted: {
        user: {
          email: deletedUser.email,
          nom: deletedUser.nom,
          prenom: deletedUser.prenom,
        },
        data: {
          sparks: deletedSparks.deletedCount,
          breathing_sessions: deletedSessions.deletedCount,
          game_progress: deletedProgress.deletedCount,
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors de la suppression du compte:", error);
    res.status(500).json({ message: "Erreur lors de la suppression du compte", error: error.message });
  }
};
