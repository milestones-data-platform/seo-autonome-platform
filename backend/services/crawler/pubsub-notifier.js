const { PubSub } = require('@google-cloud/pubsub');

// Initialize PubSub
// Uses ADC (Application Default Credentials)
const pubSubClient = new PubSub();
const TOPIC_NAME = process.env.COMPLETION_TOPIC || 'audit-completed';

/**
 * Notifies the orchestration system that an audit has completed
 * @param {string} siteId
 * @param {string} auditId
 * @param {string} status 'success' | 'failed'
 * @param {Object} metrics Optional metrics to include
 */
async function notifyAuditCompletion(siteId, auditId, status, metrics = {}) {
  // If we are in local test mode, skip Pub/Sub
  if (process.env.NODE_ENV === 'local_test') {
    console.log('📝 Local Test: Skipping Pub/Sub notification');
    return;
  }

  const dataBuffer = Buffer.from(JSON.stringify({
    siteId,
    auditId,
    status,
    metrics,
    timestamp: new Date().toISOString()
  }));

  try {
    const messageId = await pubSubClient.topic(TOPIC_NAME).publishMessage({ data: dataBuffer });
    console.log(`📡 Notification sent to topic ${TOPIC_NAME}, Message ID: ${messageId}`);
  } catch (error) {
    console.error(`❌ Failed to send Pub/Sub notification: ${error.message}`);
    // Don't throw - we don't want to fail the job just because notification failed
  }
}

module.exports = { notifyAuditCompletion };
