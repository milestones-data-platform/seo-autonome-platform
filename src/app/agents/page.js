'use client';

import { 
  Bot, 
  Brain, 
  Wrench,
  Gauge,
  Target,
  Activity,
  CheckCircle,
  Clock,
  Zap,
  ArrowRight,
  Play,
  Pause,
  Settings
} from 'lucide-react';
import styles from './page.module.css';

const agents = [
  {
    id: 'semantic',
    name: 'Agent Sémantique',
    description: 'Analyse l\'intention de recherche et réécrit les titres/contenus',
    icon: Brain,
    status: 'active',
    color: 'primary',
    stats: {
      actionsToday: 47,
      successRate: 98.2,
      avgResponseTime: '1.2s'
    },
    lastAction: 'Optimisation des meta descriptions sur 12 pages',
    lastActionTime: '2 min'
  },
  {
    id: 'technical',
    name: 'Agent Technique',
    description: 'Optimise la structure HTML, JSON-LD et le maillage interne',
    icon: Wrench,
    status: 'active',
    color: 'secondary',
    stats: {
      actionsToday: 31,
      successRate: 99.1,
      avgResponseTime: '0.8s'
    },
    lastAction: 'Mise à jour des données structurées Article',
    lastActionTime: '8 min'
  },
  {
    id: 'performance',
    name: 'Agent Performance',
    description: 'Compresse les assets, optimise le chargement des scripts',
    icon: Gauge,
    status: 'running',
    color: 'warning',
    stats: {
      actionsToday: 156,
      successRate: 94.5,
      avgResponseTime: '3.5s'
    },
    lastAction: 'Compression des images en cours...',
    lastActionTime: 'En cours'
  },
  {
    id: 'strategist',
    name: 'Agent Stratège',
    description: 'Décide si une modification est nécessaire ou risquée',
    icon: Target,
    status: 'idle',
    color: 'info',
    stats: {
      actionsToday: 12,
      successRate: 100,
      avgResponseTime: '2.1s'
    },
    lastAction: 'Analyse de risque sur modification page /produits',
    lastActionTime: '15 min'
  }
];

const workflow = [
  { step: 1, name: 'Détection', description: 'Identification d\'une opportunité ou problème', status: 'completed' },
  { step: 2, name: 'Analyse', description: 'Évaluation par l\'Agent Stratège', status: 'completed' },
  { step: 3, name: 'Décision', description: 'Validation ou rejet de l\'action', status: 'current' },
  { step: 4, name: 'Exécution', description: 'Action par l\'agent spécialisé', status: 'pending' },
  { step: 5, name: 'Validation', description: 'Vérification par le module QA', status: 'pending' }
];

const recentDecisions = [
  { id: 1, agent: 'Stratège', decision: 'Approuvé', action: 'Optimiser page /blog/seo-tips pour "SEO tips 2024"', risk: 'low' },
  { id: 2, agent: 'Stratège', decision: 'Rejeté', action: 'Modifier H1 de la homepage', risk: 'high' },
  { id: 3, agent: 'Stratège', decision: 'Approuvé', action: 'Ajouter FAQ schema sur 5 pages produits', risk: 'low' },
  { id: 4, agent: 'Stratège', decision: 'En attente', action: 'Restructuration du maillage interne', risk: 'medium' },
];

export default function AgentsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <Bot className={styles.titleIcon} size={32} />
            <span className="text-gradient">Multi-Agent Hub</span>
          </h1>
          <p className={styles.subtitle}>Système d'orchestration des agents IA spécialisés</p>
        </div>
        <div className={styles.headerActions}>
          <button className="btn btn-secondary">
            <Settings size={16} />
            Configuration
          </button>
          <button className="btn btn-primary">
            <Play size={16} />
            Lancer une analyse
          </button>
        </div>
      </header>

      {/* Agent Cards */}
      <section className={styles.agentsSection}>
        <h2 className={styles.sectionTitle}>Agents Actifs</h2>
        <div className={styles.agentsGrid}>
          {agents.map((agent, index) => {
            const Icon = agent.icon;
            return (
              <div 
                key={agent.id} 
                className={`card ${styles.agentCard} ${styles[agent.color]} animate-slide-up stagger-${index + 1}`}
              >
                <div className={styles.agentHeader}>
                  <div className={`${styles.agentIcon} ${styles[agent.color]}`}>
                    <Icon size={24} />
                  </div>
                  <div className={styles.agentStatus}>
                    <span className={`status-dot ${agent.status === 'active' ? 'active' : agent.status === 'running' ? 'warning' : ''}`} />
                    <span className={styles.statusText}>
                      {agent.status === 'active' ? 'Actif' : 
                       agent.status === 'running' ? 'En cours' : 'Inactif'}
                    </span>
                  </div>
                </div>
                
                <h3 className={styles.agentName}>{agent.name}</h3>
                <p className={styles.agentDescription}>{agent.description}</p>

                <div className={styles.agentStats}>
                  <div className={styles.stat}>
                    <Zap size={14} />
                    <span>{agent.stats.actionsToday} actions</span>
                  </div>
                  <div className={styles.stat}>
                    <CheckCircle size={14} />
                    <span>{agent.stats.successRate}%</span>
                  </div>
                  <div className={styles.stat}>
                    <Clock size={14} />
                    <span>{agent.stats.avgResponseTime}</span>
                  </div>
                </div>

                <div className={styles.lastAction}>
                  <span className={styles.actionLabel}>Dernière action</span>
                  <p className={styles.actionText}>{agent.lastAction}</p>
                  <span className={styles.actionTime}>{agent.lastActionTime}</span>
                </div>

                <button className={`btn btn-ghost ${styles.agentBtn}`}>
                  Voir les logs
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <div className={styles.bottomGrid}>
        {/* Workflow Visualization */}
        <section className={`card ${styles.workflowSection} animate-slide-up`}>
          <div className="card-header">
            <div>
              <h2 className="card-title">📊 Workflow de Décision</h2>
              <p className="card-subtitle">Pipeline d'exécution en cours</p>
            </div>
          </div>

          <div className={styles.workflow}>
            {workflow.map((step, index) => (
              <div key={step.step} className={styles.workflowStep}>
                <div className={`${styles.stepDot} ${styles[step.status]}`}>
                  {step.status === 'completed' ? <CheckCircle size={16} /> : step.step}
                </div>
                <div className={styles.stepContent}>
                  <span className={styles.stepName}>{step.name}</span>
                  <span className={styles.stepDescription}>{step.description}</span>
                </div>
                {index < workflow.length - 1 && (
                  <div className={`${styles.stepLine} ${step.status === 'completed' ? styles.completed : ''}`} />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Recent Decisions */}
        <section className={`card ${styles.decisionsSection} animate-slide-up stagger-2`}>
          <div className="card-header">
            <div>
              <h2 className="card-title">🎯 Décisions Récentes</h2>
              <p className="card-subtitle">Actions validées par l'Agent Stratège</p>
            </div>
          </div>

          <div className={styles.decisionsList}>
            {recentDecisions.map((decision) => (
              <div key={decision.id} className={styles.decisionItem}>
                <div className={`${styles.decisionBadge} ${styles[decision.decision.toLowerCase().replace(' ', '')]}`}>
                  {decision.decision}
                </div>
                <div className={styles.decisionContent}>
                  <p className={styles.decisionAction}>{decision.action}</p>
                  <span className={`badge ${
                    decision.risk === 'low' ? 'badge-success' :
                    decision.risk === 'medium' ? 'badge-warning' : 'badge-error'
                  }`}>
                    Risque {decision.risk === 'low' ? 'faible' : decision.risk === 'medium' ? 'moyen' : 'élevé'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
