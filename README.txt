# Projet BDD – Playwright + Cucumber (TypeScript)

## Site choisi
- **Nike (France)** : https://www.nike.com/fr/

## Scénarios testés

### Scénario 1 — Recherche produit et ouverture de la fiche
- Accéder à la page d’accueil Nike
- Accepter la bannière cookies (si présente)
- Rechercher un produit (ex. "Vomero")
- Vérifier que des résultats s’affichent
- Ouvrir le premier résultat
- Vérifier que le **titre** et le **prix** du produit sont visibles

### Scénario 2 — Tentative de connexion avec identifiants invalides (échec attendu)
- Accéder à la page de connexion Nike
- Renseigner un e-mail invalide
- Cliquer sur **Continuer**
- Renseigner un mot de passe invalide
- Cliquer sur le bouton de connexion
- Vérifier qu’un **message d’erreur** apparaît (connexion refusée)

### Scénario 3 — Ajout au panier via recherche
- Accéder à la page d’accueil Nike
- Accepter la bannière cookies (si présente)
- Rechercher le mot-clé **"ballon"**
- Ouvrir le premier résultat
- Sélectionner une taille si nécessaire (selon l’article)
- Cliquer sur **Ajouter au panier**
- Ouvrir le panier et vérifier qu’au moins **un article** est présent

## Installation
Prérequis : **Node.js LTS** + npm

Vérifier l’installation :
```bash
node -v
npm -v

Installer les dépendances :
npm install

Installer les navigateurs Playwright:
npx playwright install


Installer les navigateurs Playwright :
npm run bdd

Lancer les scénarios Cucumber avec navigateur visible :
npm run bdd:headed
