/**
 * Audit Service
 * Simulates Firestore queries for page audit data
 * In production, this would use Firebase Admin SDK or Firestore REST API
 */

import { pageAudits, crawlSessions, getAuditByPath, getAggregateStats } from '@/data/mock-firestore';

// Simulated network latency (ms)
const NETWORK_LATENCY = {
  fast: 300,
  normal: 800,
  slow: 1500
};

/**
 * Simulate network delay
 * @param {number} ms - Delay in milliseconds
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch all page audits
 * Simulates: firestore.collection('pageAudits').get()
 * @returns {Promise<PageAudit[]>}
 */
export async function getAllAudits() {
  await delay(NETWORK_LATENCY.normal);
  
  // Simulate occasional network errors (5% chance)
  if (Math.random() < 0.05) {
    throw new Error('Network error: Failed to fetch audits from Firestore');
  }
  
  return [...pageAudits];
}

/**
 * Fetch a single page audit by path
 * Simulates: firestore.collection('pageAudits').where('path', '==', path).get()
 * @param {string} path - Page path
 * @returns {Promise<PageAudit|null>}
 */
export async function getAuditByPathAsync(path) {
  await delay(NETWORK_LATENCY.fast);
  
  const audit = getAuditByPath(path);
  return audit || null;
}

/**
 * Fetch current crawl session
 * Simulates: firestore.collection('crawlSessions').where('status', '==', 'running').get()
 * @returns {Promise<CrawlSession|null>}
 */
export async function getCurrentCrawlSession() {
  await delay(NETWORK_LATENCY.fast);
  
  const running = crawlSessions.find(s => s.status === 'running');
  return running || null;
}

/**
 * Fetch dashboard metrics
 * Simulates aggregation query across multiple collections
 * @returns {Promise<Object>}
 */
export async function getDashboardMetrics() {
  await delay(NETWORK_LATENCY.normal);
  
  const stats = getAggregateStats();
  const crawlSession = crawlSessions.find(s => s.status === 'running');
  
  return {
    seoScore: {
      value: stats.avgSeoScore,
      change: +3.2,
      trend: 'up'
    },
    avgPosition: {
      value: 4.2,
      change: -0.8,
      trend: 'up' // Lower is better for position
    },
    coreWebVitals: {
      value: 89,
      change: +5,
      trend: 'up'
    },
    organicTraffic: {
      value: '12.4K',
      rawValue: 12400,
      change: +12.5,
      trend: 'up'
    },
    pendingProposals: stats.pendingCount,
    totalPages: stats.totalPages,
    crawlProgress: crawlSession ? {
      scanned: crawlSession.pagesScanned,
      total: crawlSession.totalPages,
      percent: Math.round((crawlSession.pagesScanned / crawlSession.totalPages) * 100)
    } : null
  };
}

/**
 * Fetch pages with issues (for observation page)
 * @returns {Promise<PageAudit[]>}
 */
export async function getPagesWithIssues() {
  await delay(NETWORK_LATENCY.fast);
  
  return pageAudits.filter(p => p.issues.length > 0);
}

/**
 * Fetch SEO score history (for charts)
 * Simulates time-series data from Firestore
 * @param {number} days - Number of days of history
 * @returns {Promise<Array>}
 */
export async function getSeoScoreHistory(days = 30) {
  await delay(NETWORK_LATENCY.normal);
  
  // Generate mock historical data
  const history = [];
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simulate gradual improvement with some variation
    const baseScore = 85 + (days - i) * 0.3;
    const variation = (Math.random() - 0.5) * 4;
    
    history.push({
      date: date.toISOString().split('T')[0],
      day: days - i + 1,
      seoScore: Math.min(100, Math.round(baseScore + variation)),
      position: Math.max(1, 8 - (days - i) * 0.1 + (Math.random() - 0.5)),
      traffic: Math.round(8000 + (days - i) * 150 + Math.random() * 500)
    });
  }
  
  return history;
}
