exports.handler = async (event) => {
  try {
    const { prompt } = JSON.parse(event.body || "{}");

    if (!prompt) {
      return response(400, { error: "Prompt missing." });
    }

    /*
      Real AI setup:
      - Add OPENAI_API_KEY or GEMINI_API_KEY in Netlify environment variables.
      - Then call the official API here.

      For now this demo response keeps your frontend working without paid API.
    */

    const reply = `Demo AI reply: Aapne poocha "${prompt}". Real AI chat ke liye backend me OPENAI_API_KEY ya GEMINI_API_KEY add karni hogi.`;

    return response(200, { reply });

  } catch (err) {
    return response(500, { error: err.message });
  }
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  };
}
