# SEO Autonome - Crawler Service

Module d'acquisition de données basé sur **Playwright** pour extraire le contenu des pages web. Conçu pour être exécuté en tant que **Google Cloud Run Job**.

## Fonctionnalités

- Navigation Headless avec Playwright (rendu JS supporté).
- Algorithme de scoring de base (présence meta tags, H1, contenu).
- Sauvegarde du HTML brut dans **Google Cloud Storage**.
- Sauvegarde du rapport structuré dans **Firestore**.
- Métriques de performance de base.

## Pré-requis

- Node.js 18+
- Compte Google Cloud (pour Firestore/Storage en prod).
- Variable d'environnement (voir ci-dessous).

## Installation

```bash
cd backend/services/crawler
npm install
```

## Test Local (Simulation)

Pour tester le script sans déployer sur GCP, vous pouvez le lancer localement.
Assurez-vous d'avoir configuré vos identifiants Firebase/GCP (via `gcloud auth application-default login` ou en ignorant l'erreur d'upload GCS grâce au mode `local_test`).

```bash
# Définir les variables d'environnement requises
export SITE_ID="site_demo_01"
export TARGET_URL="https://example.com"
export NODE_ENV="local_test" # Désactive l'upload GCS si pas de credentials

# Lancer le crawler
npm start
```

## Déploiement sur Cloud Run Jobs

1. **Construire l'image Docker**
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/crawler-service
```

2. **Créer le Job Cloud Run**
```bash
gcloud run jobs create crawler-job \
  --image gcr.io/PROJECT_ID/crawler-service \
  --region europe-west1 \
  --set-env-vars BUCKET_NAME=seo-raw-data
```

3. **Exécuter le Job (avec override des variables)**
```bash
gcloud run jobs execute crawler-job \
  --update-env-vars SITE_ID=site_123,TARGET_URL=https://target.com
```
