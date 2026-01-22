'use client';

import { CheckCircle, RefreshCw, AlertTriangle, Info } from 'lucide-react';
import styles from './AgentActivity.module.css';

const statusConfig = {
  success: { icon: CheckCircle, color: 'success' },
  running: { icon: RefreshCw, color: 'primary', animate: true },
  warning: { icon: AlertTriangle, color: 'warning' },
  info: { icon: Info, color: 'info' },
};

export default function AgentActivity({ activities }) {
  return (
    <div className={styles.activityList}>
      {activities.map((activity, index) => {
        const Icon = activity.icon;
        const statusIcon = statusConfig[activity.status].icon;
        const StatusIcon = statusIcon;
        const statusColor = statusConfig[activity.status].color;
        const isAnimated = statusConfig[activity.status].animate;
        
        return (
          <div 
            key={activity.id} 
            className={`${styles.activityItem} animate-slide-in stagger-${index + 1}`}
          >
            <div className={`${styles.agentIcon} ${styles[statusColor]}`}>
              <Icon size={18} />
            </div>
            <div className={styles.activityContent}>
              <div className={styles.activityHeader}>
                <span className={styles.agentName}>{activity.agent}</span>
                <span className={styles.activityTime}>{activity.time}</span>
              </div>
              <p className={styles.activityAction}>{activity.action}</p>
            </div>
            <div className={`${styles.statusIcon} ${styles[statusColor]} ${isAnimated ? styles.spinning : ''}`}>
              <StatusIcon size={16} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
