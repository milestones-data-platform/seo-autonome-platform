const { VertexAI } = require('@google-cloud/vertexai');

// Initialize Vertex AI
// Note: Requires GOOGLE_APPLICATION_CREDENTIALS or Cloud Run metadata
const project = process.env.GCP_PROJECT_ID;
const location = process.env.VERTEX_AI_LOCATION || 'europe-west9'; // Paris
const modelId = process.env.VERTEX_AI_MODEL || 'gemini-1.5-pro-preview-0409'; // Or 'gemini-1.0-pro'

const vertexAI = new VertexAI({ project: project || 'demo-project', location });

// Type definitions for JSDoc
/**
 * @typedef {Object} PageAuditData
 * @property {string} targetUrl
 * @property {Object} extractedData
 * @property {string} extractedData.title
 * @property {string} extractedData.metaDesc
 * @property {string} extractedData.mainContent
 * @property {Object} extractedData.headings
 */

/**
 * @typedef {Object} SiteSettings
 * @property {string} toneOfVoice
 * @property {string} targetRegion
 */

/**
 * Analyzes page content using Gemini Pro and returns structured proposals
 * @param {PageAuditData} auditData
 * @param {SiteSettings} settings
 * @returns {Promise<Array<Object>>} Array of proposal objects
 */
async function analyzePage(auditData, settings) {
  console.log(`🧠 Starting AI Analysis for ${auditData.targetUrl}`);
  
  const generativeModel = vertexAI.preview.getGenerativeModel({
    model: modelId,
    generation_config: {
      max_output_tokens: 2048,
      temperature: 0.2, // Low temperature for consistent JSON
      top_p: 0.8,
      top_k: 40,
    },
  });

  // Construct the prompt
  const systemInstruction = `
    Tu es un expert SEO technique et sémantique de renom. Ton objectif est d'analyser le contenu d'une page web et de proposer des améliorations concrètes en JSON.
    Ton "Tone of Voice" doit être : ${settings.toneOfVoice || 'Professionnel et analytique'}.
    
    Règles strictes :
    1. Analyse les données fournies (Titre, Meta, Contenu, Hn).
    2. Identifie exactement 3 opportunités d'amélioration à fort impact.
    3. Les types d'améliorations possibles sont : 'semantic' (contenu/mots-clés), 'structure' (Hn), 'technical' (meta tags).
    4. Réponds UNIQUEMENT avec un tableau JSON valide. Pas de markdown, pas de texte avant/après.
    
    Format JSON attendu pour chaque item :
    {
      "changeType": "semantic" | "structure" | "technical",
      "targetPath": "${new URL(auditData.targetUrl).pathname}",
      "aiConfidence": 90, 
      "aiReasoning": "Explication courte de pourquoi c'est nécessaire.",
      "expectedImpact": "Impact estimé (ex: +CTR).",
      "contentDiff": {
        "field": "meta_title" | "h1" | "content_section",
        "original": "Valeur actuelle",
        "proposed": "Valeur optimisée proposée"
      }
    }
  `;

  const userContent = `
    Voici les données de la page à analyser :
    URL: ${auditData.targetUrl}
    Titre actuel: "${auditData.extractedData.title}"
    Description actuelle: "${auditData.extractedData.metaDesc}"
    Structure Hn: ${JSON.stringify(auditData.extractedData.headings)}
    
    Début du contenu principal (5000 chars) :
    ${auditData.extractedData.mainContent?.substring(0, 5000)}
  `;

  try {
    const request = {
      contents: [{ role: 'user', parts: [{ text: userContent }] }],
      systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
    };

    console.log('🤖 Sending request to Gemini...');
    const result = await generativeModel.generateContent(request);
    const response = await result.response;
    const text = response.candidates[0].content.parts[0].text;

    // Clean markdown code blocks if present (common with LLMs)
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    console.log('📦 Raw AI Response length:', jsonString.length);
    
    // Parse JSON
    const proposals = JSON.parse(jsonString);
    
    if (!Array.isArray(proposals)) {
      throw new Error('AI response is not an array');
    }

    return proposals;

  } catch (error) {
    console.error('❌ AI Analysis Error:', error);
    // Return empty array or throw depending on retry strategy
    throw error;
  }
}

module.exports = { analyzePage };
