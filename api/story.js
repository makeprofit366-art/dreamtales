export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }
  try {
    const { prompt } = req.body;
    const GROQ_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_KEY) { res.status(500).json({ error: 'GROQ_API_KEY not set' }); return; }
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2048,
        temperature: 0.9
      })
    });
    const data = await r.json();
    if (data.error) { res.status(400).json({ error: data.error.message }); return; }
    res.status(200).json({ text: data.choices?.[0]?.message?.content || '' });
  } catch (e) { res.status(500).json({ error: e.message }); }
}
