/**
 * Mock Firestore Database
 * Simulates the structure of a Firestore NoSQL database
 * Collections: pageAudits, agentProposals, crawlSessions, systemConfig
 */

// ============================================================================
// TYPE DEFINITIONS (JSDoc)
// ============================================================================

/**
 * @typedef {Object} PageAudit
 * @property {string} id - Document ID (auto-generated)
 * @property {string} url - Full URL of the page
 * @property {string} path - Path portion of URL
 * @property {number} seoScore - Overall SEO score (0-100)
 * @property {number} performanceScore - Core Web Vitals score
 * @property {number} accessibilityScore - Accessibility score
 * @property {string} contentHash - SHA256 hash of page content
 * @property {Date} lastCrawledAt - Timestamp of last crawl
 * @property {Date} createdAt - Document creation timestamp
 * @property {Object} coreWebVitals - LCP, FID, CLS metrics
 * @property {string[]} issues - List of detected issues
 * @property {string} status - 'healthy' | 'warning' | 'critical'
 */

/**
 * @typedef {'semantic' | 'technical' | 'structure' | 'performance'} ChangeType
 */

/**
 * @typedef {'pending_validation' | 'approved' | 'rejected' | 'deployed' | 'rolled_back'} ProposalStatus
 */

/**
 * @typedef {Object} AgentProposal
 * @property {string} id - Document ID
 * @property {string} targetUrl - URL of the page to modify
 * @property {string} targetPath - Path of the page
 * @property {ChangeType} changeType - Type of modification
 * @property {string} agentId - ID of the agent that created this proposal
 * @property {string} agentName - Human-readable agent name
 * @property {number} aiConfidence - Confidence score from Vertex AI (0-100)
 * @property {ProposalStatus} status - Current status in the workflow
 * @property {Object} diff - Original and proposed content
 * @property {string} diff.original - Original content
 * @property {string} diff.proposed - AI-proposed content
 * @property {string} diff.field - Field being modified (title, description, h1, etc.)
 * @property {string} reasoning - AI explanation for the change
 * @property {string} expectedImpact - Predicted SEO impact
 * @property {Date} createdAt - Proposal creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 * @property {string|null} reviewedBy - User who reviewed (null if pending)
 * @property {string|null} reviewNote - Optional note from reviewer
 */

/**
 * @typedef {Object} CrawlSession
 * @property {string} id - Session ID
 * @property {Date} startedAt - Crawl start time
 * @property {Date} completedAt - Crawl end time (null if running)
 * @property {number} pagesScanned - Number of pages scanned
 * @property {number} totalPages - Total pages to scan
 * @property {string} status - 'running' | 'completed' | 'failed'
 * @property {Object} summary - Aggregated metrics
 */

// ============================================================================
// MOCK DATA COLLECTIONS
// ============================================================================

/**
 * Collection: pageAudits
 * Represents audited pages from the crawler
 */
export const pageAudits = [
  {
    id: 'audit_001',
    url: 'https://example.com/',
    path: '/',
    seoScore: 94,
    performanceScore: 89,
    accessibilityScore: 96,
    contentHash: 'sha256_a1b2c3d4e5f6789...',
    lastCrawledAt: new Date('2024-01-22T14:30:00Z'),
    createdAt: new Date('2024-01-15T10:00:00Z'),
    coreWebVitals: {
      lcp: { value: 2.1, rating: 'good' },
      fid: { value: 45, rating: 'good' },
      cls: { value: 0.08, rating: 'needs-improvement' }
    },
    issues: ['CLS slightly above threshold'],
    status: 'healthy'
  },
  {
    id: 'audit_002',
    url: 'https://example.com/blog/seo-tips-2024',
    path: '/blog/seo-tips-2024',
    seoScore: 78,
    performanceScore: 82,
    accessibilityScore: 91,
    contentHash: 'sha256_f1e2d3c4b5a6...',
    lastCrawledAt: new Date('2024-01-22T14:32:00Z'),
    createdAt: new Date('2024-01-10T08:00:00Z'),
    coreWebVitals: {
      lcp: { value: 2.8, rating: 'needs-improvement' },
      fid: { value: 38, rating: 'good' },
      cls: { value: 0.05, rating: 'good' }
    },
    issues: ['Meta description too short', 'Missing FAQ schema', 'LCP above threshold'],
    status: 'warning'
  },
  {
    id: 'audit_003',
    url: 'https://example.com/products/seo-tool',
    path: '/products/seo-tool',
    seoScore: 85,
    performanceScore: 91,
    accessibilityScore: 88,
    contentHash: 'sha256_1a2b3c4d5e...',
    lastCrawledAt: new Date('2024-01-22T14:35:00Z'),
    createdAt: new Date('2024-01-05T15:00:00Z'),
    coreWebVitals: {
      lcp: { value: 1.9, rating: 'good' },
      fid: { value: 52, rating: 'good' },
      cls: { value: 0.03, rating: 'good' }
    },
    issues: ['Missing Product schema'],
    status: 'healthy'
  },
  {
    id: 'audit_004',
    url: 'https://example.com/about',
    path: '/about',
    seoScore: 92,
    performanceScore: 95,
    accessibilityScore: 98,
    contentHash: 'sha256_9z8y7x6w5v...',
    lastCrawledAt: new Date('2024-01-22T14:28:00Z'),
    createdAt: new Date('2024-01-01T12:00:00Z'),
    coreWebVitals: {
      lcp: { value: 1.5, rating: 'good' },
      fid: { value: 25, rating: 'good' },
      cls: { value: 0.02, rating: 'good' }
    },
    issues: [],
    status: 'healthy'
  }
];

/**
 * Collection: agentProposals
 * Represents AI-generated modification proposals awaiting human validation
 */
export const agentProposals = [
  {
    id: 'proposal_001',
    targetUrl: 'https://example.com/blog/seo-tips-2024',
    targetPath: '/blog/seo-tips-2024',
    changeType: 'semantic',
    agentId: 'agent_semantic_v1',
    agentName: 'Agent Sémantique',
    aiConfidence: 92,
    status: 'pending_validation',
    diff: {
      field: 'meta_title',
      original: 'SEO Tips for Beginners',
      proposed: 'SEO Tips 2024: 15 Techniques Essentielles pour Débutants | Guide Complet'
    },
    reasoning: `L'analyse de l'intention de recherche montre que les utilisateurs cherchent des conseils actualisés (2024) et des guides complets. Le title actuel est trop générique et ne contient pas l'année, ce qui réduit le CTR. Le nouveau title inclut:
- L'année pour la fraîcheur
- Un nombre précis (15) pour l'attractivité
- Le mot "Guide Complet" pour l'authority`,
    expectedImpact: '+15-25% CTR estimé, amélioration position de 2-3 places',
    createdAt: new Date('2024-01-22T10:15:00Z'),
    updatedAt: new Date('2024-01-22T10:15:00Z'),
    reviewedBy: null,
    reviewNote: null
  },
  {
    id: 'proposal_002',
    targetUrl: 'https://example.com/blog/seo-tips-2024',
    targetPath: '/blog/seo-tips-2024',
    changeType: 'semantic',
    agentId: 'agent_semantic_v1',
    agentName: 'Agent Sémantique',
    aiConfidence: 88,
    status: 'pending_validation',
    diff: {
      field: 'meta_description',
      original: 'Learn basic SEO techniques to improve your website ranking.',
      proposed: 'Découvrez les 15 meilleures stratégies SEO en 2024. Guide complet avec techniques on-page, off-page et conseils d\'experts pour améliorer votre ranking Google. Résultats garantis en 30 jours.'
    },
    reasoning: `La meta description actuelle est trop courte (58 caractères) et manque d'éléments persuasifs. La nouvelle version:
- Utilise 156 caractères (optimal)
- Inclut un chiffre (15 stratégies)
- Ajoute une promesse de résultat (30 jours)
- Mentionne Google pour la pertinence`,
    expectedImpact: '+10-20% CTR estimé',
    createdAt: new Date('2024-01-22T10:18:00Z'),
    updatedAt: new Date('2024-01-22T10:18:00Z'),
    reviewedBy: null,
    reviewNote: null
  },
  {
    id: 'proposal_003',
    targetUrl: 'https://example.com/products/seo-tool',
    targetPath: '/products/seo-tool',
    changeType: 'technical',
    agentId: 'agent_technical_v1',
    agentName: 'Agent Technique',
    aiConfidence: 95,
    status: 'pending_validation',
    diff: {
      field: 'structured_data',
      original: '<!-- No Product schema -->',
      proposed: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "SEO Tool Pro",
  "description": "Outil d'analyse SEO automatisé",
  "brand": { "@type": "Brand", "name": "SEO Autonome" },
  "offers": {
    "@type": "Offer",
    "price": "49.00",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127"
  }
}`
    },
    reasoning: `La page produit n'a aucune donnée structurée Product. L'ajout du schema Product permettra:
- L'affichage de rich snippets (prix, avis, disponibilité)
- Une meilleure compréhension par Google du contenu
- Potentiellement +35% de CTR grâce aux étoiles visibles`,
    expectedImpact: 'Rich snippets dans les SERP, +30-40% CTR potentiel',
    createdAt: new Date('2024-01-22T11:05:00Z'),
    updatedAt: new Date('2024-01-22T11:05:00Z'),
    reviewedBy: null,
    reviewNote: null
  },
  {
    id: 'proposal_004',
    targetUrl: 'https://example.com/blog/seo-tips-2024',
    targetPath: '/blog/seo-tips-2024',
    changeType: 'structure',
    agentId: 'agent_technical_v1',
    agentName: 'Agent Technique',
    aiConfidence: 91,
    status: 'pending_validation',
    diff: {
      field: 'faq_schema',
      original: '<!-- No FAQ section -->',
      proposed: `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Quelles sont les meilleures techniques SEO en 2024 ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Les meilleures techniques SEO en 2024 incluent l'optimisation pour l'IA, le contenu E-E-A-T, les Core Web Vitals, et le SEO sémantique."
      }
    },
    {
      "@type": "Question", 
      "name": "Combien de temps pour voir des résultats SEO ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Les premiers résultats SEO apparaissent généralement entre 3 et 6 mois, selon la compétitivité du secteur."
      }
    }
  ]
}`
    },
    reasoning: `L'ajout d'un FAQ schema permettra d'apparaître dans les "People Also Ask" de Google et d'occuper plus d'espace dans les SERP. Les questions ont été générées à partir des recherches associées les plus fréquentes.`,
    expectedImpact: 'Apparition dans PAA, +50% visibilité SERP',
    createdAt: new Date('2024-01-22T11:30:00Z'),
    updatedAt: new Date('2024-01-22T11:30:00Z'),
    reviewedBy: null,
    reviewNote: null
  },
  {
    id: 'proposal_005',
    targetUrl: 'https://example.com/',
    targetPath: '/',
    changeType: 'performance',
    agentId: 'agent_performance_v1',
    agentName: 'Agent Performance',
    aiConfidence: 97,
    status: 'approved',
    diff: {
      field: 'image_optimization',
      original: 'hero-image.png (2.4MB, 3000x2000)',
      proposed: 'hero-image.webp (145KB, 1920x1280, lazy-loaded)'
    },
    reasoning: `L'image hero est trop lourde et impacte le LCP. Conversion en WebP avec redimensionnement et lazy loading permet de réduire la taille de 94% tout en maintenant la qualité visuelle.`,
    expectedImpact: 'LCP -1.2s, PageSpeed +15 points',
    createdAt: new Date('2024-01-21T09:00:00Z'),
    updatedAt: new Date('2024-01-21T14:30:00Z'),
    reviewedBy: 'user_admin',
    reviewNote: 'Approuvé - impact performance critique'
  },
  {
    id: 'proposal_006',
    targetUrl: 'https://example.com/pricing',
    targetPath: '/pricing',
    changeType: 'semantic',
    agentId: 'agent_semantic_v1',
    agentName: 'Agent Sémantique',
    aiConfidence: 72,
    status: 'rejected',
    diff: {
      field: 'h1',
      original: 'Nos Tarifs',
      proposed: 'Prix SEO Tool 2024 - Tarifs et Abonnements Compétitifs'
    },
    reasoning: `Le H1 actuel est trop court et manque de mots-clés. Cependant, la confiance est modérée car le changement pourrait affecter l'identité de marque.`,
    expectedImpact: '+5% trafic organique sur page pricing',
    createdAt: new Date('2024-01-20T16:00:00Z'),
    updatedAt: new Date('2024-01-20T17:45:00Z'),
    reviewedBy: 'user_admin',
    reviewNote: 'Rejeté - On préfère garder un style sobre pour la page pricing'
  },
  {
    id: 'proposal_007',
    targetUrl: 'https://example.com/blog/ai-seo',
    targetPath: '/blog/ai-seo',
    changeType: 'semantic',
    agentId: 'agent_semantic_v1',
    agentName: 'Agent Sémantique',
    aiConfidence: 89,
    status: 'deployed',
    diff: {
      field: 'meta_title',
      original: 'AI and SEO',
      proposed: 'IA et SEO : Comment l\'Intelligence Artificielle Révolutionne le Référencement en 2024'
    },
    reasoning: `Optimisation du title pour le marché francophone avec mots-clés à fort volume.`,
    expectedImpact: '+20% CTR',
    createdAt: new Date('2024-01-18T10:00:00Z'),
    updatedAt: new Date('2024-01-19T08:00:00Z'),
    reviewedBy: 'user_admin',
    reviewNote: 'Déployé via Cloud Build trigger'
  }
];

/**
 * Collection: crawlSessions
 * Represents crawler execution sessions
 */
export const crawlSessions = [
  {
    id: 'session_001',
    startedAt: new Date('2024-01-22T14:00:00Z'),
    completedAt: null,
    pagesScanned: 1247,
    totalPages: 1530,
    status: 'running',
    summary: {
      avgSeoScore: 87,
      issuesFound: 23,
      criticalIssues: 2
    }
  }
];

/**
 * Collection: systemConfig
 * Global configuration for the SEO platform
 */
export const systemConfig = {
  autoApproveThreshold: 95,  // Auto-approve proposals with confidence >= 95%
  abTestTrafficPercent: 20,
  rollbackTriggers: {
    bounceRateIncrease: 15,   // Rollback if bounce rate increases by 15%
    positionDrop: 5           // Rollback if position drops by 5+ places
  },
  agents: {
    semantic: { enabled: true, model: 'gemini-1.5-pro' },
    technical: { enabled: true, model: 'gemini-1.5-pro' },
    performance: { enabled: true, model: 'gemini-1.5-flash' },
    strategist: { enabled: true, model: 'gemini-1.5-pro' }
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get proposals by status
 * @param {ProposalStatus} status 
 * @returns {AgentProposal[]}
 */
export function getProposalsByStatus(status) {
  return agentProposals.filter(p => p.status === status);
}

/**
 * Get page audit by path
 * @param {string} path 
 * @returns {PageAudit|undefined}
 */
export function getAuditByPath(path) {
  return pageAudits.find(a => a.path === path);
}

/**
 * Calculate aggregate stats
 * @returns {Object}
 */
export function getAggregateStats() {
  const pendingCount = agentProposals.filter(p => p.status === 'pending_validation').length;
  const approvedCount = agentProposals.filter(p => p.status === 'approved').length;
  const deployedCount = agentProposals.filter(p => p.status === 'deployed').length;
  const avgSeoScore = Math.round(pageAudits.reduce((acc, p) => acc + p.seoScore, 0) / pageAudits.length);
  
  return {
    pendingCount,
    approvedCount,
    deployedCount,
    avgSeoScore,
    totalPages: pageAudits.length
  };
}
