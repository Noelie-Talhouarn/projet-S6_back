# ✨ Ciel Étoilé - Résumé

## 🌟 Fonctionnalité
Interface poétique permettant aux utilisateurs de placer des souvenirs (étoiles) dans un ciel virtuel.

---

## 📋 Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/stars` | Récupérer toutes les étoiles |
| POST | `/api/stars` | Créer une étoile (x, y, message) |
| DELETE | `/api/stars/:id` | Supprimer une étoile |

---

## 📁 Fichiers Créés
- ✅ `models/Star.js`
- ✅ `controllers/stars.controller.js`
- ✅ `routes/stars.js`

---

## 🧪 Test Rapide (PowerShell)

```powershell
# 1. Connexion (recup token)
$login = @{ email = "ton.email@example.com"; mot_de_passe = "password" } | ConvertTo-Json
$token = (Invoke-RestMethod -Uri "http://localhost:3002/api/users/login" -Method POST -Body $login -ContentType "application/json").token
$headers = @{ "Authorization" = "Bearer $token" }

# 2. Créer une étoile
$star = @{ x=50; y=50; message="Test étoile"; intensity="large" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3002/api/stars" -Method POST -Headers $headers -Body $star -ContentType "application/json"

# 3. Voir les étoiles
Invoke-RestMethod -Uri "http://localhost:3002/api/stars" -Method GET -Headers $headers
```

---

**Documentation complète** : `API_STARS_DOCUMENTATION.md`
