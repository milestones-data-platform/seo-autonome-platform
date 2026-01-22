# 🧪 Guide de Test Local

Ce guide explique comment tester chaque micro-service de la plateforme sur votre machine locale, sans déploiement complet sur Cloud Run.

## 1. Prérequis

*   **Clé de Service Account GCP** : Vous devez avoir un fichier JSON de clé avec les droits nécessaires (Firestore Admin, Vertex AI User, Storage Admin).
*   **Variables d'environnement** : Configurez votre terminal.

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/chemin/vers/votre-cle-service-account.json"
export GCP_PROJECT_ID="votre-projet-id"
```

## 2. Tester le Frontend
Le frontend est une application Next.js standard.

```bash
npm run dev
# Accessible sur http://localhost:3000
```
*Note : Les appels API `/api/sites` nécessitent que vous soyez authentifié via Firebase sur le frontend avec un utilisateur dont l'UID correspond au `ownerId` des données.*

## 3. Tester le Crawler (Acquisition)

Le crawler est conçu pour être un Job unique. En local, nous utilisons le mode `local_test` pour éviter d'envoyer des messages Pub/Sub ou d'écrire sur Cloud Storage si non configuré.

**Commande :**
```bash
# Dans le dossier racine du projet
export SITE_ID="test_site_local"
export TARGET_URL="https://example.com"
export NODE_ENV="local_test" # Ignore Pub/Sub et GCS

node backend/services/crawler/crawler.js
```
**Résultat attendu :**
*   Le navigateur s'ouvre (si non-headless) ou loggue les étapes.
*   Un document Audit est créé dans Firestore sous `sites/test_site_local/audits/`.
*   Le HTML n'est PAS uploadé sur GCS (sauf si vous retirez `local_test` et avez les droits).

## 4. Tester l'IA Analyzer (Cerveau)

Ce service est un serveur HTTP qui attend un trigger (normalement Pub/Sub). En local, on le lance et on le "ping" manuellement.

**Terminal 1 (Lancer le serveur) :**
```bash
cd backend/services/ai-analyzer
npm install
export PORT=8080
export NODE_ENV="local_test"

node index.js
```

**Terminal 2 (Déclencher l'analyse) :**
Il faut utiliser un `siteId` et `auditId` qui existent réellement dans votre Firestore (ceux générés par l'étape 3 par exemple).

```bash
curl -X POST http://localhost:8080 \
  -H "Content-Type: application/json" \
  -d '{
    "siteId": "test_site_local", 
    "auditId": "audit_1700000000000" 
  }'
```
*(Remplacez `audit_...` par l'ID réel affiché dans les logs du Crawler)*

**Résultat attendu :**
*   Le serveur reçoit la requête.
*   Il lit l'audit dans Firestore.
*   Il interroge Gemini (Vertex AI).
*   Il sauvegarde les propositions dans `sites/test_site_local/proposals/`.

## 5. Tester le RAG (Base de Connaissance)
Assurez-vous d'avoir peuplé la base :
```bash
node backend/scripts/seed-knowledge.js
```
L'analyseur IA utilisera automatiquement ces règles lors de l'étape 4.
