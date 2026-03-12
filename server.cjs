const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extractJsonFromText(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No encontré JSON válido en la respuesta del modelo.");
  }

  const jsonText = text.slice(start, end + 1);
  return JSON.parse(jsonText);
}

app.post("/api/evaluate", async (req, res) => {
  try {
    const { companyName, website, country, description } = req.body;

    const prompt = [
      "Evaluá esta empresa según el ICP de Atom.",
      `Empresa: Nombre: ${companyName || ""}.`,
      `Website: ${website || ""}.`,
      `País: ${country || ""}.`,
      `Descripción adicional: ${description || ""}.`,
      "Devolvé solo JSON válido."
    ].join(" ");

    console.log("\n=== REQUEST RECIBIDO ===");
    console.log(req.body);
    console.log("=== PROMPT ===");
    console.log(prompt);

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const outputText = response.output_text || "";

    console.log("=== OUTPUT MODEL ===");
    console.log(outputText || "(vacío)");

    const parsed = extractJsonFromText(outputText);

const normalized = {
  empresa: parsed.empresa || companyName || "",
  industria:
    parsed.industria ||
    parsed.sector ||
    parsed.vertical ||
    "Sin dato",

  que_hace:
    parsed.que_hace ||
    parsed.descripcion ||
    parsed.resumen ||
    parsed.motivo_principal ||
    "Sin dato",

  score:
    parsed.score ||
    parsed.score_icp_atom ||
    parsed.score_icp ||
    "—",

  clasificacion:
    parsed.clasificacion ||
    parsed.fit_icp_atom ||
    parsed.veredicto_icp ||
    "Sin dato",

  prioridad_comercial:
    parsed.prioridad_comercial ||
    parsed.prioridad ||
    "Media",

  pain_points_detectados:
    parsed.pain_points_detectados ||
    parsed.pains_detectados ||
    parsed.pain_points ||
    parsed.razones ||
    ["Sin pain points detectados"],

  justificacion_del_score:
    parsed.justificacion_del_score ||
    parsed.justificacion ||
    parsed.motivo_principal ||
    "Sin justificación",

  evidencia_positiva:
    parsed.evidencia_positiva ||
    parsed.senales_positivas ||
    ["Sin evidencia positiva"],

  evidencia_negativa_o_dudas:
    parsed.evidencia_negativa_o_dudas ||
    parsed.senales_negativas ||
    parsed.senales_negativas_o_riesgos ||
    parsed.riesgos_o_dudas ||
    ["Sin dudas detectadas"],

  riesgos_del_analisis:
    parsed.riesgos_del_analisis ||
    parsed.riesgos ||
    ["Sin riesgos detectados"],

  que_inflo_el_analisis:
    parsed.que_inflo_el_analisis ||
    parsed.factores_positivos ||
    parsed.senales_positivas ||
    ["Sin factores que inflaron el análisis"],

  que_bajo_el_analisis:
    parsed.que_bajo_el_analisis ||
    parsed.factores_negativos ||
    parsed.senales_negativas ||
    ["Sin factores que bajaron el análisis"],

  confianza_del_analisis:
    parsed.confianza_del_analisis ||
    parsed.confianza ||
    "Media",

  faltantes_por_validar:
    parsed.faltantes_por_validar ||
    ["Sin faltantes por validar"],

  urls_recomendadas_para_investigar:
    parsed.urls_recomendadas_para_investigar ||
    ["Sin URLs recomendadas"],
};

return res.json(normalized);

  score: parsed.score || parsed.score_icp_atom || "—",

  clasificacion:
    parsed.clasificacion ||
    parsed.fit_icp_atom ||
    "Sin dato",

  prioridad_comercial:
    parsed.prioridad_comercial ||
    "Media",

  pain_points_detectados:
    parsed.pain_points_detectados ||
    parsed.razones ||
    ["Sin pain points detectados"],

  justificacion_del_score:
    parsed.justificacion_del_score ||
    parsed.justificacion ||
    "Sin justificación",

  evidencia_positiva:
    parsed.evidencia_positiva ||
    ["Sin evidencia positiva"],

  evidencia_negativa_o_dudas:
    parsed.evidencia_negativa_o_dudas ||
    ["Sin dudas detectadas"],

  riesgos_del_analisis:
    parsed.riesgos ||
    ["Sin riesgos detectados"],

  confianza_del_analisis:
    parsed.confianza ||
    "Media",
};

return res.json(normalized);
  } catch (err) {
    console.log("=== ERROR BACKEND ===");
    console.log(err);

    return res.status(500).json({
      error: "No pude evaluar la empresa con OpenAI.",
      details: err.message,
    });
  }
});

app.get("/api/ping", (_req, res) => {
  res.json({ ok: true, message: "backend vivo" });
});

app.get("/", (_req, res) => {
  res.send("atom api online");
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});