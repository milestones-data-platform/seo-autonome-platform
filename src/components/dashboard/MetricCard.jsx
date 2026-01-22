'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import styles from './MetricCard.module.css';

export default function MetricCard({ 
  title, 
  value, 
  unit = '', 
  change, 
  trend, 
  icon: Icon, 
  color = 'primary',
  gauge = false,
  className = '' 
}) {
  const isPositive = trend === 'up';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  
  // Calculate gauge stroke for circular progress
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className={`${styles.card} ${styles[color]} ${className}`}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Icon size={20} />
        </div>
        <div className={`${styles.trend} ${isPositive ? styles.positive : styles.negative}`}>
          <TrendIcon size={14} />
          <span>{Math.abs(change)}%</span>
        </div>
      </div>

      <div className={styles.content}>
        {gauge ? (
          <div className={styles.gaugeContainer}>
            <svg className={styles.gauge} viewBox="0 0 100 100">
              <defs>
                <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--accent-primary)" />
                  <stop offset="100%" stopColor="var(--accent-secondary)" />
                </linearGradient>
              </defs>
              <circle
                className={styles.gaugeBg}
                cx="50"
                cy="50"
                r={radius}
              />
              <circle
                className={styles.gaugeFill}
                cx="50"
                cy="50"
                r={radius}
                stroke={`url(#gradient-${color})`}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <div className={styles.gaugeValue}>
              <span className={styles.value}>{value}</span>
              <span className={styles.unit}>{unit}</span>
            </div>
          </div>
        ) : (
          <div className={styles.valueContainer}>
            <span className={styles.value}>{value}</span>
            <span className={styles.unit}>{unit}</span>
          </div>
        )}
        <h3 className={styles.title}>{title}</h3>
      </div>

      <div className={styles.glow} />
    </div>
  );
}
