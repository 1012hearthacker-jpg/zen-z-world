async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) reject(new Error("No file selected"));
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function downloadBase64(base64, filename, type) {
  const link = document.createElement("a");
  link.href = `data:${type};base64,${base64}`;
  link.download = filename;
  link.click();
}

async function compressPdfApi() {
  const file = document.getElementById("pdfCompressFile").files[0];
  const status = document.getElementById("pdfCompressStatus");
  if (!file) return alert("PDF select karo");

  status.textContent = "Compressing...";
  const base64 = await fileToBase64(file);

  const res = await fetch("/.netlify/functions/pdf-compress", {
    method: "POST",
    body: JSON.stringify({ fileBase64: base64, fileName: file.name }),
  });

  const data = await res.json();
  if (!res.ok) {
    status.textContent = data.error || "Compression failed";
    return;
  }

  downloadBase64(data.fileBase64, "compressed.pdf", "application/pdf");
  status.textContent = "Done ✅";
}

async function editPdfApi() {
  const file = document.getElementById("pdfEditFile").files[0];
  const text = document.getElementById("pdfEditText").value.trim();
  const status = document.getElementById("pdfEditStatus");
  if (!file || !text) return alert("PDF aur text dono add karo");

  status.textContent = "Editing...";
  const base64 = await fileToBase64(file);

  const res = await fetch("/.netlify/functions/pdf-edit", {
    method: "POST",
    body: JSON.stringify({ fileBase64: base64, fileName: file.name, text }),
  });

  const data = await res.json();
  if (!res.ok) {
    status.textContent = data.error || "PDF edit failed";
    return;
  }

  downloadBase64(data.fileBase64, "edited.pdf", "application/pdf");
  status.textContent = "Done ✅";
}

async function removeBgApi() {
  const file = document.getElementById("bgRemoveFile").files[0];
  const status = document.getElementById("bgStatus");
  if (!file) return alert("Image select karo");

  status.textContent = "Removing background...";
  const base64 = await fileToBase64(file);

  const res = await fetch("/.netlify/functions/bg-remove", {
    method: "POST",
    body: JSON.stringify({ fileBase64: base64, fileName: file.name }),
  });

  const data = await res.json();
  if (!res.ok) {
    status.textContent = data.error || "Background remove failed";
    return;
  }

  downloadBase64(data.fileBase64, "background-removed.png", "image/png");
  status.textContent = "Done ✅";
}

async function aiChatApi() {
  const prompt = document.getElementById("chatPrompt").value.trim();
  const box = document.getElementById("chatResult");
  if (!prompt) return alert("Prompt likho");

  box.textContent = "Thinking...";

  const res = await fetch("/.netlify/functions/ai-chat", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });

  const data = await res.json();
  box.textContent = data.reply || data.error || "No reply";
}
