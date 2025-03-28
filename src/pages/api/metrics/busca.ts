import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { session_id, query } = req.body;

    // Here you would handle the logic for storing or processing the metrics
    console.log('Metrics for busca:', { session_id, query });

    res.status(200).json({ message: 'Metrics for busca recorded' });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 