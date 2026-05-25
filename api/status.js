export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const { task_id, apiKey } = req.query;
  if (!task_id || !apiKey) return res.status(400).json({ error: 'task_id dan apiKey diperlukan' });
  try {
    const response = await fetch(`https://api.freepik.com/v1/ai/kling/motion-control/${task_id}`, {
      headers: { 'x-freepik-api-key': apiKey }
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.message || 'Failed' });
    return res.status(200).json({
      status: data.data?.status || data.status || 'processing',
      video_url: data.data?.video_url || data.video_url || null,
      raw: data
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
}
