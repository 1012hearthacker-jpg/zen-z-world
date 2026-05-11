const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const { fileBase64, fileName, text } = JSON.parse(event.body || "{}");

    if (!process.env.PDFCO_API_KEY) {
      return response(500, { error: "PDFCO_API_KEY missing in Netlify environment variables." });
    }

    if (!fileBase64 || !text) {
      return response(400, { error: "PDF file or text missing." });
    }

    /*
      PDF.co real workflow:
      1. Upload file to PDF.co temporary storage.
      2. Call /v1/pdf/edit/add endpoint with x/y/page/text.
      3. Download resulting file.

      This function is intentionally a safe starter template because PDF.co editing
      coordinates depend on your UI. Add x/y/page fields from frontend when needed.
    */

    return response(501, {
      error: "PDF.co editor template ready. Add PDF.co upload + /v1/pdf/edit/add workflow after getting API key.",
      received: {
        fileName: fileName || "input.pdf",
        text
      }
    });

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
