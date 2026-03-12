const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

function extractJsonFromText(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No encontré JSON válido en la respuesta de OpenClaw.");
  }

  const jsonText = text.slice(start, end + 1);
  return JSON.parse(jsonText);
}

app.post("/api/evaluate", async (req, res) => {
  const { companyName, website, country, description } = req.body;

  const prompt = `
Evalúa esta empresa según el ICP de Atom.

Empresa:
- Nombre: ${companyName || ""}
- Website: ${website || ""}
- País: ${country || ""}
- Descripción adicional: ${description || ""}

Devolvé solo JSON válido.
`.trim();

  const child = spawn(
    "openclaw",
    ["agent", "--agent", "qualifier", "--message", prompt],
    { shell: true }
  );

  let stdout = "";
  let stderr = "";

  child.stdout.on("data", (data) => {
    stdout += data.toString();
  });

  child.stderr.on("data", (data) => {
    stderr += data.toString();
  });

  child.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({
        error: "OpenClaw devolvió error.",
        details: stderr || stdout,
      });
    }

    try {
      const parsed = extractJsonFromText(stdout);
      return res.json(parsed);
    } catch (err) {
      return res.status(500).json({
        error: "No pude parsear el JSON de OpenClaw.",
        rawOutput: stdout,
        details: err.message,
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});