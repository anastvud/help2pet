import { useEffect, useState } from "react";

export default function useSitter(id) {
  const [sitter, setSitter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`http://127.0.0.1:8001/sitter/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load sitter");
        return res.json();
      })
      .then(data => setSitter(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { sitter, loading, error };
}
