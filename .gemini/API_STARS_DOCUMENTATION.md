# ✨ API Ciel Étoilé - L'Étincelle

## 🌟 Concept

La fonctionnalité **Ciel Étoilé** permet aux utilisateurs de placer des "étoiles" dans un ciel virtuel. Chaque étoile représente un mot doux, un souvenir ou une pensée positive. Les étoiles ont une position (x, y) et une intensité (taille).

---

## 🔐 Authentification

Tous les endpoints nécessitent un **token JWT** dans le header `Authorization: Bearer <token>`

---

## 📋 Endpoints

### 1️⃣ GET /api/stars

**Description** : Renvoie la liste de toutes les étoiles de l'utilisateur connecté.

**Réponse (200 OK)** :
```json
[
  {
    "id": "65123abc...",
    "x": 25.5,
    "y": 60.2,
    "message": "Souvenir d'un beau moment",
    "intensity": "medium",
    "date": "2026-01-22T12:00:00.000Z",
    "createdAt": "2026-01-22T12:00:00.000Z"
  },
  {
    "id": "65456def...",
    "x": 80.0,
    "y": 15.5,
    "message": "Gratitude",
    "intensity": "large",
    "date": "2026-01-20T10:00:00.000Z",
    "createdAt": "2026-01-20T10:00:00.000Z"
  }
]
```

---

### 2️⃣ POST /api/stars

**Description** : Crée une nouvelle étoile dans le ciel.

**Body (JSON)** :
- `x` (number, requis) : Position horizontale en % (0-100)
- `y` (number, requis) : Position verticale en % (0-100)
- `message` (string, requis) : Le mot doux ou souvenir
- `intensity` (string, optionnel) : 'small', 'medium', 'large' (défaut: 'medium')
- `date` (date, optionnel) : Date du souvenir (défaut: maintenant)

**Exemple de requête** :
```json
{
  "x": 45.5,
  "y": 30.0,
  "message": "J'ai réussi mon examen !",
  "intensity": "large"
}
```

**Réponse (201 Created)** :
```json
{
  "message": "Étoile ajoutée au ciel ✨",
  "star": {
      "id": "65789ghi...",
      "x": 45.5,
      "y": 30.0,
      "message": "J'ai réussi mon examen !",
      "intensity": "large",
      "date": "2026-01-22T14:30:00.000Z",
      "createdAt": "2026-01-22T14:30:00.000Z"
  }
}
```

**Codes d'erreur** :
- `400` : Données invalides (x/y hors limites ou message manquant)
- `500` : Erreur serveur

---

### 3️⃣ DELETE /api/stars/:id

**Description** : Supprime une étoile par son ID.

**Exemple** : `DELETE /api/stars/65789ghi...`

**Réponse (200 OK)** :
```json
{
  "message": "Étoile supprimée du ciel",
  "id": "65789ghi..."
}
```

**Codes d'erreur** :
- `404` : Étoile introuvable ou n'appartient pas à l'utilisateur
- `500` : Erreur serveur

---

## 🎨 Intégration Frontend (Conseils)

- **Affichage** : Utilisez `position: absolute` avec `left: x%` et `top: y%` pour placer les étoiles dans un conteneur relatif représentant le ciel.
- **Taille** : Mappez l'intensité aux tailles CSS (ex: small=10px, medium=15px, large=20px).
- **Interactivité** : Au clic/survol d'une étoile, affichez le `message` et la `date`.

**Exemple CSS/Vue** :
```html
<div class="sky-container">
  <div 
    v-for="star in stars" 
    :key="star.id"
    class="star"
    :class="star.intensity"
    :style="{ left: star.x + '%', top: star.y + '%' }"
    @click="showDetails(star)"
  ></div>
</div>
```

---

**Créé avec ✨ pour L'Étincelle**
