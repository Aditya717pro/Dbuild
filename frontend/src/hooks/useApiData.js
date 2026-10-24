import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api.js';

export function useApiData(path, { enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(Boolean(enabled && path));
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!path) return;
    setLoading(true);
    setError('');
    try {
      const result = await api.get(path);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    if (enabled && path) {
      load();
    } else {
      setLoading(false);
    }
  }, [enabled, path, load]);

  return { data, loading, error, reload: load, setData };
}
