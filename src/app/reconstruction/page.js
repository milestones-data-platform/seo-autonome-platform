'use client';

import { 
  Hammer,
  FileText,
  Code,
  Eye,
  ExternalLink,
  CheckCircle,
  Clock,
  ArrowRight,
  GitBranch,
  RefreshCw,
  Layers,
  Diff
} from 'lucide-react';
import styles from './page.module.css';

const pendingChanges = [
  {
    id: 1,
    page: '/blog/seo-tips-2024',
    type: 'content',
    changes: ['Meta title optimisé', 'Nouveau paragraphe d\'introduction', 'FAQ ajoutée'],
    agent: 'Agent Sémantique',
    status: 'ready'
  },
  {
    id: 2,
    page: '/produits/logiciel-seo',
    type: 'technical',
    changes: ['Schema Product ajouté', 'Structured data FAQ'],
    agent: 'Agent Technique',
    status: 'testing'
  },
  {
    id: 3,
    page: '/homepage',
    type: 'performance',
    changes: ['Images WebP optimisées', 'Lazy loading activé'],
    agent: 'Agent Performance',
    status: 'ready'
  }
];

const contentComparison = {
  original: {
    title: 'SEO Tips for Beginners',
    description: 'Learn basic SEO techniques to improve your website ranking.',
    h1: 'SEO Tips',
  },
  optimized: {
    title: 'SEO Tips 2024: 15 Techniques Essentielles pour Débutants',
    description: 'Découvrez les meilleures stratégies SEO en 2024. Guide complet avec techniques on-page, off-page et conseils d\'experts pour améliorer votre ranking Google.',
    h1: '15 Conseils SEO Essentiels pour Débutants en 2024',
  }
};

const shadowDeployments = [
  { id: 1, url: 'preview-abc123.vercel.app', status: 'passed', score: 96, time: '2 min ago' },
  { id: 2, url: 'preview-def456.vercel.app', status: 'testing', score: null, time: 'En cours' },
  { id: 3, url: 'preview-ghi789.vercel.app', status: 'failed', score: 72, time: '15 min ago' },
];

export default function ReconstructionPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <Hammer className={styles.titleIcon} size={32} />
            <span className="text-gradient">Reconstruction</span>
          </h1>
          <p className={styles.subtitle}>Usine de reconstruction - Génération de contenu et code par IA</p>
        </div>
      </header>

      <div className={styles.mainGrid}>
        {/* Pending Changes */}
        <section className={`card ${styles.changesSection} animate-slide-up`}>
          <div className="card-header">
            <div>
              <h2 className="card-title">📝 Modifications en Attente</h2>
              <p className="card-subtitle">Changements générés par les agents</p>
            </div>
            <span className="badge badge-primary">{pendingChanges.length} en attente</span>
          </div>

          <div className={styles.changesList}>
            {pendingChanges.map((change) => (
              <div key={change.id} className={styles.changeItem}>
                <div className={styles.changeHeader}>
                  <code className={styles.changePath}>{change.page}</code>
                  <span className={`badge ${
                    change.status === 'ready' ? 'badge-success' : 'badge-warning'
                  }`}>
                    {change.status === 'ready' ? 'Prêt' : 'En test'}
                  </span>
                </div>
                <div className={styles.changeContent}>
                  <span className={styles.changeAgent}>{change.agent}</span>
                  <ul className={styles.changeDetails}>
                    {change.changes.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.changeActions}>
                  <button className="btn btn-ghost">
                    <Eye size={14} />
                    Prévisualiser
                  </button>
                  <button className="btn btn-primary">
                    <CheckCircle size={14} />
                    Approuver
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Content Editor */}
        <section className={`card ${styles.editorSection} animate-slide-up stagger-2`}>
          <div className="card-header">
            <div>
              <h2 className="card-title">✍️ Éditeur de Contenu</h2>
              <p className="card-subtitle">Comparaison avant/après optimisation</p>
            </div>
            <div className={styles.editorTabs}>
              <button className={`${styles.tab} ${styles.active}`}>Contenu</button>
              <button className={styles.tab}>Code</button>
              <button className={styles.tab}>Schema</button>
            </div>
          </div>

          <div className={styles.comparisonGrid}>
            <div className={styles.comparisonPanel}>
              <div className={styles.panelHeader}>
                <span className={styles.panelLabel}>Original</span>
                <FileText size={16} />
              </div>
              <div className={styles.panelContent}>
                <div className={styles.field}>
                  <label>Meta Title</label>
                  <div className={styles.originalValue}>{contentComparison.original.title}</div>
                </div>
                <div className={styles.field}>
                  <label>Meta Description</label>
                  <div className={styles.originalValue}>{contentComparison.original.description}</div>
                </div>
                <div className={styles.field}>
                  <label>H1</label>
                  <div className={styles.originalValue}>{contentComparison.original.h1}</div>
                </div>
              </div>
            </div>

            <div className={styles.diffArrow}>
              <Diff size={24} />
            </div>

            <div className={`${styles.comparisonPanel} ${styles.optimized}`}>
              <div className={styles.panelHeader}>
                <span className={styles.panelLabel}>Optimisé par IA</span>
                <Code size={16} />
              </div>
              <div className={styles.panelContent}>
                <div className={styles.field}>
                  <label>Meta Title</label>
                  <div className={styles.optimizedValue}>{contentComparison.optimized.title}</div>
                </div>
                <div className={styles.field}>
                  <label>Meta Description</label>
                  <div className={styles.optimizedValue}>{contentComparison.optimized.description}</div>
                </div>
                <div className={styles.field}>
                  <label>H1</label>
                  <div className={styles.optimizedValue}>{contentComparison.optimized.h1}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Shadow Deployment */}
        <section className={`card ${styles.deploySection} animate-slide-up stagger-3`}>
          <div className="card-header">
            <div>
              <h2 className="card-title">🔮 Shadow Deployment</h2>
              <p className="card-subtitle">Déploiements fantômes pour tests</p>
            </div>
            <button className="btn btn-secondary">
              <GitBranch size={14} />
              Nouveau déploiement
            </button>
          </div>

          <div className={styles.deployList}>
            {shadowDeployments.map((deploy) => (
              <div key={deploy.id} className={styles.deployItem}>
                <div className={styles.deployUrl}>
                  <Layers size={16} />
                  <code>{deploy.url}</code>
                </div>
                <div className={styles.deployStatus}>
                  {deploy.status === 'passed' && (
                    <>
                      <span className="badge badge-success">
                        <CheckCircle size={12} />
                        Validé
                      </span>
                      <span className={styles.deployScore}>Score: {deploy.score}</span>
                    </>
                  )}
                  {deploy.status === 'testing' && (
                    <span className="badge badge-warning">
                      <RefreshCw size={12} className="animate-spin" />
                      En test
                    </span>
                  )}
                  {deploy.status === 'failed' && (
                    <>
                      <span className="badge badge-error">Échoué</span>
                      <span className={styles.deployScore}>Score: {deploy.score}</span>
                    </>
                  )}
                </div>
                <div className={styles.deployActions}>
                  <span className={styles.deployTime}>
                    <Clock size={12} />
                    {deploy.time}
                  </span>
                  <button className="btn btn-ghost">
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
