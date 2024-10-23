# SmartWallet

SmartWallet est une application web de gestion financière personnelle développée avec Next.js. Elle permet aux utilisateurs de suivre leurs dépenses, gérer leurs budgets et visualiser leurs transactions de manière intuitive.

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

## Structure du projet

Le projet suit la structure standard d'une application Next.js, avec quelques dossiers spécifiques :

- `/src/app` : Pages et routes de l'application
- `/src/components` : Composants React réutilisables
- `/src/lib` : Utilitaires et fonctions helpers
- `/prisma` : Schéma et migrations de la base de données
