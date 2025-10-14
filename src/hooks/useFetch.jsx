import { useState, useCallback } from "react";

/**
 * Custom React hook for GET, POST, DELETE requests.
 * Automatically handles loading and error state.
 */
export default function useFetch(baseUrl = "", nonce = "") {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (endpoint, options = {}) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            ...(nonce && { "X-WP-Nonce": nonce }),
            ...options.headers,
          },
          ...options,
        });

        if (!response.ok) {
          throw new Error(`Fetch error: ${response.status}`);
        }

        const data = await response.json();
        return data;
      } catch (err) {
        console.error("useFetch error:", err);
        setError(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [baseUrl, nonce]
  );

  const get = useCallback(
    (endpoint) => fetchData(endpoint, { method: "GET" }),
    [fetchData]
  );

  const post = useCallback(
    (endpoint, body) =>
      fetchData(endpoint, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    [fetchData]
  );

  const del = useCallback(
    (endpoint) => fetchData(endpoint, { method: "DELETE" }),
    [fetchData]
  );

  return { get, post, del, loading, error };
}
