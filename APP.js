import { useState } from "react";

export default function App() {
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [result, setResult] = useState({
    empresa: "",
    industria: "Sin evaluar",
    que_hace: "Todavía no hay análisis.",
    score: "—",
    clasificacion: "Sin evaluar",
    prioridad_comercial: "Sin evaluar",
    pain_points_detectados: ["Todavía no conectamos el análisis real."],
    justificacion_del_score:
      "Cuando conecte y responda el agente, esto se completa.",
    evidencia_positiva: ["Sin evidencia todavía."],
    evidencia_negativa_o_dudas: ["Sin dudas todavía."],
    riesgos_del_analisis: ["Todavía no hay riesgos cargados."],
    que_inflo_el_analisis: ["Todavía no hay factores positivos."],
    que_bajo_el_analisis: ["Todavía no hay factores negativos."],
    confianza_del_analisis: "Sin evaluar",
    faltantes_por_validar: ["Sin validar todavía."],
    urls_recomendadas_para_investigar: ["Sin URLs recomendadas todavía."],
  });

  async function handleEvaluate() {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName,
          website,
          country,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al evaluar la empresa.");
      }

      setResult({
        empresa: data.empresa ?? companyName ?? "",
        industria: data.industria ?? "Sin dato",
        que_hace: data.que_hace ?? "Sin dato",
        score: data.score ?? "—",
        clasificacion: data.clasificacion ?? "Sin dato",
        prioridad_comercial: data.prioridad_comercial ?? "Sin dato",
        pain_points_detectados:
          data.pain_points_detectados?.length
            ? data.pain_points_detectados
            : ["Sin pain points detectados"],
        justificacion_del_score:
          data.justificacion_del_score ?? "Sin justificación",
        evidencia_positiva:
          data.evidencia_positiva?.length
            ? data.evidencia_positiva
            : ["Sin evidencia positiva"],
        evidencia_negativa_o_dudas:
          data.evidencia_negativa_o_dudas?.length
            ? data.evidencia_negativa_o_dudas
            : ["Sin dudas detectadas"],
        riesgos_del_analisis:
          data.riesgos_del_analisis?.length
            ? data.riesgos_del_analisis
            : ["Sin riesgos detectados"],
        que_inflo_el_analisis:
          data.que_inflo_el_analisis?.length
            ? data.que_inflo_el_analisis
            : ["Sin factores que inflaron el análisis"],
        que_bajo_el_analisis:
          data.que_bajo_el_analisis?.length
            ? data.que_bajo_el_analisis
            : ["Sin factores que bajaron el análisis"],
        confianza_del_analisis:
          data.confianza_del_analisis ?? "Sin dato",
        faltantes_por_validar:
          data.faltantes_por_validar?.length
            ? data.faltantes_por_validar
            : ["Sin faltantes por validar"],
        urls_recomendadas_para_investigar:
          data.urls_recomendadas_para_investigar?.length
            ? data.urls_recomendadas_para_investigar
            : ["Sin URLs recomendadas"],
      });
    } catch (error) {
      setResult({
        empresa: companyName || "",
        industria: "Error",
        que_hace: "No se pudo completar el análisis.",
        score: "Error",
        clasificacion: "Error",
        prioridad_comercial: "Error",
        pain_points_detectados: [error.message],
        justificacion_del_score:
          "Revisá backend, gateway o formato del JSON.",
        evidencia_positiva: ["Revisá si OpenClaw está corriendo."],
        evidencia_negativa_o_dudas: [
          "Revisá si el agente qualifier respondió.",
        ],
        riesgos_del_analisis: ["La conexión con el agente falló."],
        que_inflo_el_analisis: ["No aplica por error."],
        que_bajo_el_analisis: ["No aplica por error."],
        confianza_del_analisis: "Baja",
        faltantes_por_validar: ["No se pudo validar por error de conexión."],
        urls_recomendadas_para_investigar: ["Sin URLs por error."],
      });
    } finally {
      setIsLoading(false);
    }
  }

  function getScoreColor(score) {
    const n = Number(score);
    if (Number.isNaN(n)) return "#ffffff";
    if (n >= 80) return "#22c55e";
    if (n >= 60) return "#f59e0b";
    if (n >= 40) return "#fb923c";
    return "#ef4444";
  }

  function looksLikeUrl(value) {
    return typeof value === "string" && /^https?:\/\//i.test(value.trim());
  }

  return (
    <div style={styles.page}>
      <div style={styles.bgGlowTop} />
      <div style={styles.bgGlowBottom} />
      <div style={styles.bgGrid} />

      <div style={styles.shell}>
        <header style={styles.hero}>
          <div style={styles.heroContent}>
            <div style={styles.brandRow}>
              <div style={styles.brandMark}>A</div>
              <div>
                <div style={styles.brandMini}>atomchat.io</div>
                <div style={styles.brandLine}>AI revenue signal system</div>
              </div>
            </div>

            <h1 style={styles.heroTitle}>Calificador ICP</h1>
            <p style={styles.heroText}>
              Priorizá mejor, detectá motion conversacional real y transformá
              el análisis comercial en una decisión más rápida y más clara.
            </p>

            <div style={styles.heroMetaRow}>
              <div style={styles.heroChip}>WhatsApp</div>
              <div style={styles.heroChip}>CRM</div>
              <div style={styles.heroChip}>Inbound</div>
              <div style={styles.heroChip}>Qualifier Agent</div>
            </div>
          </div>

          <div style={styles.heroOrbWrap}>
            <div style={styles.orbOuter} />
            <div style={styles.orbMiddle} />
            <div style={styles.orbInner}>
              <div style={styles.orbCore}>A</div>
            </div>
          </div>
        </header>

        <main style={styles.mainGrid}>
          <section style={styles.formCard}>
            <div style={styles.sectionHead}>
              <div>
                <div style={styles.sectionEyebrow}>Input</div>
                <h2 style={styles.sectionTitle}>Datos de la empresa</h2>
              </div>
              <div style={styles.microBadge}>live</div>
            </div>

            <div style={styles.formGrid}>
              <div style={styles.fullWidth}>
                <label style={styles.label}>Nombre</label>
                <input
                  style={styles.input}
                  placeholder="Ej: Toyota Federico"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>

              <div style={styles.fullWidth}>
                <label style={styles.label}>Website</label>
                <input
                  style={styles.input}
                  placeholder="https://..."
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>

              <div style={styles.fullWidth}>
                <label style={styles.label}>País</label>
                <input
                  style={styles.input}
                  placeholder="Argentina"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>

              <div style={styles.fullWidth}>
                <label style={styles.label}>Descripción adicional</label>
                <textarea
                  style={styles.textarea}
                  placeholder="Concesionario, universidad, fintech, call center, alto volumen inbound..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <button style={styles.ctaButton} onClick={handleEvaluate}>
              <span>{isLoading ? "Evaluando..." : "Evaluar empresa"}</span>
              <span style={styles.ctaArrow}>↗</span>
            </button>
          </section>

          <section style={styles.resultCard}>
            <div style={styles.sectionHead}>
              <div>
                <div style={styles.sectionEyebrow}>Output</div>
                <h2 style={styles.sectionTitle}>Lectura del análisis</h2>
              </div>
              <div style={styles.fitPanel}>
                <div style={styles.fitLabel}>Score</div>
                <div
                  style={{
                    ...styles.fitNumber,
                    color: getScoreColor(result.score),
                  }}
                >
                  {result.score}
                </div>
              </div>
            </div>

            <div style={styles.resultGrid}>
              <div style={styles.resultPanelLarge}>
                <div style={styles.resultLabel}>Empresa</div>
                <div style={styles.resultText}>{result.empresa || "Sin dato"}</div>
              </div>

              <div style={styles.resultPanelSmall}>
                <div>
                  <div style={styles.resultLabel}>Clasificación</div>
                  <div style={styles.resultText}>{result.clasificacion}</div>
                </div>
                <div style={styles.priorityPill}>{result.prioridad_comercial}</div>
              </div>

              <div style={styles.resultPanelLarge}>
                <div style={styles.resultLabel}>Industria</div>
                <div style={styles.resultText}>{result.industria}</div>
              </div>

              <div style={styles.resultPanelLarge}>
                <div style={styles.resultLabel}>Qué hace</div>
                <div style={styles.resultText}>{result.que_hace}</div>
              </div>

              <div style={styles.resultPanelLarge}>
                <div style={styles.resultLabel}>Pain points detectados</div>
                <ul style={styles.list}>
                  {result.pain_points_detectados.map((item, index) => (
                    <li key={index} style={styles.listItem}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={styles.resultPanelLarge}>
                <div style={styles.resultLabel}>Justificación del score</div>
                <div style={styles.resultText}>{result.justificacion_del_score}</div>
              </div>

              <div style={styles.resultPanelLarge}>
                <div style={styles.resultLabel}>Evidencia positiva</div>
                <ul style={styles.list}>
                  {result.evidencia_positiva.map((item, index) => (
                    <li key={index} style={styles.listItem}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={styles.resultPanelLarge}>
                <div style={styles.resultLabel}>Evidencia negativa / dudas</div>
                <ul style={styles.list}>
                  {result.evidencia_negativa_o_dudas.map((item, index) => (
                    <li key={index} style={styles.listItem}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={styles.resultPanelLarge}>
                <div style={styles.resultLabel}>Riesgos del análisis</div>
                <ul style={styles.list}>
                  {result.riesgos_del_analisis.map((item, index) => (
                    <li key={index} style={styles.listItem}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={styles.resultPanelLarge}>
                <div style={styles.resultLabel}>Qué infló el análisis</div>
                <ul style={styles.list}>
                  {result.que_inflo_el_analisis.map((item, index) => (
                    <li key={index} style={styles.listItem}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={styles.resultPanelLarge}>
                <div style={styles.resultLabel}>Qué bajó el análisis</div>
                <ul style={styles.list}>
                  {result.que_bajo_el_analisis.map((item, index) => (
                    <li key={index} style={styles.listItem}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={styles.resultPanelLarge}>
                <div style={styles.resultLabel}>Faltantes por validar</div>
                <ul style={styles.list}>
                  {result.faltantes_por_validar.map((item, index) => (
                    <li key={index} style={styles.listItem}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={styles.resultPanelLarge}>
                <div style={styles.resultLabel}>URLs recomendadas para investigar</div>
                <ul style={styles.list}>
                  {result.urls_recomendadas_para_investigar.map((item, index) => (
                    <li key={index} style={styles.listItem}>
                      {looksLikeUrl(item) ? (
                        <a
                          href={item}
                          target="_blank"
                          rel="noreferrer"
                          style={styles.link}
                        >
                          {item}
                        </a>
                      ) : (
                        <span style={styles.resultText}>{item}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={styles.resultPanelSmall}>
                <div style={styles.resultLabel}>Confianza del análisis</div>
                <div style={styles.priorityPill}>{result.confianza_del_analisis}</div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #060608 0%, #0b0b10 55%, #101018 100%)",
    color: "#fff",
    fontFamily: "Inter, Arial, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  bgGlowTop: {
    position: "absolute",
    width: 720,
    height: 720,
    borderRadius: "999px",
    top: -240,
    right: -120,
    background:
      "radial-gradient(circle, rgba(255,109,40,0.18) 0%, rgba(255,109,40,0.05) 38%, transparent 68%)",
    filter: "blur(50px)",
  },
  bgGlowBottom: {
    position: "absolute",
    width: 640,
    height: 640,
    borderRadius: "999px",
    bottom: -260,
    left: -120,
    background:
      "radial-gradient(circle, rgba(255,151,90,0.14) 0%, rgba(255,151,90,0.04) 42%, transparent 72%)",
    filter: "blur(60px)",
  },
  bgGrid: {
    position: "absolute",
    inset: 0,
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)",
    backgroundSize: "44px 44px",
    maskImage: "radial-gradient(circle at center, black 38%, transparent 100%)",
    pointerEvents: "none",
  },
  shell: {
    width: "min(1440px, calc(100vw - 48px))",
    margin: "0 auto",
    padding: "28px 0 40px",
    position: "relative",
    zIndex: 2,
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "1.15fr 0.85fr",
    gap: "28px",
    alignItems: "center",
    minHeight: "42vh",
    marginBottom: "28px",
    padding: "36px 38px",
    borderRadius: "36px",
    background: "linear-gradient(135deg, rgba(20,20,24,0.82), rgba(10,10,14,0.72))",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.34)",
    backdropFilter: "blur(18px)",
  },
  heroContent: { maxWidth: "760px" },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
  },
  brandMark: {
    width: "64px",
    height: "64px",
    borderRadius: "22px",
    background: "linear-gradient(135deg, #ff7a18 0%, #ff5b1f 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: 800,
    boxShadow: "0 18px 36px rgba(255,122,24,0.30)",
  },
  brandMini: {
    color: "#ffaf81",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    marginBottom: "4px",
  },
  brandLine: { color: "#b6b6be", fontSize: "14px" },
  heroTitle: {
    margin: 0,
    fontSize: "clamp(52px, 7vw, 96px)",
    lineHeight: 0.94,
    letterSpacing: "-0.06em",
    maxWidth: "760px",
  },
  heroText: {
    marginTop: "20px",
    fontSize: "clamp(16px, 1.7vw, 20px)",
    lineHeight: 1.7,
    color: "#d2d2d8",
    maxWidth: "700px",
  },
  heroMetaRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "26px",
  },
  heroChip: {
    padding: "10px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: "14px",
  },
  heroOrbWrap: {
    minHeight: "420px",
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  orbOuter: {
    position: "absolute",
    width: 420,
    height: 420,
    borderRadius: "999px",
    border: "1px solid rgba(255,122,24,0.16)",
    boxShadow: "0 0 0 1px rgba(255,255,255,0.02) inset",
  },
  orbMiddle: {
    position: "absolute",
    width: 310,
    height: 310,
    borderRadius: "999px",
    border: "1px solid rgba(255,255,255,0.07)",
  },
  orbInner: {
    width: 220,
    height: 220,
    borderRadius: "34px",
    background: "radial-gradient(circle at center, rgba(255,122,24,0.22), rgba(10,10,12,0.98) 72%)",
    border: "1px solid rgba(255,122,24,0.18)",
    boxShadow: "0 0 60px rgba(255,122,24,0.16)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  orbCore: {
    width: 96,
    height: 96,
    borderRadius: "26px",
    background: "linear-gradient(135deg, #ff7a18 0%, #ff5b1f 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "42px",
    fontWeight: 800,
    boxShadow: "0 16px 36px rgba(255,122,24,0.34)",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(360px, 0.86fr) minmax(520px, 1.14fr)",
    gap: "24px",
    alignItems: "start",
  },
  formCard: {
    padding: "28px",
    borderRadius: "32px",
    background: "linear-gradient(180deg, rgba(18,18,22,0.88), rgba(10,10,12,0.80))",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
    backdropFilter: "blur(16px)",
  },
  resultCard: {
    padding: "28px",
    borderRadius: "32px",
    background: "linear-gradient(180deg, rgba(18,18,22,0.88), rgba(10,10,12,0.80))",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
    backdropFilter: "blur(16px)",
  },
  sectionHead: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "18px",
    marginBottom: "22px",
  },
  sectionEyebrow: {
    color: "#ff9b63",
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    fontSize: "12px",
    marginBottom: "8px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "38px",
    lineHeight: 1,
    letterSpacing: "-0.04em",
  },
  microBadge: {
    padding: "10px 14px",
    borderRadius: "999px",
    border: "1px solid rgba(255,122,24,0.22)",
    background: "rgba(255,122,24,0.10)",
    color: "#ffb48a",
    fontSize: "13px",
  },
  formGrid: { display: "grid", gap: "16px" },
  fullWidth: { width: "100%" },
  label: {
    display: "block",
    marginBottom: "9px",
    color: "#c8c8cf",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(6,6,8,0.92)",
    color: "white",
    borderRadius: "18px",
    padding: "18px 18px",
    outline: "none",
    fontSize: "16px",
  },
  textarea: {
    width: "100%",
    minHeight: "154px",
    boxSizing: "border-box",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(6,6,8,0.92)",
    color: "white",
    borderRadius: "18px",
    padding: "18px 18px",
    outline: "none",
    resize: "vertical",
    fontSize: "16px",
  },
  ctaButton: {
    width: "100%",
    marginTop: "18px",
    padding: "18px 20px",
    borderRadius: "20px",
    border: "none",
    background: "linear-gradient(135deg, #ff7a18 0%, #ff5b1f 100%)",
    color: "white",
    fontWeight: 700,
    fontSize: "16px",
    cursor: "pointer",
    boxShadow: "0 20px 40px rgba(255,122,24,0.24)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ctaArrow: { fontSize: "18px", opacity: 0.92 },
  fitPanel: {
    minWidth: 170,
    padding: "16px 18px",
    borderRadius: "24px",
    background: "linear-gradient(135deg, rgba(255,122,24,0.18), rgba(255,91,31,0.08))",
    border: "1px solid rgba(255,122,24,0.22)",
  },
  fitLabel: {
    fontSize: "13px",
    color: "#f2c2a5",
    marginBottom: "8px",
  },
  fitNumber: {
    fontSize: "42px",
    fontWeight: 800,
    lineHeight: 1,
  },
  resultGrid: { display: "grid", gap: "16px" },
  resultPanelSmall: {
    padding: "20px",
    borderRadius: "24px",
    background: "rgba(7,7,9,0.94)",
    border: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
  },
  resultPanelLarge: {
    padding: "20px",
    borderRadius: "24px",
    background: "rgba(7,7,9,0.94)",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  resultLabel: {
    color: "#c8c8cf",
    fontSize: "14px",
    marginBottom: "10px",
  },
  resultText: {
    color: "#fff",
    fontSize: "16px",
    lineHeight: 1.7,
  },
  priorityPill: {
    padding: "10px 14px",
    borderRadius: "999px",
    background: "rgba(255,122,24,0.16)",
    color: "#ffb48a",
    border: "1px solid rgba(255,122,24,0.18)",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  list: {
    margin: 0,
    paddingLeft: "20px",
    color: "#fff",
    lineHeight: 1.8,
    fontSize: "16px",
  },
  listItem: { marginBottom: "6px" },
  link: {
    color: "#ffb48a",
    textDecoration: "none",
    wordBreak: "break-word",
  },
};
```</numerusform to=container.exec analysis  大发快三是国家  天天中彩票足球json  cont