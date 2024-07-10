import React, { useState, useEffect } from 'react';
import { fetchDreamStats } from '../../API/dreamsStats';
import styles from './dreamsStats.module.scss';

interface DreamStats {
  total: number;
  analyzed: number;
}

const DreamStatsComponent: React.FC = () => {
  const [dreamStats, setDreamStats] = useState<DreamStats | null>(null);
  const [memoryStats, setMemoryStats] = useState<DreamStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      const dreamData = await fetchDreamStats('сны');
      const memoryData = await fetchDreamStats('воспоминания');
      setDreamStats(dreamData);
      setMemoryStats(memoryData);
    } catch (err) {
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);
  
  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!dreamStats || !memoryStats) {
    return <div className={styles.noData}>No data available</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.stats}>
        <h3>Dreams Stats</h3>
        <p>Total: {dreamStats.total}</p>
        <p>Analyzed: {dreamStats.analyzed}</p>
      </div>
      <div className={styles.stats}>
        <h3>Memories Stats</h3>
        <p>Total: {memoryStats.total}</p>
        <p>Analyzed: {memoryStats.analyzed}</p>
      </div>
    </div>
  );
};

export default DreamStatsComponent;
