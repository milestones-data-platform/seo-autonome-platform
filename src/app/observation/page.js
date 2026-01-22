'use client';

import { 
  Radar, 
  Search, 
  TrendingUp, 
  FileText, 
  Activity,
  Globe,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import styles from './page.module.css';

// Mock SERP data
const serpData = [
  { keyword: 'SEO automation tools', position: 3, change: 2, volume: 12400, difficulty: 68 },
  { keyword: 'AI SEO platform', position: 5, change: -1, volume: 8900, difficulty: 72 },
  { keyword: 'automated seo software', position: 7, change: 0, volume: 6200, difficulty: 54 },
  { keyword: 'seo artificial intelligence', position: 4, change: 3, volume: 5100, difficulty: 61 },
  { keyword: 'autonomous seo system', position: 2, change: 1, volume: 3400, difficulty: 45 },
];

// Mock trending keywords
const trendingKeywords = [
  { keyword: 'AI content optimization', growth: 340, category: 'Émergent' },
  { keyword: 'semantic SEO 2024', growth: 210, category: 'Tendance' },
  { keyword: 'automated link building', growth: 180, category: 'Stable' },
  { keyword: 'search intent AI', growth: 420, category: 'Viral' },
  { keyword: 'real-time seo', growth: 150, category: 'Tendance' },
];

// Mock crawler status
const crawlerStats = {
  pagesScanned: 1247,
  totalPages: 1530,
  lastScan: '10 min',
  avgLoadTime: 1.8,
  coreWebVitals: {
    lcp: { value: 2.1, status: 'good' },
    fid: { value: 45, status: 'good' },
    cls: { value: 0.08, status: 'warning' },
  }
};

// Bot logs
const botLogs = [
  { time: '14:32:15', bot: 'Googlebot', pages: 23, status: 'success' },
  { time: '14:28:42', bot: 'Bingbot', pages: 8, status: 'success' },
  { time: '14:25:11', bot: 'Googlebot-Image', pages: 45, status: 'success' },
  { time: '14:20:33', bot: 'Googlebot', pages: 31, status: 'warning' },
  { time: '14:15:08', bot: 'GPTBot', pages: 12, status: 'blocked' },
];

export default function ObservationPage() {
  const progress = (crawlerStats.pagesScanned / crawlerStats.totalPages) * 100;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <Radar className={styles.titleIcon} size={32} />
            <span className="text-gradient">Observation</span>
          </h1>
          <p className={styles.subtitle}>Couche d'ingestion des données - Monitoring en temps réel</p>
        </div>
      </header>

      <div className={styles.grid}>
        {/* Crawler Status Panel */}
        <section className={`card ${styles.crawlerPanel} animate-slide-up`}>
          <div className="card-header">
            <div>
              <h2 className="card-title">🔍 Audit Interne</h2>
              <p className="card-subtitle">Crawler haute fréquence</p>
            </div>
            <span className="badge badge-success">
              <Activity size={12} />
              Actif
            </span>
          </div>
          
          <div className={styles.crawlerStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Pages scannées</span>
              <span className={styles.statValue}>{crawlerStats.pagesScanned.toLocaleString()}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total pages</span>
              <span className={styles.statValue}>{crawlerStats.totalPages.toLocaleString()}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Dernier scan</span>
              <span className={styles.statValue}>{crawlerStats.lastScan}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Temps moyen</span>
              <span className={styles.statValue}>{crawlerStats.avgLoadTime}s</span>
            </div>
          </div>

          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span>Progression du scan</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className={styles.vitalsSection}>
            <h3 className={styles.sectionTitle}>Core Web Vitals</h3>
            <div className={styles.vitalsGrid}>
              {Object.entries(crawlerStats.coreWebVitals).map(([key, data]) => (
                <div key={key} className={`${styles.vitalCard} ${styles[data.status]}`}>
                  <span className={styles.vitalLabel}>{key.toUpperCase()}</span>
                  <span className={styles.vitalValue}>
                    {data.value}{key === 'cls' ? '' : key === 'fid' ? 'ms' : 's'}
                  </span>
                  <span className={`badge badge-${data.status === 'good' ? 'success' : 'warning'}`}>
                    {data.status === 'good' ? 'Bon' : 'À améliorer'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERP Monitor */}
        <section className={`card ${styles.serpPanel} animate-slide-up stagger-2`}>
          <div className="card-header">
            <div>
              <h2 className="card-title">📊 Monitoring SERP</h2>
              <p className="card-subtitle">Suivi des positions Google</p>
            </div>
            <button className="btn btn-secondary">
              <Globe size={14} />
              Actualiser
            </button>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Mot-clé</th>
                  <th>Position</th>
                  <th>Évolution</th>
                  <th>Volume</th>
                  <th>Difficulté</th>
                </tr>
              </thead>
              <tbody>
                {serpData.map((item, index) => (
                  <tr key={index}>
                    <td className={styles.keywordCell}>{item.keyword}</td>
                    <td>
                      <span className={styles.positionBadge}>{item.position}</span>
                    </td>
                    <td>
                      <span className={`${styles.changeIndicator} ${
                        item.change > 0 ? styles.up : item.change < 0 ? styles.down : styles.neutral
                      }`}>
                        {item.change > 0 ? <ArrowUp size={14} /> : 
                         item.change < 0 ? <ArrowDown size={14} /> : 
                         <Minus size={14} />}
                        {Math.abs(item.change)}
                      </span>
                    </td>
                    <td>{item.volume.toLocaleString()}</td>
                    <td>
                      <div className={styles.difficultyBar}>
                        <div 
                          className={styles.difficultyFill} 
                          style={{ width: `${item.difficulty}%` }}
                        />
                        <span>{item.difficulty}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Trend Engine */}
        <section className={`card ${styles.trendPanel} animate-slide-up stagger-3`}>
          <div className="card-header">
            <div>
              <h2 className="card-title">🔥 Trend Engine</h2>
              <p className="card-subtitle">Mots-clés émergents en temps réel</p>
            </div>
          </div>

          <div className={styles.trendList}>
            {trendingKeywords.map((item, index) => (
              <div key={index} className={styles.trendItem}>
                <div className={styles.trendRank}>#{index + 1}</div>
                <div className={styles.trendContent}>
                  <span className={styles.trendKeyword}>{item.keyword}</span>
                  <span className={`badge ${
                    item.category === 'Viral' ? 'badge-error' :
                    item.category === 'Émergent' ? 'badge-warning' :
                    item.category === 'Tendance' ? 'badge-primary' : 'badge-info'
                  }`}>
                    {item.category}
                  </span>
                </div>
                <div className={styles.trendGrowth}>
                  <TrendingUp size={16} className={styles.growthIcon} />
                  +{item.growth}%
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Log Analysis */}
        <section className={`card ${styles.logPanel} animate-slide-up stagger-4`}>
          <div className="card-header">
            <div>
              <h2 className="card-title">📋 Analyse des Logs</h2>
              <p className="card-subtitle">Activité des bots sur le site</p>
            </div>
          </div>

          <div className={styles.logList}>
            {botLogs.map((log, index) => (
              <div key={index} className={styles.logItem}>
                <div className={styles.logTime}>
                  <Clock size={14} />
                  {log.time}
                </div>
                <div className={styles.logBot}>{log.bot}</div>
                <div className={styles.logPages}>{log.pages} pages</div>
                <span className={`badge ${
                  log.status === 'success' ? 'badge-success' :
                  log.status === 'warning' ? 'badge-warning' : 'badge-error'
                }`}>
                  {log.status === 'success' ? <CheckCircle size={12} /> :
                   log.status === 'warning' ? <AlertTriangle size={12} /> : '🚫'}
                  {log.status === 'blocked' ? 'Bloqué' : log.status === 'warning' ? 'Lent' : 'OK'}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
