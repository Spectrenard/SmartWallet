# SmartWallet

L’objectif de SmartWallet est de simplifier la gestion des finances personnelles. Cette application permet aux utilisateurs de garder une trace de leurs revenus et dépenses, de fixer des budgets et de suivre leur situation financière en temps réel à travers une interface conviviale. L'idée est d'aider à mieux comprendre et contrôler où va l'argent, pour optimiser les habitudes financières.



## Fonctionnalités principales

- Tableau de bord avec aperçu des finances
- Gestion des transactions (ajout, modification, suppression)
- Configuration et suivi des budgets par catégorie
- Visualisation des dépenses avec des graphiques interactifs
- Système d'authentification sécurisé

![Capture d’écran 2024-10-23 à 23 07 22](https://github.com/user-attachments/assets/3e960c87-0b26-4150-a057-d6a6fe06e019)


## Technologies utilisées

- Next.js
- React
- TypeScript
- Prisma (ORM)
- Tailwind CSS
- Recharts (pour les graphiques)

## Installation

1. Clonez le dépôt
2. Installez les dépendances : `npm install`
3. Configurez votre base de données dans le fichier `.env`
4. Lancez les migrations Prisma : `npx prisma migrate dev`
5. Démarrez le serveur de développement : `npm run dev`
