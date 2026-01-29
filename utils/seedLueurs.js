import Lueur from '../models/Lueur.js';

export const seedLueurs = async () => {
    try {
        const count = await Lueur.countDocuments();

        if (count === 0) {
            const defaultLueurs = [
                {
                    id_technique: 'lueur_paix',
                    nom: 'Souffle de Paix',
                    description: 'Une lueur bleutée apaisante.',
                    image_url: '/images/avatars/lueur-paix.png',
                    couleur_principale: '#AEE1FF',
                    couleur_secondaire: '#2196F3',
                    intensite: 0.7,
                    type_animation: 'breathe'
                },
                {
                    id_technique: 'lueur_joie',
                    nom: 'Éclat de Joie',
                    description: 'Une énergie pétillante et chaleureuse.',
                    image_url: '/images/avatars/lueur-joie.png',
                    couleur_principale: '#FFD700',
                    couleur_secondaire: '#FFA500',
                    intensite: 0.9,
                    type_animation: 'pulse'
                },
                {
                    id_technique: 'lueur_creativite',
                    nom: 'Brume d\'Inspiration',
                    description: 'Des nuances violettes pour l\'imaginaire.',
                    image_url: '/images/avatars/lueur-creativite.png',
                    couleur_principale: '#E0B0FF',
                    couleur_secondaire: '#9C27B0',
                    intensite: 0.75,
                    type_animation: 'float'
                },
                {
                    id_technique: 'lueur_ancrage',
                    nom: 'Force Terrestre',
                    description: 'Une lueur orangée pour se recentrer.',
                    image_url: '/images/avatars/lueur-ancrage.png',
                    couleur_principale: '#FFAB76',
                    couleur_secondaire: '#E65100',
                    intensite: 0.8,
                    type_animation: 'none'
                },
                {
                    id_technique: 'lueur_espoir',
                    nom: 'Aube Naissante',
                    description: 'Un vert tendre pour un nouveau départ.',
                    image_url: '/images/avatars/lueur-espoir.png',
                    couleur_principale: '#C3F0C1',
                    couleur_secondaire: '#4CAF50',
                    intensite: 0.65,
                    type_animation: 'breathe'
                }
            ];

            await Lueur.insertMany(defaultLueurs);
            console.log('✨ Les Lueurs initiales ont été semées avec amour.');
        }
    } catch (error) {
        console.error('❌ Erreur lors du seeding des lueurs:', error.message);
    }
};
