import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { q } = req.query;
  const token = process.env.TYPESENSE_API_TOKEN;
  const headers = { Authorization: `Bearer ${token}` };

  try {
    const response = await fetch(
      `https://busca.dados.rio/search/multsi?q=${q}&cs=carioca-digital-gemini,1746-gemini,pref-rio`,
      {
        headers,
      }
    );

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
} 