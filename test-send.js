import http from 'node:http';

const data = JSON.stringify({
  email: "omontesquesada@gmail.com",
  name: "Clínica Dental Llinars",
  location: "Barcelona",
  isTest: true,
  analysisData: {
    gap: "Fuga de Pacientes en Gestión Móvil",
    strategicImpact: "CRITICAL_IMPACT",
    loss: "4.5k€/Mes",
    pitch: "Hemos detectado un **Impacto Estratégico Crítico** en su gestión de citas online. Los tiempos de carga exceden el benchmark del sector, provocando una **pérdida de captación significativa** de nuevos pacientes locales.",
    stitchPreviewUrl: "https://stitch.zyndrix.dev/preview/demo-clinica",
    screenshotUrl: "https://zyndrix.dev/img/blueprint-placeholder.png"
  }
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/send',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('✅ [ZYNDRIX_LOG]: Respuesta del motor de envíos ->', body);
  });
});

req.on('error', (e) => {
  console.error('❌ Error de conexión (Asegúrate de que npm run dev esté activo):', e.message);
});

req.write(data);
req.end();
