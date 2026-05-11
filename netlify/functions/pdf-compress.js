const fetch = require("node-fetch");
const FormData = require("form-data");

exports.handler = async (event) => {
  try {
    const { fileBase64, fileName } = JSON.parse(event.body || "{}");

    if (!process.env.CLOUDMERSIVE_API_KEY) {
      return response(500, { error: "CLOUDMERSIVE_API_KEY missing in Netlify environment variables." });
    }

    if (!fileBase64) {
      return response(400, { error: "PDF file missing." });
    }

    const buffer = Buffer.from(fileBase64, "base64");
    const form = new FormData();
    form.append("inputFile", buffer, {
      filename: fileName || "input.pdf",
      contentType: "application/pdf"
    });

    const apiRes = await fetch("https://api.cloudmersive.com/convert/edit/pdf/compress/reduce-file-size", {
      method: "POST",
      headers: {
        "Apikey": process.env.CLOUDMERSIVE_API_KEY,
        ...form.getHeaders()
      },
      body: form
    });

    const outBuffer = await apiRes.buffer();

    if (!apiRes.ok) {
      return response(apiRes.status, { error: outBuffer.toString() || "Cloudmersive PDF compression failed." });
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
