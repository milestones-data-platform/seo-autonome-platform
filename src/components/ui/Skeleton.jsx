import styles from './Skeleton.module.css';

/**
 * Skeleton loading component
 * Displays placeholder content while data is loading
 */
export function Skeleton({ width, height, variant = 'rectangular', className = '' }) {
  return (
    <div 
      className={`${styles.skeleton} ${styles[variant]} ${className}`}
      style={{ 
        width: width || '100%', 
        height: height || '1rem' 
      }}
    />
  );
}

/**
 * Card skeleton for metric cards
 */
export function CardSkeleton() {
  return (
    <div className={styles.cardSkeleton}>
      <div className={styles.cardHeader}>
        <Skeleton width={40} height={40} variant="rounded" />
        <Skeleton width={60} height={20} variant="rounded" />
      </div>
      <Skeleton width="60%" height={32} />
      <Skeleton width="80%" height={16} />
    </div>
  );
}

/**
 * Table row skeleton
 */
export function TableRowSkeleton({ columns = 4 }) {
  return (
    <tr className={styles.tableRow}>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i}>
          <Skeleton width={i === 0 ? '80%' : '60%'} height={16} />
        </td>
      ))}
    </tr>
  );
}

/**
 * Proposal card skeleton
 */
export function ProposalSkeleton() {
  return (
    <div className={styles.proposalSkeleton}>
      <div className={styles.proposalHeader}>
        <Skeleton width={120} height={24} variant="rounded" />
        <Skeleton width={80} height={24} variant="rounded" />
      </div>
      <Skeleton width="40%" height={16} />
      <div className={styles.proposalDiff}>
        <Skeleton height={80} />
        <Skeleton height={80} />
      </div>
      <Skeleton width="90%" height={48} />
      <div className={styles.proposalActions}>
        <Skeleton width={100} height={36} variant="rounded" />
        <Skeleton width={100} height={36} variant="rounded" />
      </div>
    </div>
  );
}

export default Skeleton;
