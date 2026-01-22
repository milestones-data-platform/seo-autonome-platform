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
 * Endpoint triggered by Cloud Pub/Sub or Http call after Audit
 * body: { siteId: string, auditId: string }
 */
app.post('/', async (req, res) => {
  try {
    const { siteId, auditId } = req.body;

    if (!siteId || !auditId) {
      return res.status(400).send('Missing siteId or auditId');
    }

    console.log(`🚀 Received analysis request for Site: ${siteId}, Audit: ${auditId}`);

    // 1. Fetch Audit Data & Site Settings
    const siteDoc = await db.collection('sites').doc(siteId).get();
    if (!siteDoc.exists) {
      return res.status(404).send('Site found');
    }
    const siteSettings = siteDoc.data().settings || {};

    const auditDoc = await db.collection('sites').doc(siteId).collection('audits').doc(auditId).get();
    if (!auditDoc.exists) {
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
