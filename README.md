# SEO Autonome Platform 🚀

Plateforme d'automatisation SEO "Zero-Touch" alimentée par l'Intelligence Artificielle (Vertex AI Gemini) et Google Cloud Platform.
Cette application permet d'auditer, d'analyser et de proposer des optimisations SEO (Sémantique, Technique, Performance) de manière autonome.

## 🏗 Architecture

Le système repose sur une architecture **Event-Driven** (GCP Pub/Sub) avec une séparation claire entre le Frontend Client et les Services Backend Scalables.

```mermaid
graph TD
    Client[Frontend Next.js] -->|API Routes| API[Next.js API Gateway]
    API -->|Read/Write| DB[(Firestore)]
    API -->|Trigger Audit| PubSub[Pub/Sub: trigger-audit]
    
    PubSub -->|Push| Crawler[Service Crawler (Cloud Run/Job)]
    Crawler -->|Save HTML| GCS[Cloud Storage]
    Crawler -->|Save Metrics| DB
    Crawler -->|Notify| PubSub2[Pub/Sub: audit-completed]
    
    PubSub2 -->|Trigger| AI[Service AI Analyzer (Cloud Function)]
    AI -->|Retrieve Context| RAG[(Knowledge Base)]
    AI -->|Generate Proposals| Gemini[Vertex AI Gemini 1.5]
    AI -->|Save Proposals| DB
```

## ✨ Fonctionnalités Clés

### 1. Frontend (Next.js 14 App Router)
- **Dashboard Unifié** : Visualisation du Score SEO, Trafic, et Activité des Agents.
- **Multi-Agents UI** : Interface dédiée pour les agents Sémantique, Technique et Performance.
- **Authentification** : Gestion utilisateurs via Firebase Auth.
- **API Integration** : Routes API sécurisées (`/api/sites`, `/api/proposals`).

### 2. Backend Services (Node.js)
- **Crawler (Playwright)** : Navigation headless, extraction de contenu, calcul de performance (LCP/CLS), screenshots.
- **AI Analyzer (Gemini 1.5 Pro)** : Analyse cognitive du contenu par rapport aux best practices.
- **Knowledge Base (RAG)** : Système de mémoire contextuelle utilisant Vertex AI Embeddings pour stocker et rappeler les règles spécifiques de la marque (Tone of Voice, règles H1, etc.).

### 3. Orchestration & Data
- **Firestore** : NoSQL Database structurée (`sites` -> `audits` -> `proposals`).
- **Pub/Sub** : Bus de messages pour découpler les services.
- **Cloud Storage** : Stockage du HTML brut et des assets.

## 🚀 Installation Locale

### Prérequis
- Node.js 18+
- Google Cloud CLI (`gcloud`) authentifié.
- Projet Firebase créé.

### 1. Clone & Install
```bash
git clone https://github.com/milestones-data-platform/seo-autonome-platform.git
cd seo-autonome-platform
npm install
```

### 2. Configuration Environnement
Créez un fichier `.env.local` à la racine :
```env
NEXT_PUBLIC_FIREBASE_API_KEY=votre_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre_app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre_project_id
# ... autres variables Firebase
GCP_PROJECT_ID=votre_gcp_project_id
VERTEX_AI_LOCATION=europe-west1
```

### 3. Initialisation Base de Connaissances (RAG)
Pour peupler la mémoire de l'IA avec les règles initiales :
```bash
node backend/scripts/seed-knowledge.js
```

### 4. Lancement
```bash
npm run dev
```
Rendez-vous sur [http://localhost:3000](http://localhost:3000).

## ☁️ Déploiement GCP

Un script d'infrastructure est fourni pour provisionner les ressources nécessaires (Pub/Sub, Cloud Run, Scheduler).

```bash
cd backend/infrastructure
chmod +x setup-infrastructure.sh
./setup-infrastructure.sh
```

## 🛠 Services Backend

### Crawler Service (`backend/services/crawler`)
- Dockerisé avec Playwright.
- Peut tourner en local ou sur Cloud Run Jobs.

### AI Analyzer (`backend/services/ai-analyzer`)
- Service léger Express.js conçu pour Cloud Run / Cloud Functions.
- Utilise `@google-cloud/vertexai`.

---
**Status**: 🟢 Production Ready (MVP)
**Stack**: Next.js, Firebase, GCP, Vertex AI.
