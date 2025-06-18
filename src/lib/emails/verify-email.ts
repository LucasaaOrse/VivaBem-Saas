// lib/emails/verify-email.ts
export function generateVerifyEmailHTML(verifyUrl: string) {
  return `
    <div style="font-family: sans-serif; padding: 20px;">
      <h2>Confirme seu e-mail</h2>
      <p>Clique no botão abaixo para verificar seu endereço de e-mail:</p>
      <a href="${verifyUrl}" style="background-color: #10b981; padding: 10px 20px; color: white; text-decoration: none; border-radius: 5px;">
        Verificar E-mail
      </a>
      <p>Se você não criou uma conta, ignore este e-mail.</p>
    </div>
  `
}
