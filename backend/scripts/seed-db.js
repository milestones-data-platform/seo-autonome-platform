/**
 * Database Seed Script
 * Populates Firestore with demo data matching the frontend mocks.
 * Usage: node backend/scripts/seed-db.js
 * 
 * Pre-requisites:
 * 1. GOOGLE_APPLICATION_CREDENTIALS set or firebase login
 * 2. Service Account key available if running locally without auth
 */

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
// Note: In a real scenario, you'd provide the service account key path or rely on ADC
// For this script template, we assume ADC (Application Default Credentials) or emulator
if (process.env.FIREBASE_EMULATOR_HOST) {
  admin.initializeApp({
    projectId: 'demo-seo-autonome'
  });
  console.log('Connected to Firebase Emulator');
} else {
  // Try standard initialization
  try {
    admin.initializeApp();
    console.log('Connected to Firebase Project');
  } catch (e) {
    console.error('Failed to initialize Firebase Admin. Make sure GOOGLE_APPLICATION_CREDENTIALS is set.');
    // Fallback for demo purposes if user hasn't set up GCP yet, just to show code structure
    console.log('Continuing in "Dry Run" mode for code demonstration...');
  }
}

const db = admin.firestore();

async function seedDatabase() {
  console.log('🌱 Starting database seed...');

  try {
    // 1. Create User
    const userId = 'dev_user_001';
    const userRef = db.collection('users').doc(userId);
    
    await userRef.set({
      uid: userId,
      email: 'admin@seo-autonome.com',
      displayName: 'Admin Dev',
      plan: 'pro',
      roles: ['admin'],
      createdAt: admin.firestore.Timestamp.now()
    });
    console.log(`✅ User created: ${userId}`);

    // 2. Create Site
    const siteId = 'site_demo_01';
    const siteRef = db.collection('sites').doc(siteId);
    
    await siteRef.set({
      id: siteId,
      ownerId: userId,
      domainUrl: 'https://example.com',
      name: 'Demo E-commerce',
      settings: {
        frequency: 'daily',
        toneOfVoice: 'professional',
        targetRegion: 'fr-FR'
      },
      currentSeoScore: 94,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now()
    });
    console.log(`✅ Site created: ${siteId}`);

    // 3. Create Recent Audit
    const auditId = 'audit_recent_01';
    await siteRef.collection('audits').doc(auditId).set({
      id: auditId,
      date: admin.firestore.Timestamp.now(),
      status: 'completed',
      metrics: {
        seoScore: 94,
        performance: 89,
        accessibility: 96,
        bestPractices: 92,
        seo: 98
      },
      coreWebVitals: {
        lcp: 2.1,
        cls: 0.08,
        fid: 45
      },
      keywordPositions: [
        { keyword: 'seo automation tools', position: 3, volume: 12400 },
        { keyword: 'ai seo platform', position: 5, volume: 8900 }
      ],
      pagesScanned: 1247
    });
    console.log(`✅ Audit created: ${auditId}`);

    // 4. Create Proposals (from frontend mock data)
    const proposals = [
      {
        id: 'proposal_001',
        targetUrl: 'https://example.com/blog/seo-tips-2024',
        targetPath: '/blog/seo-tips-2024',
        changeType: 'semantic',
        agentInfo: {
          id: 'agent_semantic_v1',
          name: 'Agent Sémantique',
          model: 'gemini-1.5-pro'
        },
        aiConfidence: 92,
        status: 'pending_validation',
        contentDiff: {
          field: 'meta_title',
          original: 'SEO Tips for Beginners',
          proposed: 'SEO Tips 2024: 15 Techniques Essentielles pour Débutants | Guide Complet'
        },
        aiReasoning: 'L\'analyse de l\'intention de recherche montre que les utilisateurs cherchent des conseils actualisés (2024)...',
        expectedImpact: '+15-25% CTR estimé',
        createdAt: admin.firestore.Timestamp.now()
      },
      {
        id: 'proposal_002',
        targetUrl: 'https://example.com/products/seo-tool',
        targetPath: '/products/seo-tool',
        changeType: 'technical',
        agentInfo: {
          id: 'agent_technical_v1',
          name: 'Agent Technique',
          model: 'gemini-1.5-pro'
        },
        aiConfidence: 95,
        status: 'pending_validation',
        contentDiff: {
          field: 'structured_data',
          original: '<!-- No Product schema -->',
          proposed: '{"@context": "https://schema.org", "@type": "Product", ...}'
        },
        aiReasoning: 'La page produit n\'a aucune donnée structurée Product.',
        expectedImpact: 'Rich snippets dans les SERP',
        createdAt: admin.firestore.Timestamp.now()
      },
      {
        id: 'proposal_003',
        targetUrl: 'https://example.com/',
        targetPath: '/',
        changeType: 'performance',
        agentInfo: {
          id: 'agent_performance_v1',
          name: 'Agent Performance',
          model: 'gemini-1.5-flash'
        },
        aiConfidence: 97,
        status: 'approved',
        contentDiff: {
          field: 'image_optimization',
          original: 'hero-image.png (2.4MB)',
          proposed: 'hero-image.webp (145KB)'
        },
        aiReasoning: 'L\'image hero est trop lourde.',
        expectedImpact: 'LCP -1.2s',
        deploymentInfo: {
          approvedBy: userId,
          approvedAt: admin.firestore.Timestamp.now(),
          buildId: 'build_demo_123'
        },
        createdAt: admin.firestore.Timestamp.now()
      }
    ];

    const batch = db.batch();
    proposals.forEach(prop => {
      const docRef = siteRef.collection('proposals').doc(prop.id);
      batch.set(docRef, prop);
    });

    await batch.commit();
    console.log(`✅ ${proposals.length} Proposals created`);

    console.log('🎉 Database seed completed successfully!');

  } catch (error) {
    console.error('❌ Error during seed:', error);
    process.exit(1);
  }
}

seedDatabase();
