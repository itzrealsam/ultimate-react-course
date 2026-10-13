import { useState, useEffect } from "react";

export function useLocalStorageState(defaultValue = "", key) {
  const [value, setValue] = useState(() => {
    try {
      const storedData = localStorage.getItem(key);
      return storedData ? JSON.parse(storedData) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key],
  );

  return [value, setValue];
}
