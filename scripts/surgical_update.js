const fs = require('fs');
try {
  const content = fs.readFileSync('Zyndrix Lead Pipeline v6.json', 'utf8');
  const wf = JSON.parse(content);

  // 1. Inyectar Mejoras de IA (sin borrar nada anterior)
  const aiNode = wf.nodes.find(n => n.name === 'Build AI Body');
  if (aiNode) {
    aiNode.parameters.jsCode = "var items = $input.all(); var item = items[0].json;\nvar prompt = `DIAGNÓSTICO ESTRATÉGICO PERSONALIZADO - ZYNDRIX 2026\\n\\n### CONTEXTO DE ENTIDAD\\n- **Entidad:** ${item.company}\\n- **Sector:** ${item.sector}\\n\\n### TU MISIÓN\\nEres un Consultor Senior. Redacta el diagnóstico con SALTO DE LÍNEA REAL (Enter cada vez que quieras separar un párrafo).\\n\\n### REQUISITOS:\\n1. **USA VIÑETAS (·)** para marcar 3 puntos clave.\\n2. **USA ESPACIOS REALES** (Enter) para que el texto sea escaneable.\\n3. **MÁXIMA CALIDAD**: Háblale de tú a tú a ${item.company}.\\n\\nResponde ÚNICAMENTE con este JSON:\\n{\\n  \"tier\": \"(Escribe VIP, ALTO o MEDIO)\",\\n  \"score\": (Número entre 0 y 100),\\n  \"reasoning\": \"(Diagnóstico con saltos de línea reales (Enter))\",\\n  \"priority_action\": \"(Próximo paso estratégico)\",\\n  \"estimated_value\": \"(Impacto ROI)\"\\n}`;\nitems[0].json.aiBody = JSON.stringify({ model: \"gpt-4o\", temperature: 0.7, messages: [{role: \"system\", content: \"Eres el Socio Estratégico de Zyndrix. Tu prioridad es el formato limpio con saltos de línea reales.\"}, {role: \"user\", content: prompt}] });\nreturn items;";
  }

  // 1.1 Blindar el Parseo de IA (LIMPIEZA DE SALTOS DE LÍNEA)
  const parseNode = wf.nodes.find(n => n.name === 'Parse AI Score');
  if (parseNode) {
    parseNode.parameters.jsCode = "var items = $input.all(); var lead = $('Normalize Data').first().json; var aiRaw = '';\ntry { aiRaw = items[0].json.choices[0].message.content || '{}'; } catch(e) { aiRaw = '{}'; }\n\nfunction extractJson(str) {\n  var match = str.match(/\\{[^{}]*\\}/s);\n  if (!match) return {};\n  try { return JSON.parse(match[0]); } catch(e) { return {}; }\n}\n\nvar parsed = extractJson(aiRaw);\n// LIMPIEZA DEFINITIVA: Convertir '\\n' literal en un salto de línea real\nif (parsed.reasoning) parsed.reasoning = parsed.reasoning.replace(/\\\\n/g, '\\n');\n\nif (!parsed.reasoning) parsed = {tier:'MEDIO',score:50,reasoning:aiRaw,priority_action:'Contactar para diagnóstico',estimated_value:'Consultar'};\n\nreturn [{json:{ ...lead, tier:parsed.tier, score:parsed.score, reasoning:parsed.reasoning, priority_action:parsed.priority_action, estimated_value:parsed.estimated_value }}];";
  }

  // 2. Inyectar Mejoras de Email (LOGO XXL + LEFT ALIGN)
  const emailNode = wf.nodes.find(n => n.name === 'Email Lead');
  if (emailNode) {
    emailNode.parameters.message = "=<div style=\"background:#fff;color:#1e293b;padding:40px;font-family:'Inter',sans-serif;border:1px solid #f1f5f9;line-height:1.7;max-width:620px;margin:auto;border-radius:12px;\">\n  <div style=\"margin-bottom:45px;\">\n    <img src=\"https://zyndrix.dev/img/zyndrix-live.png\" alt=\"Zyndrix Logo\" style=\"height:150px;width:auto;\">\n  </div>\n\n  <h2 style=\"color:#0f172a;margin-top:0;font-weight:700;\">Hola, {{ $(\"Parse AI Score\").item.json.name }}.</h2>\n  <p>Es un placer saludarte. He estado analizando el caso de <strong>{{ $(\"Parse AI Score\").item.json.company }}</strong> y tengo una propuesta de valor de alto impacto para compartirte.</p>\n  \n  <div style=\"background:#f8fafc;padding:30px;border-left:4px solid #38bdf8;margin:35px 0; border-radius:0 8px 8px 0; white-space:pre-wrap; color:#334155; font-size:15px;\">\n{{ $(\"Parse AI Score\").item.json.reasoning }}\n  </div>\n\n  <p style=\"font-weight:600;color:#0f172a; margin-bottom:10px;\">Nuestro próximo paso: {{ $(\"Parse AI Score\").item.json.priority_action }}</p>\n\n  <div style=\"text-align:center;margin-top:40px;\">\n    <a href=\"https://calendly.com/omontesquesada/zyndrix\" style=\"background:#0f172a;color:white;padding:18px 36px;text-decoration:none;border-radius:8px;font-weight:bold;display:inline-block;box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);\">Agendar Sesión de Alineación</a>\n  </div>\n  \n  <p style=\"font-size:12px;color:#94a3b8;margin-top:45px;text-align:center;\">Con visión y compromiso,<br><strong>El Equipo de Zyndrix</strong></p>\n</div>";
  }

  // 3. Arreglar Telegram Alert (FIX LINK + STRUCTURE)
  const telegramNode = wf.nodes.find(n => n.name === 'Telegram Alert');
  if (telegramNode) {
    telegramNode.parameters.text = "=🚀 *NUEVO LEAD ZYNDRIX ELITE* 🚀\n\n🏢 *Empresa:* {{ $json.company_name }}\n👤 *Contacto:* {{ $json.name }}\n📍 *Sector:* {{ $json.sector }}\n💎 *Tier:* {{ $json.tier }}\n📊 *Score:* {{ $json.score }}/100\n\n💡 *Diagnóstico IA:* \n{{ $json.reasoning }}\n\n📞 *Teléfono:* {{ $json.phone }}\n✉️ *Email:* {{ $json.email }}\n\n📅 *Calendly:* https://calendly.com/omontesquesada/zyndrix\n\n_Acción sugerida: {{ $json.priority_action }}_";
    telegramNode.parameters.additionalFields = { parse_mode: "Markdown" };
  }

  wf.name = "v7_MASTER_ELITE";
  fs.writeFileSync('v7_MASTER_ELITE.json', JSON.stringify(wf));
  console.log("SUCCESS");
} catch (e) {
  console.error("ERROR:", e.message);
}
