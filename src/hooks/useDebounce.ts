import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    // Gõ tiếp hoặc unmount: hủy lần hẹn cũ.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
