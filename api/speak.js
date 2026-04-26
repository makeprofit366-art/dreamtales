export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  try {
    const { text, voiceId } = req.body;
    const KEY = process.env.ELEVENLABS_API_KEY;
    if (!KEY) { res.status(500).json({ error: 'ELEVENLABS_API_KEY not set' }); return; }

    // Use provided voiceId or default warm female voice "Aria"
    const voice = voiceId || '9BWtsMINqrJLrRacOk9x';

    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': KEY
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_turbo_v2',
        voice_settings: {
          stability: 0.45,        // slightly varied = more human
          similarity_boost: 0.78,
          style: 0.35,            // some expressiveness
          use_speaker_boost: true
        }
      })
    });

    if (!r.ok) {
      const err = await r.json();
      res.status(400).json({ error: err.detail?.message || 'ElevenLabs error' });
      return;
    }

    // Stream audio back as mp3
    const audioBuffer = await r.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.byteLength);
    res.status(200).send(Buffer.from(audioBuffer));

  } catch (e) { res.status(500).json({ error: e.message }); }
}
