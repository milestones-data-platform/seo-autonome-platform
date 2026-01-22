const admin = require('firebase-admin');
const { JobsClient } = require('@google-cloud/run').v2;

// Initialize Firebase
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// Initialize Cloud Run Jobs Client
const jobsClient = new JobsClient();

const PROJECT_ID = process.env.GCP_PROJECT_ID;
const REGION = process.env.GCP_REGION || 'europe-west1';
const JOB_NAME = 'crawler-job';

/**
 * Cloud Function triggered by Cloud Scheduler
 * Iterates over sites and triggers the Crawler Job for each
 */
exports.dispatchAudits = async (req, res) => {
  console.log('⏰ Dispatcher triggered');

  try {
    // 1. List active sites eligible for audit
    // In a real app, check 'settings.frequency' and 'lastCrawledAt'
    const snapshot = await db.collection('sites').get();

    if (snapshot.empty) {
      console.log('No sites found.');
      return res.status(200).send('No sites to audit');
    }

    const promises = [];

    // 2. Trigger Job for each site
    snapshot.forEach(doc => {
      const site = doc.data();
      const jobPath = `projects/${PROJECT_ID}/locations/${REGION}/jobs/${JOB_NAME}`;
      
      console.log(`🚀 Dispatching crawl for ${site.id} (${site.domainUrl})`);

      // Override env vars for this specific execution
      const executionRequest = {
        name: jobPath,
        overrides: {
          containerOverrides: [{
            env: [
              { name: 'SITE_ID', value: site.id },
              { name: 'TARGET_URL', value: site.domainUrl }
            ]
          }]
        }
      };

      promises.push(
        jobsClient.runJob(executionRequest)
          .then(() => console.log(`✅ Started job for ${site.id}`))
          .catch(err => console.error(`❌ Failed start for ${site.id}:`, err))
      );
    });

    await Promise.all(promises);

    res.status(200).send(`Dispatched ${promises.length} audits`);
  } catch (error) {
    console.error('❌ Dispatcher Error:', error);
    res.status(500).send(error.message);
  }
};
