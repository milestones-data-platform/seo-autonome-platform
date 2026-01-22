# Firestore Database Schema

This document outlines the NoSQL data structure for the SEO Autonome Platform using Google Cloud Firestore.

## Collections Structure

```
users/                 # Root collection for user profiles
└── {userId}          # User ID from Firebase Auth

sites/                 # Root collection for managed websites
└── {siteId}          # Unique ID for the site
    ├── audits/        # Sub-collection: Historical crawl data
    │   └── {auditId}
    └── proposals/     # Sub-collection: AI-generated change proposals
        └── {proposalId}
```

---

## Detailed JSON Schemas

### 1. Users Collection (`users`)

```json
// Path: users/{userId}
{
  "uid": "user_123456789",          // String: Maps to Firebase Auth UID
  "email": "user@example.com",      // String
  "displayName": "John Doe",        // String
  "photoURL": "https://...",        // String (optional)
  "plan": "pro",                    // String: 'free', 'pro', 'enterprise'
  "createdAt": "2024-01-22T10:00:00Z", // Timestamp
  "roles": ["admin"]                // Array<String>: User roles
}
```

### 2. Sites Collection (`sites`)

```json
// Path: sites/{siteId}
{
  "id": "site_abc123",              // String
  "ownerId": "user_123456789",      // String: Reference to users.uid
  "domainUrl": "https://example.com", // String
  "name": "My E-commerce Store",    // String
  "settings": {
    "frequency": "daily",           // String: 'daily', 'weekly', 'manual'
    "toneOfVoice": "professional",  // String
    "targetRegion": "fr-FR"         // String
  },
  "currentSeoScore": 94,            // Number: 0-100 (Cached from latest audit)
  "createdAt": "2024-01-22T10:00:00Z", // Timestamp
  "updatedAt": "2024-01-22T14:30:00Z"  // Timestamp
}
```

### 3. Audits Sub-collection (`sites/{siteId}/audits`)

```json
// Path: sites/{siteId}/audits/{auditId}
{
  "id": "audit_xyz789",             // String
  "date": "2024-01-22T14:30:00Z",   // Timestamp
  "status": "completed",            // String: 'running', 'completed', 'failed'
  "metrics": {
    "seoScore": 94,                 // Number: Global score
    "performance": 89,              // Number
    "accessibility": 96,            // Number
    "bestPractices": 92,            // Number
    "seo": 98                       // Number
  },
  "coreWebVitals": {
    "lcp": 2.1,                     // Number (seconds)
    "cls": 0.08,                    // Number
    "fid": 45                       // Number (ms)
  },
  "keywordPositions": [             // Array<Object>: Top tracked keywords
    {
      "keyword": "seo tools",
      "position": 3,
      "previousPosition": 5,
      "volume": 12400
    }
  ],
  "pagesScanned": 1247,             // Number
  "rawHtmlStorageUrl": "gs://seo-autonome-audits/audit_xyz789.json" // String: Link to full data
}
```

### 4. Proposals Sub-collection (`sites/{siteId}/proposals`)

```json
// Path: sites/{siteId}/proposals/{proposalId}
{
  "id": "prop_987654",              // String
  "targetUrl": "https://example.com/blog/seo-tips", // String
  "targetPath": "/blog/seo-tips",   // String
  "type": "semantic",               // String: 'semantic', 'technical', 'structure', 'performance'
  "status": "pending_validation",   // String: 'pending_validation', 'approved', 'rejected', 'deployed'
  
  "agentInfo": {
    "id": "agent_semantic_v1",      // String
    "name": "Agent Sémantique",     // String
    "model": "gemini-1.5-pro"       // String
  },
  
  "confidenceScore": 92,            // Number: 0-100
  "aiReasoning": "L'analyse de l'intention montre que...", // String
  "expectedImpact": "+15% CTR",     // String
  
  "contentDiff": {
    "field": "meta_title",          // String: The field being modified
    "original": "SEO Tips",         // String
    "proposed": "SEO Tips 2024..."  // String
  },
  
  "deploymentInfo": {               // Object (optional, present if approved/deployed)
    "approvedBy": "user_123456789", // String
    "approvedAt": "2024-01-22T15:00:00Z", // Timestamp
    "buildId": "build_123"          // String
  },
  
  "rejectionInfo": {                // Object (optional, present if rejected)
    "rejectedBy": "user_123456789",
    "rejectedAt": "2024-01-22T15:00:00Z",
    "reason": "Too aggressive"
  },

  "createdAt": "2024-01-22T14:45:00Z" // Timestamp
}
```
