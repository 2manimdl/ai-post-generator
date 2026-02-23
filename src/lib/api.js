// src/lib/api.js
export const callAPI = async (payload, setLoading) => {
  if (setLoading) setLoading(true);
  try {
    const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    if(data.error) throw new Error(data.error);
    return data;
  } catch (e) {
    alert("Error: " + e.message);
    return null;
  } finally {
    if (setLoading) setLoading(false);
  }
};