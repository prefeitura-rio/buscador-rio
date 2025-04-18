import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    session_id,
    query,
    portal_origem,
    tipo_dispositivo,
    posicao,
    objeto_clicado,
    noticias_toggled,
  } = req.body;
  const token = process.env.TYPESENSE_API_TOKEN;
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const rootUrl = process.env.API_ROOT_URL;
  try {
    const response = await fetch(`${rootUrl}/metrics/clique`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        session_id,
        query,
        portal_origem,
        tipo_dispositivo,
        posicao,
        objeto_clicado,
        noticias_toggled,
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error posting data:', error);
    res.status(500).json({ error: 'Failed to post data' });
  }
} 