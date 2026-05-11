const fetch = require("node-fetch");
const FormData = require("form-data");

exports.handler = async (event) => {
  try {
    const { fileBase64, fileName } = JSON.parse(event.body || "{}");

    if (!process.env.REMOVE_BG_API_KEY) {
      return response(500, { error: "REMOVE_BG_API_KEY missing in Netlify environment variables." });
    }

    if (!fileBase64) {
      return response(400, { error: "Image file missing." });
    }

    const buffer = Buffer.from(fileBase64, "base64");
    const form = new FormData();
    form.append("image_file", buffer, fileName || "image.png");
    form.append("size", "auto");

    const apiRes = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": process.env.REMOVE_BG_API_KEY,
        ...form.getHeaders()
      },
      body: form
    });

    const outBuffer = await apiRes.buffer();

    if (!apiRes.ok) {
      return response(apiRes.status, { error: outBuffer.toString() || "remove.bg failed." });
    }

    return response(200, {
      fileBase64: outBuffer.toString("base64")
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
