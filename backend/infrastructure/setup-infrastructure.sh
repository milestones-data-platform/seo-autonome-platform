#!/bin/bash
# Infrastructure Setup Script for SEO Autonome
# Usage: ./setup-infrastructure.sh [PROJECT_ID] [REGION]

PROJECT_ID=$1
REGION=${2:-europe-west1}

if [ -z "$PROJECT_ID" ]; then
  echo "Usage: ./setup-infrastructure.sh [PROJECT_ID] [REGION]"
  exit 1
fi

echo "🚀 Setting up Infrastructure for Project: $PROJECT_ID in $REGION"

# Enable Services
gcloud services enable \
  run.googleapis.com \
  cloudfunctions.googleapis.com \
  firestore.googleapis.com \
  pubsub.googleapis.com \
  cloudscheduler.googleapis.com \
  aiplatform.googleapis.com \
  --project $PROJECT_ID

# 1. Create Pub/Sub Topics
echo "Creating Pub/Sub topics..."
gcloud pubsub topics create trigger-audit --project $PROJECT_ID || echo "Topic trigger-audit exists"
gcloud pubsub topics create audit-completed --project $PROJECT_ID || echo "Topic audit-completed exists"

# 2. Deploy Services (Placeholder commands - need actual image build first)
# Note: This script assumes images are built. In a CI/CD, this comes after build.

# --- Crawler Job ---
# gcloud run jobs create crawler-job ...

# --- AI Analyzer Service ---
# gcloud run deploy ai-analyzer ...

# 3. Create Subscription for AI Analyzer
# Links 'audit-completed' topic to the AI Analyzer Cloud Run Service
echo "Creating Subscription..."
SERVICE_URL=$(gcloud run services describe ai-analyzer --region $REGION --format='value(status.url)' --project $PROJECT_ID)

if [ -n "$SERVICE_URL" ]; then
  gcloud pubsub subscriptions create ai-analyzer-sub \
    --topic audit-completed \
    --push-endpoint=$SERVICE_URL \
    --push-auth-service-account=ai-analyzer-invoker@$PROJECT_ID.iam.gserviceaccount.com \
    --project $PROJECT_ID
else
  echo "⚠️ AI Analyzer service not found. deploy it first to set up subscription."
fi

# 4. Create Scheduler
# Triggers the Dispatcher Cloud Function every hour
echo "Creating Scheduler..."
# In this architecture, we use a Cloud Function 'dispatcher' triggered by http or pubsub
# If dispatcher is http triggered:
DISPATCHER_URL="https://$REGION-$PROJECT_ID.cloudfunctions.net/dispatcher"

gcloud scheduler jobs create http hourly-audit-dispatch \
  --schedule="0 * * * *" \
  --uri=$DISPATCHER_URL \
  --http-method=GET \
  --location=$REGION \
  --project $PROJECT_ID \
  || echo "Scheduler job exists"

echo "✅ Infrastructure Setup Complete (review warnings above)"
