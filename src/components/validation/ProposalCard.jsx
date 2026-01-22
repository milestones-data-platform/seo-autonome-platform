'use client';

import { useState } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Bot, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles
} from 'lucide-react';
import styles from './ProposalCard.module.css';

/**
 * ProposalCard Component
 * Displays an AgentProposal with diff viewer and approve/reject actions
 * 
 * @param {Object} props
 * @param {AgentProposal} props.proposal - The proposal to display
 * @param {Function} props.onApprove - Callback when approved
 * @param {Function} props.onReject - Callback when rejected
 * @param {boolean} props.isProcessing - Whether an action is in progress
 */
export default function ProposalCard({ proposal, onApprove, onReject, isProcessing = false }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const confidenceColor = proposal.aiConfidence >= 90 ? 'high' : 
                          proposal.aiConfidence >= 75 ? 'medium' : 'low';

  const changeTypeLabels = {
    semantic: { label: 'Sémantique', icon: '✍️' },
    technical: { label: 'Technique', icon: '⚙️' },
    structure: { label: 'Structure', icon: '🏗️' },
    performance: { label: 'Performance', icon: '⚡' }
  };

  const handleApprove = () => {
    onApprove(proposal.id);
  };

  const handleReject = () => {
    if (rejectReason.trim()) {
      onReject(proposal.id, rejectReason);
      setShowRejectForm(false);
      setRejectReason('');
    }
  };

  return (
    <article className={styles.card}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={`${styles.changeType} ${styles[proposal.changeType]}`}>
            {changeTypeLabels[proposal.changeType]?.icon} {changeTypeLabels[proposal.changeType]?.label}
          </span>
          <code className={styles.targetPath}>{proposal.targetPath}</code>
        </div>
        <div className={styles.headerRight}>
          <div className={`${styles.confidence} ${styles[confidenceColor]}`}>
            <Sparkles size={14} />
            <span>Confiance IA: {proposal.aiConfidence}%</span>
          </div>
          <button 
            className={styles.expandBtn}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Réduire' : 'Développer'}
          >
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </header>

      {/* Agent Info */}
      <div className={styles.agentInfo}>
        <Bot size={16} />
        <span>{proposal.agentName}</span>
        <span className={styles.separator}>•</span>
        <span className={styles.field}>Champ: <strong>{proposal.diff.field}</strong></span>
      </div>

      {isExpanded && (
        <>
          {/* Diff Viewer */}
          <div className={styles.diffContainer}>
            <div className={styles.diffPanel}>
              <div className={styles.diffHeader}>
                <span className={styles.diffLabel}>🔴 Original</span>
              </div>
              <pre className={styles.diffContent}>{proposal.diff.original}</pre>
            </div>
            <div className={`${styles.diffPanel} ${styles.proposed}`}>
              <div className={styles.diffHeader}>
                <span className={styles.diffLabel}>🟢 Proposé par l'IA</span>
              </div>
              <pre className={styles.diffContent}>{proposal.diff.proposed}</pre>
            </div>
          </div>

          {/* AI Reasoning */}
          <div className={styles.reasoning}>
            <h4 className={styles.reasoningTitle}>
              <Sparkles size={16} />
              Raisonnement de l'IA
            </h4>
            <p className={styles.reasoningText}>{proposal.reasoning}</p>
          </div>

          {/* Expected Impact */}
          <div className={styles.impact}>
            <span className={styles.impactLabel}>Impact attendu:</span>
            <span className={styles.impactValue}>{proposal.expectedImpact}</span>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            {!showRejectForm ? (
              <>
                <button 
                  className={`${styles.actionBtn} ${styles.rejectBtn}`}
                  onClick={() => setShowRejectForm(true)}
                  disabled={isProcessing}
                >
                  <XCircle size={18} />
                  Rejeter
                </button>
                <button 
                  className={`${styles.actionBtn} ${styles.approveBtn}`}
                  onClick={handleApprove}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <Loader2 size={18} className={styles.spinner} />
                  ) : (
                    <CheckCircle size={18} />
                  )}
                  Approuver & Déployer
                </button>
              </>
            ) : (
              <div className={styles.rejectForm}>
                <textarea
                  className={styles.rejectInput}
                  placeholder="Raison du rejet (sera envoyée à Vertex AI pour amélioration)..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={2}
                />
                <div className={styles.rejectActions}>
                  <button 
                    className={styles.cancelBtn}
                    onClick={() => setShowRejectForm(false)}
                  >
                    Annuler
                  </button>
                  <button 
                    className={`${styles.actionBtn} ${styles.rejectBtn}`}
                    onClick={handleReject}
                    disabled={!rejectReason.trim() || isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 size={18} className={styles.spinner} />
                    ) : (
                      <XCircle size={18} />
                    )}
                    Confirmer le rejet
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Warning for low confidence */}
          {proposal.aiConfidence < 80 && (
            <div className={styles.warning}>
              <AlertTriangle size={16} />
              <span>Confiance faible - Vérification humaine recommandée</span>
            </div>
          )}
        </>
      )}
    </article>
  );
}
