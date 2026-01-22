// src/services/auditService.js
import { auth } from '@/firebase-client'; // Ensure you have client-side firebase init

/**
 * Service to interact with Audit API modules
 * Now connected to real Next.js API Routes /api/sites/...
 */

// Helper to get auth token
const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  const token = await user.getIdToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const auditService = {

  // Fetch dashboard metrics
  async getDashboardMetrics() {
    try {
      // For MVP, aggregate from sites
      const sites = await this.getAllSites();
      // Mock aggregation results for now as we don't have a dedicated endpoint yet
      return {
        seoScore: sites.length > 0 ? 85 : 0, 
        avgPosition: sites.length > 0 ? 12 : 0,
        organicTraffic: sites.length > 0 ? 1200 : 0,
        coreWebVitals: { lcp: 2.1, cls: 0.1, fid: 45 }
      };
    } catch (e) {
      console.warn('Dashboard fetch failed', e);
      return null;
    }
  },

  // Get Trend Data
  async getTrendData(range = '30d') {
    // Mock trend for now
    return Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 86400000).toLocaleDateString(),
      position: 4 + Math.random() * 2,
      traffic: 1000 + Math.random() * 500
    }));
  },

  // Get Recent Activities
  async getRecentActivities() {
    // Mock for now
    return [
      { id: 1, agent: 'System', action: 'Platform Ready', target: 'Global', time: 'Now', status: 'success' }
    ];
  },

  async getPageAudit(pageUrl) {
    return null; 
  },

  // Fetch all sites
  async getAllSites() {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/sites', { headers });
      if (!res.ok) throw new Error('Failed to fetch sites');
      const data = await res.json();
      return data.sites || [];
    } catch (error) {
      console.error('getAllSites error', error);
      return [];
    }
  },

  // Create new site
  async addSite(domainUrl, settings) {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/sites', { 
        method: 'POST',
        headers,
        body: JSON.stringify({ domainUrl, settings })
      });
      if (!res.ok) throw new Error('Failed to create site');
      return await res.json();
    } catch (error) {
      console.error('addSite error', error);
      throw error;
    }
  }
};
