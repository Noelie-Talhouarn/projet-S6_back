# ✨ Endpoints de Profil Utilisateur - L'Étincelle

## 📋 Résumé

5 endpoints ont été créés pour gérer le profil utilisateur :

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/users/profile` | Récupérer le profil |
| PUT | `/api/users/profile` | Mettre à jour le profil |
| GET | `/api/users/stats` | Récupérer les statistiques |
| PUT | `/api/users/preferences` | Sauvegarder les préférences |
| DELETE | `/api/users/account` | Supprimer le compte (⚠️ irréversible) |

**🔐 Authentification** : Tous les endpoints nécessitent un token JWT dans le header `Authorization: Bearer <token>`

---

## 📁 Fichiers Modifiés

### Modèles
- ✅ `models/User.js` - Ajout de `avatar`, `preferences`, renommage `date_creation` → `date_inscription`
- ✅ `models/Spark.js` - Ajout du champ `user`
- ✅ `models/BreathingSession.js` - **Nouveau modèle** pour les sessions de respiration

### Contrôleurs
- ✅ `controllers/users.controller.js` - 5 nouveaux contrôleurs ajoutés

### Routes
- ✅ `routes/users.js` - 5 nouvelles routes ajoutées

---

## 🧪 Test Rapide

```powershell
# 1. Connexion
$login = @{ email = "ton.email@example.com"; mot_de_passe = "password" } | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:3002/api/users/login" -Method POST -Body $login -ContentType "application/json"
$token = $response.token

# 2. Récupérer le profil
$headers = @{ "Authorization" = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:3002/api/users/profile" -Method GET -Headers $headers | ConvertTo-Json

# 3. Récupérer les statistiques
Invoke-RestMethod -Uri "http://localhost:3002/api/users/stats" -Method GET -Headers $headers | ConvertTo-Json
```

---

## 📖 Documentation Complète

Pour plus de détails, consulte : **`API_PROFIL_DOCUMENTATION.md`**

---

**Créé avec ✨ pour L'Étincelle**
