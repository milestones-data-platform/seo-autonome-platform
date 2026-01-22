'use client';

import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target, 
  Zap, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  RefreshCw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import MetricCard from '@/components/dashboard/MetricCard';
import TrendChart from '@/components/dashboard/TrendChart';
import AgentActivity from '@/components/dashboard/AgentActivity';
import SystemAlerts from '@/components/dashboard/SystemAlerts';
import styles from './page.module.css';

const metrics = [
  {
    id: 'seo-score',
    title: 'SEO Score',
    value: 94,
    unit: '%',
    change: +3.2,
    trend: 'up',
    icon: Target,
    color: 'primary',
    gauge: true
  },
  {
    id: 'avg-position',
    title: 'Position Moyenne',
    value: 4.2,
    change: -0.8,
    trend: 'up',
    icon: BarChart3,
    color: 'success',
  },
  {
    id: 'core-vitals',
    title: 'Core Web Vitals',
    value: 89,
    unit: '/100',
    change: +5,
    trend: 'up',
    icon: Zap,
    color: 'warning',
  },
  {
    id: 'organic-traffic',
    title: 'Trafic Organique',
    value: '12.4K',
    change: +12.5,
    trend: 'up',
    icon: Activity,
    color: 'info',
  }
];

const recentActivities = [
  {
    id: 1,
    agent: 'Agent Sémantique',
    action: 'Optimisé les balises meta de 12 pages',
    time: 'Il y a 2 min',
    status: 'success',
    icon: Bot
  },
  {
    id: 2,
    agent: 'Agent Technique',
    action: 'Mise à jour des données structurées JSON-LD',
    time: 'Il y a 8 min',
    status: 'success',
    icon: Bot
  },
  {
    id: 3,
    agent: 'Agent Performance',
    action: 'Compression des images en cours...',
    time: 'En cours',
    status: 'running',
    icon: RefreshCw
  },
  {
    id: 4,
    agent: 'Agent Stratège',
    action: 'Nouvelle opportunité détectée: "SEO IA 2024"',
    time: 'Il y a 15 min',
    status: 'info',
    icon: Target
  }
];

const alerts = [
  {
    id: 1,
    type: 'warning',
    title: 'Core Web Vitals - LCP',
    message: 'LCP de 3.2s détecté sur /blog/article-1',
    time: 'Il y a 5 min'
  },
  {
    id: 2,
    type: 'success',
    title: 'Déploiement réussi',
    message: 'Shadow deployment validé, mise en production effectuée',
    time: 'Il y a 12 min'
  },
  {
    id: 3,
    type: 'info',
    title: 'Nouveau trend détecté',
    message: 'Mot-clé "AI SEO automation" en forte hausse (+340%)',
    time: 'Il y a 23 min'
  }
];

export default function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <span className="text-gradient">Dashboard</span>
          </h1>
          <p className={styles.subtitle}>Vue d'ensemble de votre plateforme SEO autonome</p>
        </div>
        <div className={styles.headerActions}>
          <button className="btn btn-secondary">
            <RefreshCw size={16} />
            Actualiser
          </button>
          <button className="btn btn-primary">
            <Zap size={16} />
            Lancer l'analyse
          </button>
        </div>
      </header>

      {/* Metrics Grid */}
      <section className={styles.metricsGrid}>
        {metrics.map((metric, index) => (
          <MetricCard 
            key={metric.id} 
            {...metric} 
            className={`animate-slide-up stagger-${index + 1}`}
          />
        ))}
      </section>

      {/* Main Content */}
      <div className={styles.mainGrid}>
        {/* Trend Chart */}
        <section className={`card ${styles.chartSection} animate-slide-up stagger-2`}>
          <div className="card-header">
            <div>
              <h2 className="card-title">Évolution des Positions</h2>
              <p className="card-subtitle">Performance sur les 30 derniers jours</p>
            </div>
            <div className={styles.chartLegend}>
              <span className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.primary}`} />
                Position moyenne
              </span>
              <span className={styles.legendItem}>
                <span className={`${styles.legendDot} ${styles.secondary}`} />
                Trafic organique
              </span>
            </div>
          </div>
          <TrendChart />
        </section>

        {/* Agent Activity */}
        <section className={`card ${styles.activitySection} animate-slide-up stagger-3`}>
          <div className="card-header">
            <div>
              <h2 className="card-title">Activité des Agents</h2>
              <p className="card-subtitle">Actions récentes du système multi-agents</p>
            </div>
            <button className="btn btn-ghost">Voir tout</button>
          </div>
          <AgentActivity activities={recentActivities} />
        </section>
      </div>

      {/* System Alerts */}
      <section className={`card ${styles.alertsSection} animate-slide-up stagger-4`}>
        <div className="card-header">
          <div>
            <h2 className="card-title">Alertes Système</h2>
            <p className="card-subtitle">Notifications et événements importants</p>
          </div>
          <span className="badge badge-warning">3 nouvelles</span>
        </div>
        <SystemAlerts alerts={alerts} />
      </section>
    </div>
  );
}
