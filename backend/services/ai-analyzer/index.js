const express = require('express');
const admin = require('firebase-admin');
const { analyzePage } = require('./analyzer');
const { saveProposals } = require('./proposalManager');

// Initialize Firebase
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

/**
 * Endpoint triggered by Cloud Pub/Sub (Push Subscription)
 * Format expected:
 * {
 *   "message": {
 *     "data": "eyJzaXRlSWQiOiIuLi4iLCJhdWRpdElkIjoiLi4uIn0=" (Base64 encoded JSON)
 *   }
 * }
 */
app.post('/', async (req, res) => {
  try {
    let siteId, auditId;

    // Check if this is a direct call or Pub/Sub Push
    if (req.body.message && req.body.message.data) {
      // Decode Pub/Sub message
      const buffer = Buffer.from(req.body.message.data, 'base64');
      const payload = JSON.parse(buffer.toString());
      siteId = payload.siteId;
      auditId = payload.auditId;
      console.log(`📩 Received Pub/Sub message for Site: ${siteId}, Audit: ${auditId}`);
    } else {
      // Direct HTTP call
      siteId = req.body.siteId;
      auditId = req.body.auditId;
    }

    if (!siteId || !auditId) {
      return res.status(400).send('Missing siteId or auditId');
    }

    // 1. Fetch Audit Data & Site Settings
    const siteDoc = await db.collection('sites').doc(siteId).get();
    if (!siteDoc.exists) {
      console.warn(`Site ${siteId} not found`);
      return res.status(404).send('Site not found');
    }
    const siteSettings = siteDoc.data().settings || {};

    const auditDoc = await db.collection('sites').doc(siteId).collection('audits').doc(auditId).get();
    if (!auditDoc.exists) {
      console.warn(`Audit ${auditId} not found`);
      return res.status(404).send('Audit not found');
    }
    const auditData = auditDoc.data();

    // Check if analysis is actually needed/possible
    if (!auditData.extractedData || !auditData.extractedData.mainContent) {
      return res.status(200).send('Skipping analysis: No content in audit');
    }

    // 2. Run AI Analysis
    const proposals = await analyzePage(auditData, siteSettings);
    console.log(`💡 Generated ${proposals.length} proposals`);

    // 3. Save Proposals
    const savedCount = await saveProposals(siteId, proposals, auditId);
    
    console.log(`✅ Saved ${savedCount} proposals to Firestore`);

    res.status(200).json({ success: true, proposalsCount: savedCount });

  } catch (error) {
    console.error('❌ Error processing analysis:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

app.listen(PORT, () => {
  console.log(`AI Analyzer Service listening on port ${PORT}`);
});
