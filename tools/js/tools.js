const $ = (id) => document.getElementById(id);

const menuBtn = $("menuBtn");
const navMenu = $("navMenu");
menuBtn.addEventListener("click", () => navMenu.classList.toggle("show"));

$("toolSearch").addEventListener("input", function () {
  const value = this.value.toLowerCase();
  document.querySelectorAll(".tool-card").forEach((card) => {
    card.style.display = card.dataset.name.includes(value) ? "block" : "none";
  });
});

function downloadBlob(blob, filename) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject("No file selected");
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/* OLD TOOLS */
async function extractTextFromImage() {
  const file = $("ocrImage").files[0];
  if (!file) return alert("Please select an image");

  $("ocrResult").value = "Reading image... wait";

  try {
    const result = await Tesseract.recognize(file, "eng");
    $("ocrResult").value = result.data.text || "No text found";
  } catch (error) {
    $("ocrResult").value = "OCR failed. Check internet/CDN or image quality.";
  }
}

async function convertImage() {
  const file = $("convertImage").files[0];
  const format = $("convertFormat").value;
  if (!file) return alert("Select image");

  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);

  canvas.toBlob((blob) => {
    const ext = format.split("/")[1];
    downloadBlob(blob, `converted.${ext}`);
  }, format, 0.95);
}

$("previewImageInput").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;

  const img = $("imagePreview");
  img.src = URL.createObjectURL(file);
  img.style.display = "block";
});

async function resizeImage() {
  const file = $("resizeImageInput").files[0];
  const width = parseInt($("resizeWidth").value);
  const height = parseInt($("resizeHeight").value);

  if (!file || !width || !height) return alert("Select image and enter width/height");

  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  canvas.getContext("2d").drawImage(img, 0, 0, width, height);

  canvas.toBlob((blob) => downloadBlob(blob, "resized-image.png"), "image/png");
}

$("compressQuality").addEventListener("input", function () {
  $("qualityValue").textContent = this.value;
});

async function compressImage() {
  const file = $("compressImageInput").files[0];
  const quality = parseFloat($("compressQuality").value);
  if (!file) return alert("Select image");

  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  canvas.getContext("2d").drawImage(img, 0, 0);

  canvas.toBlob((blob) => downloadBlob(blob, "compressed-image.jpg"), "image/jpeg", quality);
}

$("pdfViewerInput").addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;
  $("pdfViewer").src = URL.createObjectURL(file);
});

async function mergePDFs() {
  const files = $("pdfMergeInput").files;
  if (files.length < 2) return alert("Select at least 2 PDF files");

  const mergedPdf = await PDFLib.PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(bytes);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  const mergedBytes = await mergedPdf.save();
  downloadBlob(new Blob([mergedBytes], { type: "application/pdf" }), "merged.pdf");
}

function textToPDF() {
  const text = $("textToPdfInput").value.trim();
  if (!text) return alert("Enter text");

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  const lines = pdf.splitTextToSize(text, 180);
  pdf.text(lines, 15, 20);
  pdf.save("text.pdf");
}

/* NEW TOOLS */
async function removeWhiteBackground() {
  const file = $("bgRemoveInput").files[0];
  if (!file) return alert("Select image");

  const img = await loadImage(file);
  const canvas = $("bgCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = data.data;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    if (r > 210 && g > 210 && b > 210) {
      pixels[i + 3] = 0;
    }
  }

  ctx.putImageData(data, 0, 0);
  canvas.toBlob((blob) => downloadBlob(blob, "background-removed.png"), "image/png");
}

async function enhanceImage() {
  const file = $("enhanceInput").files[0];
  if (!file) return alert("Select image");

  const img = await loadImage(file);
  const canvas = $("enhanceCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.filter = "contrast(1.18) saturate(1.22) brightness(1.08)";
  ctx.drawImage(img, 0, 0);

  canvas.toBlob((blob) => downloadBlob(blob, "enhanced-image.png"), "image/png");
}

function generateQR() {
  const text = $("qrText").value.trim();
  if (!text) return alert("Enter text or link");

  $("qrBox").innerHTML = "";
  new QRCode($("qrBox"), {
    text,
    width: 180,
    height: 180,
    colorDark: "#000000",
    colorLight: "#ffffff",
  });
}

async function scanQR() {
  const file = $("qrScanInput").files[0];
  if (!file) return alert("Select QR image");

  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, canvas.width, canvas.height);

  $("qrScanResult").textContent = code ? code.data : "QR not detected";
}

async function compressPDF() {
  const file = $("pdfCompressInput").files[0];
  if (!file) return alert("Select PDF");

  try {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFLib.PDFDocument.load(bytes);
    const saved = await pdf.save({ useObjectStreams: true });
    downloadBlob(new Blob([saved], { type: "application/pdf" }), "compressed.pdf");
  } catch (error) {
    alert("PDF compression failed");
  }
}

async function universalImageConverter() {
  const file = $("formatInput").files[0];
  const format = $("formatSelect").value;
  if (!file) return alert("Select image");

  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d");

  if (format === "image/jpeg") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);

  canvas.toBlob((blob) => {
    const ext = format === "image/jpeg" ? "jpg" : format.split("/")[1];
    downloadBlob(blob, `converted.${ext}`);
  }, format, 0.95);
}

function startVoiceToText() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice to Text is not supported in this browser. Use Chrome.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "hi-IN";
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    $("voiceText").value += event.results[0][0].transcript + " ";
  };

  recognition.onerror = () => alert("Voice recognition error");
  recognition.start();
}

function textToSpeech() {
  const text = $("ttsText").value.trim();
  if (!text) return alert("Enter text");

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "hi-IN";
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
}

function stopSpeech() {
  speechSynthesis.cancel();
}

function demoAIChat() {
  const input = $("aiInput").value.trim();
  if (!input) return alert("Ask something");

  const reply = getDemoReply(input);
  $("aiChatBox").innerHTML += `<p><b>You:</b> ${escapeHTML(input)}</p><p><b>Bot:</b> ${reply}</p>`;
  $("aiInput").value = "";
  $("aiChatBox").scrollTop = $("aiChatBox").scrollHeight;
}

function getDemoReply(text) {
  const t = text.toLowerCase();

  if (t.includes("hello") || t.includes("hi") || t.includes("namaste")) {
    return "Hello! Main Zen Z demo bot hoon. Main basic replies de sakta hoon.";
  }

  if (t.includes("website")) {
    return "Website ke liye Home, Blogs, Tools, Vlogs aur YouTube Links pages strong structure banate hain.";
  }

  if (t.includes("tools")) {
    return "Tools section me image, PDF, QR, voice aur text tools add kiye ja sakte hain.";
  }

  return "Ye demo AI Chat hai. Real AI ke liye OpenAI/Gemini API aur backend setup karna padega.";
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[m]));
}

function generatePassword() {
  const length = parseInt($("passLength").value) || 12;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  $("passwordResult").textContent = password;
  navigator.clipboard?.writeText(password);
}

function generatePalette() {
  const box = $("paletteBox");
  box.innerHTML = "";

  for (let i = 0; i < 5; i++) {
    const color = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    const div = document.createElement("div");
    div.className = "color-box";
    div.style.background = color;
    div.textContent = color;
    div.title = "Click to copy";
    div.onclick = () => navigator.clipboard?.writeText(color);
    box.appendChild(div);
  }
}

let typingStartTime = null;

function checkTypingSpeed() {
  const original = $("typingText").textContent;
  const typed = $("typingInput").value;

  if (!typingStartTime && typed.length > 0) {
    typingStartTime = Date.now();
  }

  const minutes = (Date.now() - typingStartTime) / 60000;
  const words = typed.trim().split(/\s+/).filter(Boolean).length;
  const wpm = minutes > 0 ? Math.round(words / minutes) : 0;
  const accuracy = Math.round((matchingChars(original, typed) / original.length) * 100);

  $("typingResult").textContent = `Speed: ${wpm} WPM | Accuracy: ${Math.max(0, accuracy)}%`;
}

function matchingChars(a, b) {
  let count = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] === b[i]) count++;
  }
  return count;
}

function resetTypingTest() {
  $("typingInput").value = "";
  $("typingResult").textContent = "";
  typingStartTime = null;
}

function calculateAge() {
  const value = $("birthDate").value;
  if (!value) return alert("Select birth date");

  const birth = new Date(value);
  const today = new Date();

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  $("ageResult").textContent = `${years} years, ${months} months, ${days} days`;
}

function convertUnit() {
  const value = parseFloat($("unitValue").value);
  const type = $("unitType").value;

  if (isNaN(value)) return alert("Enter value");

  let result = "";

  if (type === "km-miles") result = `${(value * 0.621371).toFixed(3)} miles`;
  if (type === "miles-km") result = `${(value * 1.60934).toFixed(3)} km`;
  if (type === "kg-lb") result = `${(value * 2.20462).toFixed(3)} pounds`;
  if (type === "lb-kg") result = `${(value * 0.453592).toFixed(3)} kg`;
  if (type === "c-f") result = `${((value * 9) / 5 + 32).toFixed(2)} °F`;
  if (type === "f-c") result = `${(((value - 32) * 5) / 9).toFixed(2)} °C`;

  $("unitResult").textContent = result;
}
