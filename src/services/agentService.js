// src/services/agentService.js
import { auth } from '@/firebase-client';

const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  const token = await user.getIdToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const agentService = {
  /**
   * Fetch pending agent proposals for a site
   */
  async getProposals(siteId) {
    if (!siteId) return []; // Require siteId
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/sites/${siteId}/proposals`, { headers });
      if (!res.ok) throw new Error('Failed to fetch proposals');
      const data = await res.json();
      return data.proposals || [];
    } catch (error) {
      console.error('getProposals error', error);
      return [];
    }
  },

  /**
   * Approve a proposal
   */
  async approveProposal(proposalId, siteId) {
    if (!siteId) throw new Error('Site ID required');
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/sites/${siteId}/proposals`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ proposalId, action: 'approve' })
    });
    
    if (!res.ok) throw new Error('Failed to approve');
    return await res.json();
  },

  /**
   * Reject a proposal
   */
  async rejectProposal(proposalId, reason, siteId) {
    if (!siteId) throw new Error('Site ID required');
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/sites/${siteId}/proposals`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ proposalId, action: 'reject', reason })
    });
    
    if (!res.ok) throw new Error('Failed to reject');
    return await res.json();
  },

  async triggerAnalysis(url) {
    console.log('Analysis trigger not fully implemented in frontend service yet');
    return { success: true };
  }
};
