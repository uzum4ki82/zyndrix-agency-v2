const body = {
  name: 'Trial User',
  email: 'trial@zyndrix.dev',
  phone: '+34 123 456 789',
  budget: '1k-3k',
  company_name: 'Big Corp',
  service: 'contenido',
  message: 'Hello world'
};

const leadId = 'test-id';
const leadData = [{
    id: leadId,
    name: body.name,
    email: body.email,
    phone: body.phone,
    company_name: body.company_name,
    message: body.message,
    budget: body.budget,
    service: body.service,
    status: 'new'
}];

const recordPayload = leadData[0];

const payload = {
  source: body.service,
  record: recordPayload
};

console.log('FINAL PAYLOAD TO N8N:', JSON.stringify(payload, null, 2));
