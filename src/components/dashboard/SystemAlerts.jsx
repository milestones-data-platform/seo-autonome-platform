'use client';

import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import styles from './SystemAlerts.module.css';

const alertConfig = {
  warning: { icon: AlertTriangle, color: 'warning' },
  success: { icon: CheckCircle, color: 'success' },
  info: { icon: Info, color: 'info' },
  error: { icon: X, color: 'error' },
};

export default function SystemAlerts({ alerts }) {
  return (
    <div className={styles.alertsGrid}>
      {alerts.map((alert, index) => {
        const Icon = alertConfig[alert.type].icon;
        const color = alertConfig[alert.type].color;
        
        return (
          <div 
            key={alert.id} 
            className={`${styles.alertItem} ${styles[color]} animate-slide-up stagger-${index + 1}`}
          >
            <div className={styles.alertIcon}>
              <Icon size={18} />
            </div>
            <div className={styles.alertContent}>
              <div className={styles.alertHeader}>
                <h4 className={styles.alertTitle}>{alert.title}</h4>
                <span className={styles.alertTime}>{alert.time}</span>
              </div>
              <p className={styles.alertMessage}>{alert.message}</p>
            </div>
            <button className={styles.dismissBtn} aria-label="Dismiss">
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
