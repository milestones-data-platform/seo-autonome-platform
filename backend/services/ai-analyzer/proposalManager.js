const admin = require('firebase-admin');

// Initialize if not already (should be handled in index.js)
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Saves generated proposals to Firestore
 * @param {string} siteId
 * @param {Array} proposals
 * @param {string} auditId
 * @returns {Promise<number>} Number of proposals saved
 */
async function saveProposals(siteId, proposals, auditId) {
  const batch = db.batch();
  const collectionRef = db.collection('sites').doc(siteId).collection('proposals');

  let count = 0;
  
  for (const proposal of proposals) {
    // Generate a unique ID for the proposal
    const docRef = collectionRef.doc(); // Auto-ID
    
    // Enrich proposal with metadata
    const enrichedProposal = {
      ...proposal,
      id: docRef.id,
      siteId: siteId,
      sourceAuditId: auditId,
      status: 'pending_validation',
      createdAt: admin.firestore.Timestamp.now(),
      agentInfo: {
        id: 'agent_gemini_v1',
        name: 'AI Strategist',
        model: process.env.VERTEX_AI_MODEL || 'gemini-1.5-pro'
      }
    };
    
    batch.set(docRef, enrichedProposal);
    count++;
  }

  await batch.commit();
  return count;
}

module.exports = { saveProposals };
