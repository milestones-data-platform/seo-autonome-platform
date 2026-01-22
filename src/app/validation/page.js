'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  ShieldCheck,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Rocket,
  RotateCcw,
  RefreshCw,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import ProposalCard from '@/components/validation/ProposalCard';
import { ProposalSkeleton } from '@/components/ui/Skeleton';
import { 
  getAllProposals, 
  approveProposal, 
  rejectProposal 
} from '@/services/agentService';
import styles from './page.module.css';

const statusFilters = [
  { id: 'pending_validation', label: 'En attente', icon: Clock, color: 'warning' },
  { id: 'approved', label: 'Approuvés', icon: CheckCircle, color: 'success' },
  { id: 'rejected', label: 'Rejetés', icon: XCircle, color: 'error' },
  { id: 'deployed', label: 'Déployés', icon: Rocket, color: 'info' },
];

export default function ValidationPage() {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('pending_validation');
  const [processingId, setProcessingId] = useState(null);
  const [notification, setNotification] = useState(null);

  // Fetch proposals
  const fetchProposals = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllProposals();
      setProposals(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  // Filter proposals by status
  const filteredProposals = proposals.filter(p => p.status === activeFilter);

  // Count by status
  const statusCounts = statusFilters.reduce((acc, filter) => {
    acc[filter.id] = proposals.filter(p => p.status === filter.id).length;
    return acc;
  }, {});

  // Handle approve
  const handleApprove = async (proposalId) => {
    setProcessingId(proposalId);
    try {
      const result = await approveProposal(proposalId);
      if (result.success) {
        // Update local state
        setProposals(prev => prev.map(p => 
          p.id === proposalId 
            ? { ...p, status: 'approved', updatedAt: new Date() }
            : p
        ));
        showNotification('success', `Proposition approuvée. Build ID: ${result.buildId}`);
      }
    } catch (err) {
      showNotification('error', 'Erreur lors de l\'approbation');
    } finally {
      setProcessingId(null);
    }
  };

  // Handle reject
  const handleReject = async (proposalId, reason) => {
    setProcessingId(proposalId);
    try {
      const result = await rejectProposal(proposalId, reason);
      if (result.success) {
        // Update local state
        setProposals(prev => prev.map(p => 
          p.id === proposalId 
            ? { ...p, status: 'rejected', reviewNote: reason, updatedAt: new Date() }
            : p
        ));
        showNotification('info', 'Proposition rejetée. Feedback envoyé à Vertex AI.');
      }
    } catch (err) {
      showNotification('error', 'Erreur lors du rejet');
    } finally {
      setProcessingId(null);
    }
  };

  // Show notification
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className={styles.page}>
      {/* Notification Toast */}
      {notification && (
        <div className={`${styles.notification} ${styles[notification.type]}`}>
          {notification.type === 'success' && <CheckCircle size={18} />}
          {notification.type === 'error' && <XCircle size={18} />}
          {notification.type === 'info' && <AlertTriangle size={18} />}
          <span>{notification.message}</span>
        </div>
      )}

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <ShieldCheck className={styles.titleIcon} size={32} />
            <span className="text-gradient">Human-in-the-Loop Validation</span>
          </h1>
          <p className={styles.subtitle}>
            Centre de contrôle - Validez les propositions des agents IA avant déploiement
          </p>
        </div>
        <button 
          className="btn btn-secondary"
          onClick={fetchProposals}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 size={16} className={styles.spinner} />
          ) : (
            <RefreshCw size={16} />
          )}
          Actualiser
        </button>
      </header>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        {statusFilters.map(filter => {
          const Icon = filter.icon;
          const count = statusCounts[filter.id] || 0;
          const isActive = activeFilter === filter.id;
          
          return (
            <button
              key={filter.id}
              className={`${styles.statBtn} ${styles[filter.color]} ${isActive ? styles.active : ''}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              <Icon size={18} />
              <span className={styles.statLabel}>{filter.label}</span>
              <span className={styles.statCount}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <main className={styles.content}>
        {error && (
          <div className={styles.errorState}>
            <AlertTriangle size={48} />
            <h3>Erreur de chargement</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={fetchProposals}>
              <RotateCcw size={16} />
              Réessayer
            </button>
          </div>
        )}

        {isLoading && !error && (
          <div className={styles.proposalsList}>
            <ProposalSkeleton />
            <ProposalSkeleton />
            <ProposalSkeleton />
          </div>
        )}

        {!isLoading && !error && filteredProposals.length === 0 && (
          <div className={styles.emptyState}>
            <Filter size={48} />
            <h3>Aucune proposition</h3>
            <p>
              {activeFilter === 'pending_validation' 
                ? 'Toutes les propositions ont été traitées. Les agents IA génèrent de nouvelles suggestions...'
                : `Aucune proposition avec le statut "${statusFilters.find(f => f.id === activeFilter)?.label}"`
              }
            </p>
          </div>
        )}

        {!isLoading && !error && filteredProposals.length > 0 && (
          <div className={styles.proposalsList}>
            {filteredProposals.map((proposal, index) => (
              <div 
                key={proposal.id} 
                className={`animate-slide-up stagger-${Math.min(index + 1, 5)}`}
              >
                <ProposalCard
                  proposal={proposal}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isProcessing={processingId === proposal.id}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Info Panel */}
      <aside className={`card ${styles.infoPanel}`}>
        <h3 className={styles.infoPanelTitle}>🔄 Workflow de Validation</h3>
        <div className={styles.workflowSteps}>
          <div className={styles.workflowStep}>
            <span className={styles.stepNumber}>1</span>
            <div>
              <strong>Analyse IA</strong>
              <p>Les agents Vertex AI analysent le site et génèrent des propositions</p>
            </div>
          </div>
          <div className={styles.workflowStep}>
            <span className={styles.stepNumber}>2</span>
            <div>
              <strong>Validation Humaine</strong>
              <p>Vous examinez le diff et le raisonnement de l'IA</p>
            </div>
          </div>
          <div className={styles.workflowStep}>
            <span className={`${styles.stepNumber} ${styles.current}`}>3</span>
            <div>
              <strong>Décision</strong>
              <p>Approuver → Cloud Build | Rejeter → Feedback Vertex AI</p>
            </div>
          </div>
          <div className={styles.workflowStep}>
            <span className={styles.stepNumber}>4</span>
            <div>
              <strong>Déploiement</strong>
              <p>Cloud Run déploie les changements sur le site</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
