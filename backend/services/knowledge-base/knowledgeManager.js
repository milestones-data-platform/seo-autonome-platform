const admin = require('firebase-admin');
const similarity = require('compute-cosine-similarity');
const { generateEmbedding } = require('./embeddings');

// Initialize Firebase if needed
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const COLLECTION_NAME = 'knowledge_base';

/**
 * Adds a document to the knowledge base with its embedding
 * @param {string} content - The knowledge text (rule, guideline)
 * @param {string} category - Category (e.g., 'brand_voice', 'technical_seo')
 */
async function addDocument(content, category) {
  const embedding = await generateEmbedding(content);
  
  await db.collection(COLLECTION_NAME).add({
    content,
    category,
    embedding, // Store the vector directly
    createdAt: admin.firestore.Timestamp.now()
  });
  
  console.log(`✅ Knowledge added: "${content.substring(0, 30)}..."`);
}

/**
 * Finds the most relevant documents for a given query using Cosine Similarity
 * @param {string} queryText - The search query (e.g., page content snippet or keywords)
 * @param {number} limit - Number of results to return
 * @returns {Promise<Array<{content: string, score: number}>>}
 */
async function findSimilarDocuments(queryText, limit = 3) {
  try {
    console.log(`🔍 Searching knowledge for: "${queryText.substring(0, 50)}..."`);
    
    // 1. Generate embedding for query
    // Note: For query, taskType usually 'RETRIEVAL_QUERY' in Vertex AI, but we simplify here
    const queryVector = await generateEmbedding(queryText);

    // 2. Fetch all knowledge documents
    // Production Note: For >1000 docs, use a Vector Database or Firestore Vector Search (preview)
    // For this MVP, we fetch all and compute in memory (perfectly fine for dozens of rules)
    const snapshot = await db.collection(COLLECTION_NAME).get();
    
    if (snapshot.empty) {
      return [];
    }

    const documents = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.embedding && Array.isArray(data.embedding)) {
        documents.push({
          content: data.content,
          embedding: data.embedding
        });
      }
    });

    // 3. Compute Similarities
    const scoredDocs = documents.map(doc => ({
      content: doc.content,
      score: similarity(queryVector, doc.embedding) || 0
    }));

    // 4. Sort and Slice
    scoredDocs.sort((a, b) => b.score - a.score);
    
    const results = scoredDocs.slice(0, limit);
    
    console.log(`✅ Found ${results.length} relevant rules (Top score: ${results[0]?.score.toFixed(4)})`);
    return results;

  } catch (error) {
    console.error('❌ Knowledge Search Error:', error);
    return []; // Fail gracefully (return empty context)
  }
}

module.exports = { addDocument, findSimilarDocuments };
