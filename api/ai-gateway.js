export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Use Vercel's OIDC token in production, or fallback to API key for local testing with vercel dev
  const apiKey = process.env.VERCEL_OIDC_TOKEN || process.env.AI_GATEWAY_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: 'API key not configured',
      hint: 'Use `vercel dev` for local development with API routes'
    });
  }

  try {
    const response = await fetch('https://ai-gateway.vercel.sh/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `AI Gateway error: ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error calling AI Gateway:', error);
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}
