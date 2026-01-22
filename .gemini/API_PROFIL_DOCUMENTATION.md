# 📋 Documentation des Endpoints de Profil Utilisateur

Cette documentation décrit les 4 nouveaux endpoints créés pour la page de profil de "L'Étincelle".

## 🔐 Authentification

Tous ces endpoints nécessitent un **token JWT** dans le header `Authorization` :

```
Authorization: Bearer <votre_token_jwt>
```

Le token est obtenu lors de la connexion via `/api/users/login`.

---

## 1️⃣ GET /api/users/profile

**Description** : Récupère les informations du profil utilisateur connecté.

### Requête
```http
GET /api/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Réponse (200 OK)
```json
{
  "prenom": "Jean",
  "nom": "Dupont",
  "email": "jean.dupont@example.com",
  "date_inscription": "2026-01-15T10:30:00.000Z",
  "avatar": ""
}
```

### Codes d'erreur
- **401** : Token manquant ou invalide
- **404** : Utilisateur non trouvé
- **500** : Erreur serveur

---

## 2️⃣ PUT /api/users/profile

**Description** : Met à jour les informations du profil utilisateur.

### Requête
```http
PUT /api/users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "prenom": "Jean",
  "nom": "Dupont",
  "email": "jean.dupont@example.com"
}
```

### Réponse (200 OK)
```json
{
  "message": "Profil mis à jour avec succès",
  "user": {
    "prenom": "Jean",
    "nom": "Dupont",
    "email": "jean.dupont@example.com"
  }
}
```

### Codes d'erreur
- **400** : Données invalides (champs manquants)
- **401** : Token manquant ou invalide
- **404** : Utilisateur non trouvé
- **409** : Email déjà utilisé par un autre utilisateur
- **500** : Erreur serveur

---

## 3️⃣ GET /api/users/stats

**Description** : Récupère les statistiques d'activité de l'utilisateur.

### Requête
```http
GET /api/users/stats
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Réponse (200 OK)
```json
{
  "sparks_count": 12,
  "breathing_sessions": 8,
  "total_breathing_time": 45,
  "games_played": 5,
  "days_active": 7
}
```

### Détails des statistiques

| Champ | Description |
|-------|-------------|
| `sparks_count` | Nombre total d'étincelles (notes quotidiennes) créées |
| `breathing_sessions` | Nombre de sessions de respiration/méditation effectuées |
| `total_breathing_time` | Temps total de respiration en minutes |
| `games_played` | Nombre de jeux complétés (status = 'completed') |
| `days_active` | Nombre de jours uniques où l'utilisateur a été actif |

### Codes d'erreur
- **401** : Token manquant ou invalide
- **500** : Erreur serveur

---

## 4️⃣ PUT /api/users/preferences

**Description** : Sauvegarde les préférences utilisateur.

### Requête
```http
PUT /api/users/preferences
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "notifications": true,
  "daily_quote": true,
  "dark_mode": true
}
```

**Note** : Vous pouvez envoyer seulement les préférences que vous souhaitez modifier. Les autres resteront inchangées.

### Réponse (200 OK)
```json
{
  "message": "Préférences enregistrées",
  "preferences": {
    "notifications": true,
    "daily_quote": true,
    "dark_mode": true
  }
}
```

### Codes d'erreur
- **401** : Token manquant ou invalide
- **404** : Utilisateur non trouvable
- **500** : Erreur serveur

---

## 🧪 Tester les Endpoints

### Avec cURL

```bash
# 1. Se connecter pour obtenir un token
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","mot_de_passe":"password123"}'

# 2. Récupérer le profil
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer VOTRE_TOKEN"

# 3. Mettre à jour le profil
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prenom":"Marie","nom":"Martin","email":"marie.martin@example.com"}'

# 4. Récupérer les statistiques
curl -X GET http://localhost:3000/api/users/stats \
  -H "Authorization: Bearer VOTRE_TOKEN"

# 5. Mettre à jour les préférences
curl -X PUT http://localhost:3000/api/users/preferences \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notifications":false,"dark_mode":true}'
```

### Avec Postman / Insomnia

1. Créez une nouvelle requête
2. Ajoutez le header `Authorization: Bearer <token>`
3. Pour PUT, sélectionnez "Body" → "raw" → "JSON"
4. Collez le JSON de la requête

---

## 🔄 Modifications apportées

### Modèle User (`models/User.js`)
- ✅ Ajout du champ `avatar` (String, default: '')
- ✅ Ajout du champ `preferences` (Object avec notifications, daily_quote, dark_mode)
- ✅ Renommage de `date_creation` en `date_inscription`

### Nouveau Modèle BreathingSession (`models/BreathingSession.js`)
- ✅ Création du modèle pour tracker les sessions de respiration
- ✅ Champs : user, duration, type, createdAt

### Modèle Spark (`models/Spark.js`)
- ✅ Ajout du champ `user` pour lier les sparks aux utilisateurs

### Contrôleurs (`controllers/users.controller.js`)
- ✅ `getProfile` : Récupération du profil formaté
- ✅ `updateProfile` : Mise à jour avec validation
- ✅ `getUserStats` : Calcul des statistiques depuis la DB
- ✅ `updatePreferences` : Sauvegarde des préférences

### Routes (`routes/users.js`)
- ✅ GET `/api/users/profile`
- ✅ PUT `/api/users/profile`
- ✅ GET `/api/users/stats`
- ✅ PUT `/api/users/preferences`

---

## 💡 Notes Importantes

### Pour les Statistiques
Les statistiques sont calculées en temps réel depuis la base de données. Pour que les statistiques soient précises :

1. **Sparks** : Assurez-vous que chaque spark créé contient le champ `user`
2. **Sessions de respiration** : Utilisez le modèle `BreathingSession` pour enregistrer les sessions
3. **Jeux** : Le modèle `GameProgress` doit avoir le status 'completed' pour être compté

### Exemple d'enregistrement d'une session de respiration

```javascript
import BreathingSession from './models/BreathingSession.js';

// Après une session de respiration
const session = new BreathingSession({
  user: req.user.id,
  duration: 5, // 5 minutes
  type: 'coherence_cardiaque'
});
await session.save();
```

---

## 🌟 Prochaines Étapes

Pour compléter l'intégration avec le frontend Nuxt.js :

1. Créer un composable `useUserProfile.js` pour gérer les appels API
2. Créer une page `profile.vue` qui utilise ces endpoints
3. Ajouter un système d'upload d'avatar
4. Implémenter la persistance des préférences (dark mode, etc.)

---

**Créé avec ✨ pour L'Étincelle**
