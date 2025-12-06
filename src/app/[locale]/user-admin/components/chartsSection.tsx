'use client';
import { useState, useEffect } from 'react';
import { adminAPI } from '../lib/api';
import styles from '../styles/admin.module.css';

interface ChartData {
  _id: { hour?: number; year?: number; month?: number; day?: number };
  count: number;
}

export default function ChartsSection() {
  const [startChartData, setStartChartData] = useState<ChartData[]>([]);
  const [endChartData, setEndChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0], // Hoy
    end: new Date().toISOString().split('T')[0], // Hoy
  });

  // Carga inicial. Se desactiva exhaustiveness porque `loadCharts` está definida abajo

  useEffect(() => {
    loadCharts();
  }, []);

  const loadCharts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;

      setLoading(true);

      // Cargar ambos gráficos en paralelo
      const [startData, endData] = await Promise.all([
        adminAPI.getSessionStartChart(token, dateRange.start, dateRange.end),
        adminAPI.getSessionEndChart(token, dateRange.start, dateRange.end),
      ]);

      if (startData.success) setStartChartData(startData.data);
      if (endData.success) setEndChartData(endData.data);
    } catch (error) {
      console.error('Error loading charts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatChartLabel = (item: ChartData) => {
    if (item._id.hour !== undefined) {
      return `${item._id.hour}:00`;
    } else {
      return `${item._id.day}/${item._id.month}/${item._id.year}`;
    }
  };

  return (
    <div className={styles.chartsSection}>
      <div className={styles.chartsHeader}>
        <h3>📈 Gráficos de Sesiones</h3>
        <div className={styles.dateControls}>
          <input
            type='date'
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
          />
          <span>a</span>
          <input
            type='date'
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
          />
          <button onClick={loadCharts}>Actualizar</button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Cargando gráficos...</div>
      ) : (
        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <h4>Inicios de Sesión</h4>
            <div className={styles.chartData}>
              {startChartData.length > 0 ? (
                startChartData.map((item, index) => (
                  <div key={index} className={styles.chartBar}>
                    <div className={styles.barLabel}>{formatChartLabel(item)}</div>
                    <div
                      className={styles.barValue}
                      style={{ width: `${Math.min(item.count * 5, 100)}%` }}
                    >
                      <span>{item.count}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No hay datos para este rango</p>
              )}
            </div>
            <div className={styles.chartStats}>
              <span>Total: {startChartData.reduce((sum, item) => sum + item.count, 0)}</span>
            </div>
          </div>

          <div className={styles.chartCard}>
            <h4>Cierres de Sesión</h4>
            <div className={styles.chartData}>
              {endChartData.length > 0 ? (
                endChartData.map((item, index) => (
                  <div key={index} className={styles.chartBar}>
                    <div className={styles.barLabel}>{formatChartLabel(item)}</div>
                    <div
                      className={styles.barValue}
                      style={{ width: `${Math.min(item.count * 5, 100)}%` }}
                    >
                      <span>{item.count}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p>No hay datos para este rango</p>
              )}
            </div>
            <div className={styles.chartStats}>
              <span>Total: {endChartData.reduce((sum, item) => sum + item.count, 0)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
