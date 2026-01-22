'use client';

import { 
  Globe,
  Server,
  Zap,
  Activity,
  Clock,
  CheckCircle,
  MapPin,
  Layers,
  RefreshCw,
  Settings
} from 'lucide-react';
import styles from './page.module.css';

const edgeLocations = [
  { id: 1, name: 'Paris, France', region: 'EU', status: 'healthy', latency: 12, requests: '2.3M' },
  { id: 2, name: 'New York, USA', region: 'US', status: 'healthy', latency: 18, requests: '1.8M' },
  { id: 3, name: 'Tokyo, Japan', region: 'APAC', status: 'healthy', latency: 45, requests: '890K' },
  { id: 4, name: 'São Paulo, Brazil', region: 'LATAM', status: 'degraded', latency: 78, requests: '420K' },
  { id: 5, name: 'Sydney, Australia', region: 'APAC', status: 'healthy', latency: 52, requests: '310K' },
];

const edgeFunctions = [
  { name: 'seo-meta-injector', invocations: '45.2K', avgDuration: '2.3ms', status: 'active' },
  { name: 'dynamic-og-generator', invocations: '23.1K', avgDuration: '8.7ms', status: 'active' },
  { name: 'bot-detector', invocations: '156K', avgDuration: '0.8ms', status: 'active' },
  { name: 'redirect-handler', invocations: '12.4K', avgDuration: '1.2ms', status: 'inactive' },
];

const isrPages = [
  { path: '/', revalidate: 60, lastRegenerated: '2 min ago', status: 'fresh' },
  { path: '/blog/*', revalidate: 300, lastRegenerated: '5 min ago', status: 'fresh' },
  { path: '/products/*', revalidate: 3600, lastRegenerated: '45 min ago', status: 'stale' },
  { path: '/docs/*', revalidate: 86400, lastRegenerated: '12h ago', status: 'fresh' },
];

export default function EdgePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <Globe className={styles.titleIcon} size={32} />
            <span className="text-gradient">Edge Infrastructure</span>
          </h1>
          <p className={styles.subtitle}>Infrastructure de livraison - Edge Computing & CDN mondial</p>
        </div>
      </header>

      {/* Edge Map / Locations */}
      <section className={`card ${styles.mapSection} animate-slide-up`}>
        <div className="card-header">
          <div>
            <h2 className="card-title">🌍 Points de Présence CDN</h2>
            <p className="card-subtitle">Statut global des edge locations</p>
          </div>
          <div className={styles.statusSummary}>
            <span className="badge badge-success">4 opérationnels</span>
            <span className="badge badge-warning">1 dégradé</span>
          </div>
        </div>

        <div className={styles.locationsGrid}>
          {edgeLocations.map((loc) => (
            <div key={loc.id} className={`${styles.locationCard} ${styles[loc.status]}`}>
              <div className={styles.locationHeader}>
                <MapPin size={16} />
                <span className={styles.locationName}>{loc.name}</span>
                <span className={`status-dot ${loc.status === 'healthy' ? 'active' : 'warning'}`} />
              </div>
              <div className={styles.locationStats}>
                <div className={styles.locationStat}>
                  <Zap size={14} />
                  <span>{loc.latency}ms</span>
                </div>
                <div className={styles.locationStat}>
                  <Activity size={14} />
                  <span>{loc.requests}</span>
                </div>
              </div>
              <span className={`badge ${loc.region === 'EU' ? 'badge-primary' : 
                loc.region === 'US' ? 'badge-info' : 
                loc.region === 'APAC' ? 'badge-warning' : 'badge-success'}`}>
                {loc.region}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.bottomGrid}>
        {/* Edge Functions */}
        <section className={`card ${styles.functionsSection} animate-slide-up stagger-2`}>
          <div className="card-header">
            <div>
              <h2 className="card-title">⚡ Edge Functions</h2>
              <p className="card-subtitle">Fonctions SEO exécutées à la périphérie</p>
            </div>
            <button className="btn btn-secondary">
              <Settings size={14} />
              Gérer
            </button>
          </div>

          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Fonction</th>
                  <th>Invocations (24h)</th>
                  <th>Durée moy.</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {edgeFunctions.map((fn, index) => (
                  <tr key={index}>
                    <td>
                      <code className={styles.functionName}>{fn.name}</code>
                    </td>
                    <td>{fn.invocations}</td>
                    <td>{fn.avgDuration}</td>
                    <td>
                      <span className={`badge ${fn.status === 'active' ? 'badge-success' : 'badge-info'}`}>
                        {fn.status === 'active' ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ISR Configuration */}
        <section className={`card ${styles.isrSection} animate-slide-up stagger-3`}>
          <div className="card-header">
            <div>
              <h2 className="card-title">🔄 ISR Configuration</h2>
              <p className="card-subtitle">Incremental Static Regeneration</p>
            </div>
            <button className="btn btn-ghost">
              <RefreshCw size={14} />
              Forcer régénération
            </button>
          </div>

          <div className={styles.isrList}>
            {isrPages.map((page, index) => (
              <div key={index} className={styles.isrItem}>
                <div className={styles.isrPath}>
                  <Layers size={16} />
                  <code>{page.path}</code>
                </div>
                <div className={styles.isrConfig}>
                  <div className={styles.isrStat}>
                    <Clock size={14} />
                    <span>Revalidate: {page.revalidate}s</span>
                  </div>
                  <div className={styles.isrStat}>
                    <RefreshCw size={14} />
                    <span>{page.lastRegenerated}</span>
                  </div>
                </div>
                <span className={`badge ${page.status === 'fresh' ? 'badge-success' : 'badge-warning'}`}>
                  {page.status === 'fresh' ? 'Fresh' : 'Stale'}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
