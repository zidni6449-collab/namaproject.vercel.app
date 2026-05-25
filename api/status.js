module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { task_id, apiKey } = req.query;
  if (!task_id || !apiKey) return res.status(400).json({ error: 'task_id dan apiKey diperlukan' });

  try {
    const response = await fetch(`https://api.freepik.com/v1/ai/kling/motion-control/${task_id}`, {
      headers: { 'x-freepik-api-key': apiKey }
    });

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch(e) { data = { raw: text }; }

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || text });
    }

    return res.status(200).json({
      status: data.data?.status || data.status || 'processing',
      video_url: data.data?.video_url || data.video_url || null,
      raw: data
    });

  } catch (err) {
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
};
