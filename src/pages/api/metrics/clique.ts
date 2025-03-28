import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { session_id, query, posicao, objeto_clicado } = req.body;

    // Here you would handle the logic for storing or processing the metrics
    console.log('Metrics for clique:', { session_id, query, posicao, objeto_clicado });

    res.status(200).json({ message: 'Metrics for clique recorded' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 