import React, { useEffect, useState } from 'react';
import { getActivityLogs } from '../api/api';

const styles = {
  container: {
    maxWidth: '600px',
    margin: '20px auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px',
  },
  timeline: {
    position: 'relative',
    marginLeft: '20px',
    paddingLeft: '20px',
    borderLeft: '2px solid #007bff',
  },
  item: {
    position: 'relative',
    marginBottom: '30px',
  },
  bullet: {
    position: 'absolute',
    left: '-12px',
    top: '3px',
    width: '12px',
    height: '12px',
    backgroundColor: '#007bff',
    borderRadius: '50%',
    border: '2px solid white',
    zIndex: 1,
  },
  content: {
    backgroundColor: '#fff',
    padding: '12px 16px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  },
  timestamp: {
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: '4px',
    fontWeight: 600,
  },
  action: {
    fontSize: '1rem',
    color: '#222',
  },
  extraLine: {
    marginTop: '4px',
    fontStyle: 'italic',
    fontSize: '0.9rem',
    color: '#444',
  },
  performedBy: {
    fontSize: '0.85rem',
    color: '#888',
    marginTop: '4px',
  },
};

const TrackingUpdate = ({ actionType, uid }) => {
  const [logs, setLogs] = useState(null); // null = untouched, [] = empty

  useEffect(() => {
    if (!actionType || !uid) return;

    const fetchLogs = async () => {
      try {
        const response = await getActivityLogs(actionType, uid);
        if (Array.isArray(response.data) && response.data.length > 0) {
          setLogs(response.data);
        } else {
          setLogs([]); // No data
        }
      } catch (err) {
        setLogs([]); // On error, don't show anything
      }
    };

    fetchLogs();
  }, [actionType, uid]);

  // Don’t render anything if logs not loaded or empty
  if (!logs || logs.length === 0) return null;

  return (
    <div style={styles.container}>
      <div style={styles.timeline}>
        {logs.map((log) => (
          <div key={log.id} style={styles.item}>
            <span style={styles.bullet}></span>
            <div style={styles.content}>
              <div style={styles.timestamp}>
                {new Date(log.timestamp).toLocaleString()}
              </div>
              <div style={styles.action}>{log.action}</div>
              {log.extra_line && (
                <div style={styles.extraLine}>{log.extra_line}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackingUpdate;
