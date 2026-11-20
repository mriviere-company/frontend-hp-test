# Production scheduling — front end of a technical test

*[Version française plus bas](#français)*

The front end of a technical test from autumn 2024, built with **Next.js 14, React 18,
Tailwind CSS and Axios** (JavaScript). It drives the Laravel API of
[`backend-hp-test`](https://github.com/mriviere-company/backend-hp-test): list, create,
update and delete orders, and display the computed production schedule.

## Pages

| Route | Purpose |
|---|---|
| `/` | Order list |
| `/new-order` | Create an order |
| `/update-order/{id}` | Update or delete an order |
| `/schedule` | Production schedule computed by the API |

## Run it

```bash
# .env.local
NEXT_PUBLIC_API_KEY="the API key configured in the back end"
NEXT_PUBLIC_BACKEND_URI="URL of the back end"

npm install
npm run dev          # development
npm run build && npm start   # production
```

## Known limits (as delivered)

- Minimal interface: functional, not polished.
- No translations yet (FR/EN switch planned).
- The API key is exposed to the browser (`NEXT_PUBLIC_*`), acceptable for a test, not for
  production: a server-side proxy or real user authentication would replace it.
- The Vercel demo from that time is no longer online.

---

<a id="français"></a>

# Planification de production — front d'un test technique

Le front d'un test technique de l'automne 2024, en **Next.js 14, React 18, Tailwind CSS
et Axios** (JavaScript). Il pilote l'API Laravel de
[`backend-hp-test`](https://github.com/mriviere-company/backend-hp-test) : lister, créer,
modifier et supprimer des commandes, et afficher le planning de production calculé.

## Limites connues (à la livraison)

- Interface minimale : fonctionnelle, pas finalisée.
- Pas encore de traductions (bascule FR/EN prévue).
- La clé d'API est exposée au navigateur (`NEXT_PUBLIC_*`) : acceptable pour un test, pas en
  production, où un proxy côté serveur ou une vraie authentification la remplacerait.
- La démo Vercel de l'époque n'est plus en ligne.
