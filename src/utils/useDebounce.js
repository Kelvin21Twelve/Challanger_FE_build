import { useMemo, useState, useEffect } from "react";

export function useDebounce(delay = 800) {
  const [queryValue, setQueryValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(queryValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [queryValue, delay]);

  const dataToBePassed = useMemo(
    () => ({
      queryValue,
      setQueryValue,
      debouncedValue,
    }),
    [debouncedValue, queryValue],
  );

  return dataToBePassed;
}
