export default async function handler(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Create a short magical bedtime story for a child",
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // ✅ THIS WAS MISSING
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: "Error generating story" });
  }
}
