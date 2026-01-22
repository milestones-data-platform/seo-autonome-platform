/**
 * Agent Service
 * Simulates interactions with Cloud Run agent services and Vertex AI
 * In production, this would make HTTP calls to Cloud Run endpoints
 */

import { agentProposals, getProposalsByStatus } from '@/data/mock-firestore';

// Simulated network latency (ms)
const NETWORK_LATENCY = {
  fast: 300,
  normal: 800,
  slow: 1500,
  aiGeneration: 2000  // AI operations take longer
};

/**
 * Simulate network delay
 * @param {number} ms - Delay in milliseconds
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory state for demo (simulates Firestore updates)
let proposalsState = [...agentProposals];

/**
 * Fetch all proposals
 * Simulates: Cloud Run -> Firestore query
 * @returns {Promise<AgentProposal[]>}
 */
export async function getAllProposals() {
  await delay(NETWORK_LATENCY.normal);
  return [...proposalsState];
}

/**
 * Fetch proposals pending validation
 * Simulates: Firestore query with status filter
 * @returns {Promise<AgentProposal[]>}
 */
export async function getPendingProposals() {
  await delay(NETWORK_LATENCY.fast);
  return proposalsState.filter(p => p.status === 'pending_validation');
}

/**
 * Fetch proposals by status
 * @param {string} status - Proposal status
 * @returns {Promise<AgentProposal[]>}
 */
export async function getProposalsByStatusAsync(status) {
  await delay(NETWORK_LATENCY.fast);
  return proposalsState.filter(p => p.status === status);
}

/**
 * Fetch a single proposal by ID
 * @param {string} id - Proposal ID
 * @returns {Promise<AgentProposal|null>}
 */
export async function getProposalById(id) {
  await delay(NETWORK_LATENCY.fast);
  return proposalsState.find(p => p.id === id) || null;
}

/**
 * Approve a proposal
 * Simulates: 
 * 1. Update Firestore document status
 * 2. Trigger Cloud Build for deployment
 * @param {string} proposalId - Proposal ID
 * @param {string} reviewNote - Optional reviewer note
 * @returns {Promise<{success: boolean, message: string, buildId?: string}>}
 */
export async function approveProposal(proposalId, reviewNote = '') {
  await delay(NETWORK_LATENCY.slow);
  
  const proposalIndex = proposalsState.findIndex(p => p.id === proposalId);
  
  if (proposalIndex === -1) {
    return { success: false, message: 'Proposal not found' };
  }
  
  // Update proposal status
  proposalsState[proposalIndex] = {
    ...proposalsState[proposalIndex],
    status: 'approved',
    updatedAt: new Date(),
    reviewedBy: 'current_user',
    reviewNote: reviewNote || 'Approved via Human-in-the-Loop validation'
  };
  
  // Simulate Cloud Build trigger
  const mockBuildId = `build_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.log(`[AgentService] Proposal ${proposalId} approved. Cloud Build triggered: ${mockBuildId}`);
  
  return {
    success: true,
    message: 'Proposal approved. Cloud Build deployment triggered.',
    buildId: mockBuildId
  };
}

/**
 * Reject a proposal
 * Simulates:
 * 1. Update Firestore document status
 * 2. Send feedback to Vertex AI for learning
 * @param {string} proposalId - Proposal ID
 * @param {string} rejectionReason - Reason for rejection (fed back to AI)
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function rejectProposal(proposalId, rejectionReason) {
  await delay(NETWORK_LATENCY.normal);
  
  const proposalIndex = proposalsState.findIndex(p => p.id === proposalId);
  
  if (proposalIndex === -1) {
    return { success: false, message: 'Proposal not found' };
  }
  
  // Update proposal status
  proposalsState[proposalIndex] = {
    ...proposalsState[proposalIndex],
    status: 'rejected',
    updatedAt: new Date(),
    reviewedBy: 'current_user',
    reviewNote: rejectionReason
  };
  
  // Simulate feedback to Vertex AI
  console.log(`[AgentService] Proposal ${proposalId} rejected. Feedback sent to Vertex AI: "${rejectionReason}"`);
  
  return {
    success: true,
    message: 'Proposal rejected. Feedback sent to AI for model improvement.'
  };
}

/**
 * Request new analysis from an agent
 * Simulates: POST to Cloud Run agent endpoint -> Vertex AI generation
 * @param {string} agentType - 'semantic' | 'technical' | 'performance' | 'strategist'
 * @param {string} targetUrl - URL to analyze
 * @returns {Promise<{success: boolean, proposalId?: string}>}
 */
export async function requestAgentAnalysis(agentType, targetUrl) {
  await delay(NETWORK_LATENCY.aiGeneration);
  
  // Simulate AI generating a new proposal
  const newProposalId = `proposal_${Date.now()}`;
  
  console.log(`[AgentService] Requested ${agentType} analysis for ${targetUrl}. New proposal: ${newProposalId}`);
  
  return {
    success: true,
    proposalId: newProposalId,
    message: `${agentType} agent analysis initiated. Results will appear shortly.`
  };
}

/**
 * Get agent activity log
 * Simulates: Firestore query on agent_logs collection
 * @param {number} limit - Max number of logs to return
 * @returns {Promise<Array>}
 */
export async function getAgentActivityLog(limit = 10) {
  await delay(NETWORK_LATENCY.fast);
  
  // Generate mock activity log
  const activities = [
    {
      id: 'log_001',
      agent: 'Agent Sémantique',
      action: 'Optimisé les balises meta de 12 pages',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      status: 'success'
    },
    {
      id: 'log_002',
      agent: 'Agent Technique',
      action: 'Mise à jour des données structurées JSON-LD',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      status: 'success'
    },
    {
      id: 'log_003',
      agent: 'Agent Performance',
      action: 'Compression des images en cours...',
      timestamp: new Date(),
      status: 'running'
    },
    {
      id: 'log_004',
      agent: 'Agent Stratège',
      action: 'Nouvelle opportunité détectée: "SEO IA 2024"',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: 'info'
    }
  ];
  
  return activities.slice(0, limit);
}

/**
 * Get agent statistics
 * @returns {Promise<Object>}
 */
export async function getAgentStats() {
  await delay(NETWORK_LATENCY.fast);
  
  return {
    semantic: {
      actionsToday: 47,
      successRate: 98.2,
      avgResponseTime: '1.2s',
      status: 'active'
    },
    technical: {
      actionsToday: 31,
      successRate: 99.1,
      avgResponseTime: '0.8s',
      status: 'active'
    },
    performance: {
      actionsToday: 156,
      successRate: 94.5,
      avgResponseTime: '3.5s',
      status: 'running'
    },
    strategist: {
      actionsToday: 12,
      successRate: 100,
      avgResponseTime: '2.1s',
      status: 'idle'
    }
  };
}

/**
 * Reset proposals to initial state (for demo purposes)
 */
export function resetProposalsState() {
  proposalsState = [...agentProposals];
}
