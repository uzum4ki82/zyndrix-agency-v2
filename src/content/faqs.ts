import type { FaqItem } from '@/components/site/Faq';

/**
 * Respuestas redactadas sin compromisos contractuales que el propietario aún no ha fijado
 * (permanencia, alta, volumen incluido, impuestos). Esos puntos remiten a la propuesta por escrito.
 */

export const FAQ_GENERAL: FaqItem[] = [
  {
    q: '¿Tengo que saber de tecnología?',
    a: 'No. Nos cuentas cómo funciona tu negocio y nosotros configuramos el agente. Tú solo lo pruebas y nos dices qué cambiar.',
  },
  {
    q: '¿Qué pasa si el agente no sabe responder algo?',
    a: 'Está preparado para no inventar. Si la pregunta no está en la información que nos has dado, se lo dice al cliente, toma sus datos y te avisa para que respondas tú.',
  },
  {
    q: '¿Hay coste de alta o permanencia?',
    a: 'La cuota es de 50 €/mes (WhatsApp) o 75 €/mes (voz). Antes de empezar te enviamos por escrito si hay coste de alta, la permanencia y los impuestos, para que lo sepas todo antes de decidir.',
  },
  {
    q: '¿Cuántas conversaciones o minutos incluye?',
    a: 'Depende del volumen de tu negocio. Antes de empezar te indicamos por escrito el volumen incluido y cuánto costaría si un mes lo superas. No hay cargos que no hayas visto antes.',
  },
  {
    q: '¿Hay costes de telefonía o de WhatsApp aparte?',
    a: 'El agente de voz necesita una línea y consume minutos, y eso tiene un coste que depende del uso. En WhatsApp necesitas un número para el negocio. Te explicamos cada coste antes de empezar.',
  },
  {
    q: '¿Puedo cambiar lo que responde?',
    a: 'Sí. Si cambian tus precios, horarios o servicios, nos lo dices y actualizamos las respuestas. Durante el primer mes revisamos contigo cómo está respondiendo.',
  },
  {
    q: '¿Se conecta con mi agenda o mi programa de gestión?',
    a: 'La versión base no se conecta con programas externos. Si necesitas que consulte tu agenda o tu programa, lo valoramos aparte según la herramienta que uses.',
  },
  {
    q: '¿Qué pasa con los datos de mis clientes?',
    a: 'Solo se usan para atender las consultas de tu negocio. Antes de empezar te indicamos qué proveedores intervienen y firmamos contigo el acuerdo de tratamiento de datos que exige el RGPD.',
  },
  {
    q: '¿Cómo me doy de baja?',
    a: 'Las condiciones de baja se recogen por escrito en la propuesta antes de contratar.',
  },
];

export const FAQ_WHATSAPP: FaqItem[] = [
  {
    q: '¿Puedo usar el número de WhatsApp que ya tengo?',
    a: 'Depende de cómo lo uses hoy. Lo revisamos contigo antes de empezar y te recomendamos usar tu número actual o uno nuevo solo para el negocio.',
  },
  {
    q: '¿Puedo seguir contestando yo desde el móvil?',
    a: 'Sí. Tú sigues teniendo acceso a las conversaciones y puedes intervenir cuando quieras, sobre todo cuando el agente te avisa de que una consulta necesita tu respuesta.',
  },
  {
    q: '¿Entiende audios?',
    a: 'La versión base trabaja con mensajes de texto. Si en tu negocio llegan muchos audios, lo hablamos al ver tu caso.',
  },
  {
    q: '¿Puede enviar mensajes a todos mis clientes?',
    a: 'No. El agente responde a quien te escribe. Los envíos masivos y las campañas no están incluidos.',
  },
  {
    q: '¿Cuánto tarda en estar funcionando?',
    a: 'Depende de cuánta información haya que preparar y de lo rápido que lo pruebes. Te damos una fecha concreta cuando veamos tu caso.',
  },
];

export const FAQ_VOZ: FaqItem[] = [
  {
    q: '¿La persona que llama sabe que habla con una IA?',
    a: 'Sí. El agente se presenta como asistente virtual del negocio al empezar la llamada.',
  },
  {
    q: '¿Necesito un número nuevo?',
    a: 'No necesariamente. Puedes desviar tu número actual al agente cuando no puedas coger, si tu operador lo permite, o usar un número nuevo. Te ayudamos a elegir.',
  },
  {
    q: '¿Puede pasarme la llamada si es urgente?',
    a: 'La transferencia de llamadas no está incluida en la versión base. El agente toma los datos y el motivo, y te llega el resumen para que devuelvas la llamada.',
  },
  {
    q: '¿Se graban las llamadas?',
    a: 'Si se graba o se guarda la transcripción, se informa a quien llama. Decidimos contigo qué se guarda y durante cuánto tiempo antes de activarlo.',
  },
  {
    q: '¿Qué pasa si llaman muchas personas a la vez?',
    a: 'Te indicamos antes de empezar cuántas llamadas simultáneas puede atender y cuántos minutos incluye tu cuota.',
  },
];
