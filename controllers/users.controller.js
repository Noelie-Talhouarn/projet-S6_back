import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import { calculateBadges } from "../utils/badges.js";

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
      emotion: user.emotion || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// --- UPDATE EMOTION ---
export const updateEmotion = async (req, res) => {
  try {
    const { emotion } = req.body;
    const allowedEmotions = ['anxious', 'tired', 'calm', 'joyful', null];

    if (emotion !== undefined && !allowedEmotions.includes(emotion)) {
      return res.status(400).json({ message: "Émotion invalide" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    user.emotion = emotion;
    await user.save();

    res.json({ success: true, emotion: user.emotion });
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

// --- GET USER STATS (Dynamique) ---
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Import des modèles
    const Spark = (await import("../models/Spark.js")).default;
    const BreathingSession = (await import("../models/BreathingSession.js")).default;
    const GameProgress = (await import("../models/GameProgress.js")).default;
    const Star = (await import("../models/Star.js")).default;
    const DailyVisit = (await import("../models/DailyVisit.js")).default;

    // --- 0. Enregistrer la visite du jour (si pas déjà fait) ---
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const existingVisit = await DailyVisit.findOne({
      user: userId,
      createdAt: { $gte: todayStart, $lte: todayEnd }
    });

    if (!existingVisit) {
      await new DailyVisit({ user: userId }).save();
      console.log('✅ Visite quotidienne enregistrée pour le calcul du streak.');
    }

    // --- 1. Calculer les statistiques globales (Total) ---
    // On compte directement les documents en base, ce qui inclut tout l'historique
    const globalStats = {
      stars_count: await Star.countDocuments({ user: userId }),
      breathing_sessions_count: await BreathingSession.countDocuments({ user: userId }),
      games_played_count: await GameProgress.countDocuments({ user: userId, status: 'completed' }),
      sparks_count: await Spark.countDocuments({ user: userId })
    };

    // --- 2. Calculer les statistiques de la SEMAINE en cours ---
    // Trouver le début de la semaine (Lundi à 00:00:00)
    const now = new Date();
    const startOfWeek = new Date(now);

    // Obtenir le jour de la semaine (0 = Dimanche, 1 = Lundi, ..., 6 = Samedi)
    const dayOfWeek = startOfWeek.getUTCDay();

    // Calculer le nombre de jours à soustraire pour arriver au lundi
    // Si on est dimanche (0), on recule de 6 jours
    // Si on est lundi (1), on recule de 0 jours
    // Si on est samedi (6), on recule de 5 jours
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // Reculer au lundi de cette semaine
    startOfWeek.setUTCDate(startOfWeek.getUTCDate() - daysToSubtract);

    // Mettre l'heure à 00:00:00.000 UTC
    startOfWeek.setUTCHours(0, 0, 0, 0);

    console.log('📅 Début de semaine calculé:', startOfWeek.toISOString());
    console.log('📅 Date actuelle:', now.toISOString());

    const weeklyStats = {
      stars_count: await Star.countDocuments({ user: userId, createdAt: { $gte: startOfWeek } }),
      breathing_sessions_count: await BreathingSession.countDocuments({ user: userId, createdAt: { $gte: startOfWeek } }),
      games_played_count: await GameProgress.countDocuments({ user: userId, status: 'completed', lastPlayed: { $gte: startOfWeek } })
    };

    console.log('📊 Stats hebdomadaires:', weeklyStats);

    // Vérifier les sessions de respiration de cette semaine
    const weeklyBreathingSessions = await BreathingSession.find({
      user: userId,
      createdAt: { $gte: startOfWeek }
    }).select('createdAt duration type').lean();

    console.log('🔍 Sessions de respiration cette semaine:', weeklyBreathingSessions);

    // --- 3. Temps GLOBAUX (tout l'historique) ---
    const timeStats = await BreathingSession.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$type",
          totalTime: { $sum: "$duration" },
          count: { $sum: 1 }
        }
      }
    ]);

    // Extraction des temps spécifiques GLOBAUX
    const coherenceStats = timeStats.find(s => s._id === 'coherence_cardiaque') || { totalTime: 0, count: 0 };
    const meditationStats = timeStats.find(s => s._id === 'meditation') || { totalTime: 0, count: 0 };

    // Total global (somme de TOUT le tableau)
    const totalBreathingTime = timeStats.reduce((acc, curr) => acc + curr.totalTime, 0);

    // --- 4. Temps HEBDOMADAIRES (semaine en cours uniquement) ---
    const weeklyTimeStats = await BreathingSession.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), createdAt: { $gte: startOfWeek } } },
      {
        $group: {
          _id: "$type",
          totalTime: { $sum: "$duration" },
          count: { $sum: 1 }
        }
      }
    ]);

    // Extraction des temps spécifiques HEBDO
    const weeklyCoherenceStats = weeklyTimeStats.find(s => s._id === 'coherence_cardiaque') || { totalTime: 0, count: 0 };
    const weeklyMeditationStats = weeklyTimeStats.find(s => s._id === 'meditation') || { totalTime: 0, count: 0 };

    // Total hebdo (somme de TOUT le tableau)
    const weeklyTotalBreathingTime = weeklyTimeStats.reduce((acc, curr) => acc + curr.totalTime, 0);

    console.log("📊 Stats debug (global):", timeStats);
    console.log("📊 Stats debug (hebdo):", weeklyTimeStats);
    console.log("🔍 Cohérence cardiaque - Global:", coherenceStats.totalTime, "s | Hebdo:", weeklyCoherenceStats.totalTime, "s");
    console.log("🔍 Méditation - Global:", meditationStats.totalTime, "s | Hebdo:", weeklyMeditationStats.totalTime, "s");

    // Jours actifs
    const allActivities = await Promise.all([
      Spark.find({ user: userId }).select('createdAt').lean(),
      BreathingSession.find({ user: userId }).select('createdAt').lean(),
      GameProgress.find({ user: userId }).select('lastPlayed').lean(),
      DailyVisit.find({ user: userId }).select('createdAt').lean()
    ]);

    const uniqueDays = new Set();
    allActivities.flat().forEach(activity => {
      const date = activity.createdAt || activity.lastPlayed;
      if (date) uniqueDays.add(new Date(date).toISOString().split('T')[0]);
    });

    console.log('📅 Jours actifs détectés:', Array.from(uniqueDays));

    // --- 4. Calculer le streak (série de jours consécutifs) ---
    const sortedDays = Array.from(uniqueDays).sort().reverse(); // Trier du plus récent au plus ancien
    let currentStreak = 0;

    if (sortedDays.length > 0) {
      // Utiliser UTC pour éviter les problèmes de timezone
      const now = new Date();
      const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
      const todayStr = today.toISOString().split('T')[0];

      const yesterday = new Date(today);
      yesterday.setUTCDate(yesterday.getUTCDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      console.log('🔍 Debug streak - Aujourd\'hui:', todayStr, '| Hier:', yesterdayStr);
      console.log('🔍 Debug streak - Dernier jour actif:', sortedDays[0]);
      console.log('🔍 Debug streak - Jours actifs triés:', sortedDays);

      // Vérifier si l'utilisateur a été actif aujourd'hui OU hier
      let checkDate;
      let startIndex = 0;

      if (sortedDays[0] === todayStr) {
        checkDate = new Date(today);
        currentStreak = 1;
        startIndex = 1; // On a déjà compté aujourd'hui, on passe au jour suivant dans la liste (qui devrait être hier)
      } else if (sortedDays[0] === yesterdayStr) {
        checkDate = new Date(yesterday);
        currentStreak = 1;
        startIndex = 1; // On a compté hier (dernier jour actif), on passe au jour d'avant
      } else {
        // Le dernier jour actif est trop ancien, streak = 0
        currentStreak = 0;
      }

      // Compter les jours consécutifs en remontant dans le temps
      if (currentStreak > 0) {
        // La date qu'on s'attend à trouver à l'itération suivante est "checkDate - 1 jour"
        let expectedDate = new Date(checkDate);

        for (let i = startIndex; i < sortedDays.length; i++) {
          expectedDate.setUTCDate(expectedDate.getUTCDate() - 1);
          const expectedDateStr = expectedDate.toISOString().split('T')[0];

          console.log(`Checking previous day. Expected: ${expectedDateStr}, Found: ${sortedDays[i]}`);

          if (sortedDays[i] === expectedDateStr) {
            currentStreak++;
          } else {
            // Jour manquant, on arrête le comptage
            break;
          }
        }
      }
    }

    console.log('🔥 Streak actuel:', currentStreak, 'jour(s)');

    // --- 5. Calculer les badges débloqués ---
    const badges = calculateBadges({
      stars_count: globalStats.stars_count,
      total_meditation_time: meditationStats.totalTime,
      total_coherence_time: coherenceStats.totalTime
    });

    console.log('🏆 Badges débloqués:', badges.total, '/', badges.totalPossible);

    res.json({
      // Global
      sparks_count: globalStats.sparks_count,
      stars_count: globalStats.stars_count,
      breathing_sessions: globalStats.breathing_sessions_count,
      games_played: globalStats.games_played_count,

      // Hebdo
      weekly_stars_count: weeklyStats.stars_count,
      weekly_breathing_sessions_count: weeklyStats.breathing_sessions_count,
      weekly_games_played_count: weeklyStats.games_played_count,

      // Temps en secondes (pour compatibilité)
      total_breathing_time: totalBreathingTime, // Temps cumulé (secondes)
      total_coherence_time: coherenceStats.totalTime, // Temps spécifique Cohérence (secondes)
      total_meditation_time: meditationStats.totalTime, // Temps spécifique Méditation (secondes)

      // Temps en minutes (pour affichage facile)
      total_breathing_minutes: Math.round(totalBreathingTime / 60),
      total_coherence_minutes: Math.round(coherenceStats.totalTime / 60),
      total_meditation_minutes: Math.round(meditationStats.totalTime / 60),

      // Temps HEBDOMADAIRES en secondes (pour petites valeurs)
      weekly_breathing_time: weeklyTotalBreathingTime,
      weekly_coherence_time: weeklyCoherenceStats.totalTime,
      weekly_meditation_time: weeklyMeditationStats.totalTime,

      // Temps HEBDOMADAIRES en minutes (pour affichage facile)
      weekly_breathing_minutes: Math.round(weeklyTotalBreathingTime / 60),
      weekly_coherence_minutes: Math.round(weeklyCoherenceStats.totalTime / 60),
      weekly_meditation_minutes: Math.round(weeklyMeditationStats.totalTime / 60),

      // Autres
      days_active: uniqueDays.size,
      current_streak: currentStreak, // 🔥 Série de jours consécutifs

      // Badges ✨ NOUVEAU
      badges: badges
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
    const Star = (await import("../models/Star.js")).default;

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

    // Supprimer les étoiles (ciel étoilé)
    const deletedStars = await Star.deleteMany({ user: userId });
    console.log(`  ✓ ${deletedStars.deletedCount} étoiles supprimées`);

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

// --- GET MANDALA LEVEL ---
export const getMandalaLevel = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('mandalaLevel');
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    res.json({ level: user.mandalaLevel || 1 });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// --- UPDATE MANDALA LEVEL ---
export const updateMandalaLevel = async (req, res) => {
  try {
    const { level } = req.body;

    if (!level || typeof level !== 'number') {
      return res.status(400).json({ message: "Le niveau doit être un nombre." });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    // On s'assure de ne pas rétrograder le niveau (sauf si c'est voulu ? ici je protège)
    // Si tu veux permettre de rejouer des niveaux, tu peux enlever cette condition, 
    // mais pour la "sauvegarde de progression", on veut souvent le niveau MAX atteint.
    if (level > (user.mandalaLevel || 1)) {
      user.mandalaLevel = level;
      await user.save();
    }

    res.json({ message: "Progression sauvegardée", level: user.mandalaLevel });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// --- GET PUZZLE LEVEL ---
export const getPuzzleLevel = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('puzzleLevel');
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    res.json({ level: user.puzzleLevel || 1 });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// --- UPDATE PUZZLE LEVEL ---
export const updatePuzzleLevel = async (req, res) => {
  try {
    const { level } = req.body;

    if (!level || typeof level !== 'number') {
      return res.status(400).json({ message: "Le niveau doit être un nombre." });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    // On s'assure de ne pas rétrograder le niveau
    if (level > (user.puzzleLevel || 1)) {
      user.puzzleLevel = level;
      await user.save();
    }

    res.json({ message: "Progression sauvegardée", level: user.puzzleLevel });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
