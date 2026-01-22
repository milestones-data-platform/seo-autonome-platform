const admin = require('firebase-admin');
const { addDocument } = require('../services/knowledge-base/knowledgeManager');

// Initialize Firebase
if (process.env.FIREBASE_EMULATOR_HOST) {
    admin.initializeApp({ projectId: 'demo-seo-autonome' });
} else {
    // If running standalone, might need initialization logic from seed-db.js
    // Assuming this script is run where admin is already config'd or via CLI wrapper
    if (!admin.apps.length) admin.initializeApp();
}

async function seedKnowledge() {
    console.log('🌱 Seeding Knowledge Base with Brand & SEO Rules...');

    const rules = [
        {
            category: 'brand_voice',
            content: "Le ton de la marque doit toujours être professionnel mais empathique. Utilisez le vouvoiement. Évitez l'humour trop familier."
        },
        {
            category: 'technical_seo',
            content: "Les titres H1 doivent absolument contenir le mot-clé principal de la page et ne pas dépasser 60 caractères pour éviter la troncation dans les SERP."
        },
        {
            category: 'technical_seo',
            content: "Chaque image doit avoir un attribut 'alt' descriptif contenant si possible un mot-clé secondaire, mais sans bourrage (keyword stuffing)."
        },
        {
            category: 'content_quality',
            content: "Les paragraphes ne doivent pas dépasser 5 lignes pour faciliter la lecture sur mobile. Utilisez des listes à puces pour énumérer des éléments."
        },
        {
            category: 'strategy',
            content: "Pour les pages produits, mettez en avant les bénéfices utilisateur (avantages) avant les caractéristiques techniques."
        }
    ];

    try {
        for (const rule of rules) {
            await addDocument(rule.content, rule.category);
        }
        console.log('🎉 Knowledge Base seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding knowledge:', error);
    }
}

// Check if running directly
if (require.main === module) {
    seedKnowledge();
}

module.exports = { seedKnowledge };
