# language: fr
Fonctionnalité: Parcours Nike

Scénario: Rechercher un produit et ouvrir la fiche
  Etant donné je suis sur la page Nike
  Quand je recherche "Vomero"
  Alors je vois des résultats
  Quand j'ouvre le premier résultat
  Alors je vois le titre et le prix du produit

Scénario: Tentative de connexion avec un email invalide
  Etant donné je suis sur la page de connexion Nike
  Quand je renseigne l'email "fake.user.12345@example.com"
  Et je clique sur "Continuer"
  Alors je vois un message d'erreur de connexion


Scénario: Ajouter le premier "ballon" au panier et ouvrir le panier
  Etant donné je suis sur la page Nike
  Quand je recherche "ballon"
  Alors je vois des résultats
  Quand j'ouvre le premier résultat
  Et si une taille est demandée, je sélectionne la première disponible
  Et j'ajoute le produit au panier
  Et j'ouvre le panier
  Alors le panier doit contenir au moins 1 article




