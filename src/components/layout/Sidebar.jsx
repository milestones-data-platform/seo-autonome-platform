'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Radar, 
  Bot, 
  Hammer, 
  Globe, 
  ShieldCheck,
  Zap,
  Settings,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import styles from './Sidebar.module.css';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard', description: 'Vue d\'ensemble' },
  { href: '/observation', icon: Radar, label: 'Observation', description: 'Data Ingestion' },
  { href: '/agents', icon: Bot, label: 'Agents IA', description: 'Multi-Agent System' },
  { href: '/reconstruction', icon: Hammer, label: 'Reconstruction', description: 'Content Factory' },
  { href: '/edge', icon: Globe, label: 'Edge', description: 'Infrastructure' },
  { href: '/validation', icon: ShieldCheck, label: 'Validation', description: 'QA & Safety' },
];

const bottomItems = [
  { href: '/tutorial', icon: BookOpen, label: 'Tutoriel' },
  { href: '/settings', icon: Settings, label: 'Paramètres' },
  { href: '/help', icon: HelpCircle, label: 'Aide' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <Zap size={24} />
        </div>
        <div className={styles.logoText}>
          <span className={styles.logoTitle}>SEO Autonome</span>
          <span className={styles.logoSubtitle}>Platform v1.0</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navSection}>
          <span className={styles.navLabel}>Navigation</span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
              >
                <div className={styles.navIcon}>
                  <Icon size={20} />
                </div>
                <div className={styles.navContent}>
                  <span className={styles.navTitle}>{item.label}</span>
                  <span className={styles.navDescription}>{item.description}</span>
                </div>
                {isActive && <div className={styles.activeIndicator} />}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className={styles.footer}>
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={styles.footerItem}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        
        <div className={styles.statusCard}>
          <div className={styles.statusHeader}>
            <span className={`status-dot active`} />
            <span>Système actif</span>
          </div>
          <p className={styles.statusText}>
            Tous les agents fonctionnent normalement
          </p>
        </div>
      </div>
    </aside>
  );
}
