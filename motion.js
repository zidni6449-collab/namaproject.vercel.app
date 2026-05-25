// /api/motion.js — Vercel Serverless Proxy untuk Magnific API
// Fungsi: menerima request dari frontend, teruskan ke Magnific API
// Kenapa perlu proxy? Karena Magnific tidak izinkan CORS dari browser langsung

export default async function handler(req, res) {
  // Hanya izinkan POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { apiKey, model, prompt, orientation, cfg_scale, image, image_type, video, video_type } = req.body;

  if (!apiKey) return res.status(400).json({ error: 'API key diperlukan' });
  if (!image)  return res.status(400).json({ error: 'Reference image diperlukan' });
  if (!video)  return res.status(400).json({ error: 'Reference video diperlukan' });

  try {
    const payload = {
      model: model || 'kling-v2-6',
      prompt: prompt || '',
      character_orientation: orientation || 'video',
      cfg_scale: cfg_scale ?? 0.5,
      image: { data: image, media_type: image_type || 'image/jpeg' },
      video: { data: video, media_type: video_type || 'video/mp4' }
    };

    const response = await fetch('https://api.freepik.com/v1/ai/kling/motion-control', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-freepik-api-key': apiKey
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || data.error || 'Magnific API error' });
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
}
