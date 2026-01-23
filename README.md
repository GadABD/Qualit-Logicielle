# Projet E2E – Playwright + POM + Gherkin (Cucumber)

## Site choisi
- **TodoMVC (Playwright demo)** : https://demo.playwright.dev/todomvc/#/
- Application publique, simple, avec interactions (ajout/complétion/édition/suppression/filtrage) et plusieurs parcours.

## Scénarios testés (BDD)
Fichier : `tests/features/gestion-taches.feature`
1. Ajouter des tâches et vérifier le compteur
2. Compléter une tâche puis supprimer les tâches complétées
3. Filtrer les tâches **Active** / **Completed**
4. Modifier (éditer) une tâche
5. Supprimer une tâche

## Structure
- `tests/features/` : scénarios Gherkin
- `tests/steps/` : steps Cucumber
- `tests/pages/` : Page Objects (POM)
- `tests/support/` : World + Hooks (setup/teardown Playwright)

## Installation
```bash
npm install
npx playwright install
```

## Exécution
### Scénarios BDD (Cucumber)
```bash
npm run bdd
```

### Mode visible (headed)
Sur macOS/Linux :
```bash
npm run bdd:headed
```
Sur Windows (PowerShell) :
```powershell
$env:HEADLESS="0"; npm run bdd
```

## Notes / difficultés
- TodoMVC persiste les tâches via **localStorage** : on le vide automatiquement au début de chaque scénario (voir `TodoPage.open()`) pour garantir l'indépendance des tests.
- Le dépôt doit rester propre : `node_modules/` et les rapports Playwright sont ignorés via `.gitignore`.
