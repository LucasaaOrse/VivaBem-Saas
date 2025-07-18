export function generateVerifyEmailHTML(verifyUrl: string) {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; padding: 24px; color: #333;">
      <h2 style="color: #10b981; margin-bottom: 16px;">Confirme seu e-mail</h2>
      <p style="font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
        Clique no botão abaixo para verificar seu endereço de e-mail:
      </p>
      <a href="${verifyUrl}" target="_blank" 
        style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none;
          border-radius: 6px; font-weight: 600; display: inline-block;">
        Verificar E-mail
      </a>
      <p style="margin-top: 32px; font-size: 14px; color: #666;">
        Se você não criou uma conta, pode ignorar este e-mail com segurança.
      </p>
    </div>
  `
}
