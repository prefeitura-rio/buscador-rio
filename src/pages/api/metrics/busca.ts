import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { session_id, query, portal_origem, tipo_dispositivo } = req.body;
  const recaptchaToken = req.headers["x-recaptcha-token"];
  const token = process.env.TYPESENSE_API_TOKEN;

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...(recaptchaToken
      ? { "X-Recaptcha-Token": recaptchaToken as string }
      : {}),
  };

  const rootUrl = process.env.API_ROOT_URL;

  try {
    const response = await fetch(`${rootUrl}/metrics/busca`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        session_id,
        query,
        portal_origem,
        tipo_dispositivo,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error posting data:", error);
    res.status(500).json({ error: "Failed to post data" });
  }
}
