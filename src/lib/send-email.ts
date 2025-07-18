export async function sendEmailViaService({
  to,
  subject,
  template,
  variables,
}: {
  to: string;
  subject: string;
  template: string;
  variables: Record<string, any>;
}) {
  const url = process.env.EMAIL_SERVICE_URL;
  const token = process.env.EMAIL_SERVICE_TOKEN;

  console.log("url:", url);
  console.log("token:", token);

  if (!url || !token) {
    throw new Error("Serviço de e-mail não configurado");
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to,
      subject,
      templateName: template,
      variables,
    }),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    console.error("Erro ao enviar e-mail via microserviço:", errorJson || res.statusText);
    throw new Error("Falha no envio de e-mail");
  }

  return res.json();
}
