# SEO Autonome Platform - Documentation Technique Complète

## Table des Matières
1. [Stack Technique](#stack-technique)
2. [Architecture des Fichiers](#architecture-des-fichiers)
3. [Design System](#design-system)
4. [Composants Layout](#composants-layout)
5. [Pages de l'Application](#pages-de-lapplication)
6. [Composants Réutilisables](#composants-réutilisables)
7. [Patterns de Code](#patterns-de-code)

---

## Stack Technique

| Technologie | Version | Rôle |
|-------------|---------|------|
| **Next.js** | 16.1.4 | Framework React avec App Router |
| **React** | 19.x | Bibliothèque UI |
| **Recharts** | latest | Graphiques et visualisations |
| **Lucide React** | latest | Icônes SVG |
| **Vanilla CSS** | - | Styling avec CSS Modules |

### Pourquoi ces choix ?

```
Next.js App Router
├── Server Components par défaut (performance)
├── Routing basé sur les dossiers
├── Optimisation automatique des images/fonts
└── Support natif des CSS Modules

Vanilla CSS (au lieu de Tailwind)
├── Contrôle total sur le design system
├── Pas de dépendance externe
├── Custom properties CSS (variables)
└── Module scoping natif
```

---

## Architecture des Fichiers

```
app_public_seo/
├── src/
│   ├── app/                          # App Router (pages)
│   │   ├── globals.css               # Design system global
│   │   ├── layout.js                 # Layout racine
│   │   ├── page.js                   # Dashboard (/)
│   │   ├── page.module.css           # Styles dashboard
│   │   │
│   │   ├── observation/              # Couche 1: Data Ingestion
│   │   │   ├── page.js
│   │   │   └── page.module.css
│   │   │
│   │   ├── agents/                   # Couche 2: Multi-Agent System
│   │   │   ├── page.js
│   │   │   └── page.module.css
│   │   │
│   │   ├── reconstruction/           # Couche 3: Content Factory
│   │   │   ├── page.js
│   │   │   └── page.module.css
│   │   │
│   │   ├── edge/                     # Couche 4: Infrastructure
│   │   │   ├── page.js
│   │   │   └── page.module.css
│   │   │
│   │   └── validation/               # Couche 5: QA & Safety
│   │       ├── page.js
│   │       └── page.module.css
│   │
│   └── components/                   # Composants réutilisables
│       ├── layout/
│       │   ├── Sidebar.jsx           # Navigation latérale
│       │   └── Sidebar.module.css
│       │
│       └── dashboard/
│           ├── MetricCard.jsx        # Carte métrique avec gauge
│           ├── MetricCard.module.css
│           ├── TrendChart.jsx        # Graphique Recharts
│           ├── TrendChart.module.css
│           ├── AgentActivity.jsx     # Feed d'activité
│           ├── AgentActivity.module.css
│           ├── SystemAlerts.jsx      # Alertes système
│           └── SystemAlerts.module.css
│
├── package.json
└── next.config.js
```

---

## Design System

### Fichier: `src/app/globals.css`

Le design system utilise des **CSS Custom Properties** (variables) pour garantir la cohérence.

### Palette de Couleurs

```css
:root {
  /* Backgrounds - Thème Dark */
  --bg-primary: #0a0a0f;      /* Fond principal */
  --bg-secondary: #12121a;    /* Sidebar, cards */
  --bg-tertiary: #1a1a24;     /* Elements internes */
  --bg-elevated: #22222e;     /* Hover states */
  --bg-card: rgba(30, 30, 42, 0.7);  /* Glassmorphism */

  /* Accents - Gradient Cyan/Violet */
  --accent-primary: #00d4ff;           /* Cyan */
  --accent-primary-dim: rgba(0, 212, 255, 0.15);
  --accent-secondary: #8b5cf6;         /* Violet */
  --accent-gradient: linear-gradient(135deg, #00d4ff 0%, #8b5cf6 100%);

  /* Sémantiques */
  --success: #10b981;   /* Vert */
  --warning: #f59e0b;   /* Orange */
  --error: #ef4444;     /* Rouge */
  --info: #3b82f6;      /* Bleu */
}
```

### Système de Spacing

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
}
```

### Animations Clés

```css
/* Pulse pour les indicateurs de statut */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Glow pour les éléments actifs */
@keyframes glow {
  0%, 100% { box-shadow: 0 0 5px rgba(0, 212, 255, 0.5); }
  50% { box-shadow: 0 0 20px rgba(0, 212, 255, 0.8); }
}

/* Slide-up pour les entrées */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Classes Utilitaires Globales

```css
/* Texte avec gradient */
.text-gradient {
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Effet glassmorphism */
.glass {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-primary);
}

/* Cards standards */
.card {
  background: var(--bg-card);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

/* Badges de statut */
.badge-success { background: var(--success-dim); color: var(--success); }
.badge-warning { background: var(--warning-dim); color: var(--warning); }
.badge-error { background: var(--error-dim); color: var(--error); }
```

---

## Composants Layout

### Layout Racine: `src/app/layout.js`

```jsx
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="app-layout">
          <Sidebar />                    {/* Navigation fixe à gauche */}
          <main className="main-content"> {/* Contenu scrollable */}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
```

**Layout CSS:**
```css
.app-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);  /* 260px */
  padding: var(--space-8);
}
```

### Sidebar: `src/components/layout/Sidebar.jsx`

**Structure:**
```
Sidebar (260px, position: fixed)
├── Logo Section
│   ├── Logo Icon (gradient background)
│   └── Logo Text ("SEO Autonome")
│
├── Navigation
│   ├── Nav Label ("Navigation")
│   └── Nav Items (6 liens)
│       ├── Dashboard
│       ├── Observation
│       ├── Agents IA
│       ├── Reconstruction
│       ├── Edge
│       └── Validation
│
└── Footer
    ├── Paramètres
    ├── Aide
    └── Status Card ("Système actif")
```

**Pattern de Navigation Active:**
```jsx
'use client';  // Nécessaire pour usePathname

import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/observation', icon: Radar, label: 'Observation' },
  // ...
];

export default function Sidebar() {
  const pathname = usePathname();
  
  return (
    <nav>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            {/* ... */}
          </Link>
        );
      })}
    </nav>
  );
}
```

---

## Pages de l'Application

### Page 1: Dashboard (`/`)

**Fichier:** `src/app/page.js`

**Structure:**
```
Dashboard Page
├── Header
│   ├── Title ("Dashboard" avec gradient)
│   ├── Subtitle
│   └── Actions (Actualiser, Lancer l'analyse)
│
├── Metrics Grid (4 colonnes)
│   ├── MetricCard (SEO Score - gauge)
│   ├── MetricCard (Position Moyenne)
│   ├── MetricCard (Core Web Vitals)
│   └── MetricCard (Trafic Organique)
│
├── Main Grid (2 colonnes: 2fr 1fr)
│   ├── TrendChart (graphique Recharts)
│   └── AgentActivity (feed)
│
└── SystemAlerts (3 colonnes)
```

**Données Mock:**
```javascript
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
    gauge: true  // Affiche une jauge circulaire
  },
  // ...
];
```

### Page 2: Observation (`/observation`)

**Fichier:** `src/app/observation/page.js`

**Structure:**
```
Observation Page (Grid 2x2)
├── Crawler Panel
│   ├── Stats (pages scannées, total, dernier scan)
│   ├── Progress Bar (progression du scan)
│   └── Core Web Vitals (LCP, FID, CLS)
│
├── SERP Monitor
│   └── Table (mot-clé, position, évolution, volume, difficulté)
│
├── Trend Engine
│   └── List (keywords trending avec % croissance)
│
└── Log Analysis
    └── List (activité bots: Googlebot, Bingbot)
```

### Page 3: Agents IA (`/agents`)

**Structure:**
```
Agents Page
├── Agent Cards Grid (4 colonnes)
│   ├── Agent Sémantique (primary color)
│   ├── Agent Technique (secondary color)
│   ├── Agent Performance (warning color)
│   └── Agent Stratège (info color)
│
└── Bottom Grid (2 colonnes)
    ├── Workflow Diagram (5 étapes avec timeline)
    └── Recent Decisions (approuvé/rejeté/en attente)
```

**Pattern Agent Card:**
```jsx
const agents = [
  {
    id: 'semantic',
    name: 'Agent Sémantique',
    description: 'Analyse l\'intention de recherche...',
    icon: Brain,
    status: 'active',      // active | running | idle
    color: 'primary',      // Style CSS
    stats: {
      actionsToday: 47,
      successRate: 98.2,
      avgResponseTime: '1.2s'
    },
    lastAction: 'Optimisation des meta descriptions...'
  }
];
```

### Page 4: Reconstruction (`/reconstruction`)

**Structure:**
```
Reconstruction Page
├── Pending Changes
│   └── List (modifications en attente + actions)
│
├── Content Editor
│   ├── Tab Bar (Contenu | Code | Schema)
│   └── Comparison Grid (Original vs Optimisé)
│
└── Shadow Deployment
    └── List (preview URLs + status + score)
```

### Page 5: Edge (`/edge`)

**Structure:**
```
Edge Page
├── CDN Locations Grid (5 colonnes)
│   └── Location Cards (Paris, NY, Tokyo, etc.)
│
└── Bottom Grid (2 colonnes)
    ├── Edge Functions Table
    └── ISR Configuration List
```

### Page 6: Validation (`/validation`)

**Structure:**
```
Validation Page
├── Top Grid (2 colonnes)
│   ├── SEO Score Validator
│   │   ├── Main Score Circle (SVG)
│   │   └── Sub Scores (Performance, Accessibilité, etc.)
│   │
│   └── Semantic Guardrails
│       └── Checks List (passed | warning | failed)
│
└── Bottom Grid (2 colonnes)
    ├── A/B Testing
    │   └── Test Cards (control vs variant)
    │
    └── Rollback Control
        └── History List
```

---

## Composants Réutilisables

### MetricCard

**Fichier:** `src/components/dashboard/MetricCard.jsx`

**Props:**
```typescript
interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  change: number;        // % de changement
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: 'primary' | 'success' | 'warning' | 'info';
  gauge?: boolean;       // Afficher jauge circulaire
}
```

**Jauge SVG Animée:**
```jsx
// Calcul du cercle SVG
const radius = 45;
const circumference = 2 * Math.PI * radius;  // ~283
const strokeDashoffset = circumference - (value / 100) * circumference;

<svg viewBox="0 0 100 100">
  <circle
    className={styles.gaugeBg}
    cx="50" cy="50" r={radius}
  />
  <circle
    className={styles.gaugeFill}
    cx="50" cy="50" r={radius}
    strokeDasharray={circumference}
    strokeDashoffset={strokeDashoffset}  // Anime le remplissage
  />
</svg>
```

### TrendChart

**Fichier:** `src/components/dashboard/TrendChart.jsx`

**Utilisation de Recharts:**
```jsx
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function TrendChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          {/* Gradient pour le remplissage */}
          <linearGradient id="colorPosition" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
          </linearGradient>
        </defs>
        
        {/* Deux axes Y: position (gauche, inversé) et trafic (droite) */}
        <YAxis yAxisId="left" reversed domain={[0, 10]} />
        <YAxis yAxisId="right" orientation="right" />
        
        {/* Deux courbes */}
        <Area yAxisId="left" dataKey="position" stroke="#00d4ff" fill="url(#colorPosition)" />
        <Area yAxisId="right" dataKey="traffic" stroke="#8b5cf6" fill="url(#colorTraffic)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
```

---

## Patterns de Code

### 1. Pattern "Client Component"

```jsx
'use client';  // OBLIGATOIRE en haut du fichier

// Permet d'utiliser:
// - useState, useEffect
// - usePathname, useRouter (next/navigation)
// - Événements onClick, onChange, etc.
```

### 2. Pattern "CSS Modules"

```jsx
// Import du module CSS
import styles from './Component.module.css';

// Utilisation
<div className={styles.container}>
  <h1 className={`${styles.title} ${isActive ? styles.active : ''}`}>
    Titre
  </h1>
</div>

// Combinaison avec classes globales
<div className={`card ${styles.customCard}`}>
  Contenu
</div>
```

### 3. Pattern "Staggered Animation"

```jsx
// Animations décalées pour liste d'éléments
{items.map((item, index) => (
  <div 
    key={item.id} 
    className={`${styles.item} animate-slide-up stagger-${index + 1}`}
  >
    {/* Chaque élément apparaît avec 100ms de délai */}
  </div>
))}
```

```css
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
```

### 4. Pattern "Status Dot avec Ping"

```css
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: relative;
}

.status-dot::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  animation: ping 1.5s infinite;  /* Effet de pulsation */
}

.status-dot.active {
  background: var(--success);
}
```

### 5. Pattern "Responsive Grid"

```css
/* 4 colonnes par défaut */
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
}

/* 2 colonnes sur tablette */
@media (max-width: 1200px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 1 colonne sur mobile */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

---

## Commandes

```bash
# Installation
npm install

# Développement
npm run dev

# Build production
npm run build

# Lancer en production
npm start
```

---

## Résumé Visuel

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌──────────┐  ┌──────────────────────────────────────────┐ │
│  │          │  │                                          │ │
│  │  SIDEBAR │  │              MAIN CONTENT                │ │
│  │  (fixed) │  │                                          │ │
│  │          │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐     │ │
│  │  Logo    │  │  │ Metric  │ │ Metric  │ │ Metric  │     │ │
│  │          │  │  │  Card   │ │  Card   │ │  Card   │     │ │
│  │  Nav     │  │  └─────────┘ └─────────┘ └─────────┘     │ │
│  │  Items   │  │                                          │ │
│  │          │  │  ┌────────────────────┐ ┌──────────────┐ │ │
│  │          │  │  │                    │ │              │ │ │
│  │          │  │  │    TrendChart      │ │   Activity   │ │ │
│  │          │  │  │    (Recharts)      │ │    Feed      │ │ │
│  │          │  │  │                    │ │              │ │ │
│  │  Footer  │  │  └────────────────────┘ └──────────────┘ │ │
│  │          │  │                                          │ │
│  └──────────┘  └──────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
