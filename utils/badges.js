/**
 * Configuration des badges pour "L'Étincelle"
 * Chaque badge a un ID unique, un nom, une description, un emoji et un seuil
 */

export const BADGES = {
    // 🌟 Badges Étoiles
    stars: [
        {
            id: 'first_star',
            name: 'Première Lueur',
            description: 'Créer ta première étoile',
            emoji: '🌟',
            threshold: 1,
            category: 'stars'
        },
        {
            id: 'constellation_rising',
            name: 'Constellation Naissante',
            description: 'Créer 3 étoiles',
            emoji: '⭐',
            threshold: 3,
            category: 'stars'
        },
        {
            id: 'star_guardian',
            name: 'Gardien des Étoiles',
            description: 'Créer 9 étoiles',
            emoji: '🌠',
            threshold: 9,
            category: 'stars'
        },
        {
            id: 'sky_master',
            name: 'Maître du Ciel',
            description: 'Créer 27 étoiles',
            emoji: '✨',
            threshold: 27,
            category: 'stars'
        },
        {
            id: 'galaxy_creator',
            name: 'Créateur de Galaxies',
            description: 'Créer 81 étoiles',
            emoji: '🌌',
            threshold: 81,
            category: 'stars'
        }
    ],

    // 🧘 Badges Méditation (temps en secondes)
    meditation: [
        {
            id: 'first_flame',
            name: 'Première Flamme',
            description: 'Méditer pendant 5 minutes',
            emoji: '🕯️',
            threshold: 300, // 5 minutes
            category: 'meditation'
        },
        {
            id: 'inner_explorer',
            name: 'Explorateur Intérieur',
            description: 'Méditer pendant 30 minutes',
            emoji: '🌸',
            threshold: 1800, // 30 minutes
            category: 'meditation'
        },
        {
            id: 'dedicated_meditator',
            name: 'Méditant Assidu',
            description: 'Méditer pendant 2 heures',
            emoji: '🧘',
            threshold: 7200, // 2 heures
            category: 'meditation'
        },
        {
            id: 'contemplative_sage',
            name: 'Sage Contemplatif',
            description: 'Méditer pendant 10 heures',
            emoji: '🌙',
            threshold: 36000, // 10 heures
            category: 'meditation'
        },
        {
            id: 'zen_master',
            name: 'Maître Zen',
            description: 'Méditer pendant 50 heures',
            emoji: '🪷',
            threshold: 180000, // 50 heures
            category: 'meditation'
        }
    ],

    // 💫 Badges Cohérence Cardiaque (temps en secondes)
    coherence: [
        {
            id: 'first_breath',
            name: 'Premier Souffle',
            description: 'Pratiquer la cohérence cardiaque pendant 5 minutes',
            emoji: '💨',
            threshold: 300, // 5 minutes
            category: 'coherence'
        },
        {
            id: 'conscious_breather',
            name: 'Respirant Conscient',
            description: 'Pratiquer la cohérence cardiaque pendant 30 minutes',
            emoji: '🌬️',
            threshold: 1800, // 30 minutes
            category: 'coherence'
        },
        {
            id: 'harmonious_heart',
            name: 'Cœur Harmonieux',
            description: 'Pratiquer la cohérence cardiaque pendant 2 heures',
            emoji: '💫',
            threshold: 7200, // 2 heures
            category: 'coherence'
        },
        {
            id: 'breath_master',
            name: 'Maître du Souffle',
            description: 'Pratiquer la cohérence cardiaque pendant 10 heures',
            emoji: '🌊',
            threshold: 36000, // 10 heures
            category: 'coherence'
        },
        {
            id: 'rhythm_alchemist',
            name: 'Alchimiste du Rythme',
            description: 'Pratiquer la cohérence cardiaque pendant 50 heures',
            emoji: '🌀',
            threshold: 180000, // 50 heures
            category: 'coherence'
        }
    ]
};

/**
 * Calcule les badges débloqués pour un utilisateur
 * @param {Object} stats - Les statistiques de l'utilisateur
 * @returns {Object} - Les badges débloqués et verrouillés
 */
export const calculateBadges = (stats) => {
    const unlockedBadges = [];
    const lockedBadges = [];
    const nextBadges = {}; // Prochain badge à débloquer par catégorie

    // Fonction helper pour traiter une catégorie de badges
    const processBadgeCategory = (badges, value, categoryKey) => {
        let lastUnlocked = null;
        let nextBadge = null;

        badges.forEach((badge) => {
            if (value >= badge.threshold) {
                // Badge débloqué
                unlockedBadges.push({
                    ...badge,
                    unlockedAt: new Date(), // On pourrait stocker la vraie date plus tard
                    progress: 100
                });
                lastUnlocked = badge;
            } else {
                // Badge verrouillé
                const progress = Math.min(100, Math.round((value / badge.threshold) * 100));

                lockedBadges.push({
                    ...badge,
                    progress,
                    remaining: badge.threshold - value
                });

                // Le premier badge verrouillé est le prochain à débloquer
                if (!nextBadge) {
                    nextBadge = {
                        ...badge,
                        progress,
                        remaining: badge.threshold - value
                    };
                }
            }
        });

        if (nextBadge) {
            nextBadges[categoryKey] = nextBadge;
        }

        return lastUnlocked;
    };

    // Traiter chaque catégorie
    processBadgeCategory(BADGES.stars, stats.stars_count || 0, 'stars');
    processBadgeCategory(BADGES.meditation, stats.total_meditation_time || 0, 'meditation');
    processBadgeCategory(BADGES.coherence, stats.total_coherence_time || 0, 'coherence');

    return {
        unlocked: unlockedBadges,
        locked: lockedBadges,
        next: nextBadges,
        total: unlockedBadges.length,
        totalPossible: BADGES.stars.length + BADGES.meditation.length + BADGES.coherence.length
    };
};
