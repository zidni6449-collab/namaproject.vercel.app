const https = require('https');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { apiKey, model, prompt, orientation, cfg_scale, image, image_type, video, video_type } = req.body;
  if (!apiKey) return res.status(400).json({ error: 'API key diperlukan' });

  // Cek ukuran
  const imgSize = image ? Buffer.byteLength(image, 'base64') : 0;
  const vidSize = video ? Buffer.byteLength(video, 'base64') : 0;
  const totalMB = (imgSize + vidSize) / 1024 / 1024;
  
  if (totalMB > 4) {
    return res.status(413).json({ 
      error: 'File terlalu besar (' + totalMB.toFixed(1) + 'MB). Kompres video/gambar dulu. Video max ~2MB, gambar max ~500KB sebelum di-upload.' 
    });
  }

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

    const text = await response.text();
    let data;
    try { data = JSON.parse(text); } catch(e) { data = { raw: text }; }

    if (!response.ok) {
      return res.status(response.status).json({ error: data.message || data.error || text.slice(0,200) });
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
