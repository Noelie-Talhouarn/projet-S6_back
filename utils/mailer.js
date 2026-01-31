import { Resend } from 'resend';

/**
 * Configuration de Resend ✨
 * Un service moderne qui livre vos e-mails poétiques à bon port.
 */
// On initialise Resend avec la clé API stockée dans le .env
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Envoyer un e-mail de réinitialisation de mot de passe
 * @param {string} to - L'adresse de l'utilisateur (Destinataire)
 * @param {string} token - Le jeton de réinitialisation secret
 * @param {string} prenom - Le prénom pour personnaliser l'accueil
 */
export const sendResetPasswordEmail = async (to, token, prenom) => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

  try {
    console.log(`📡 Resend prépare une lueur de secours pour ${to}...`);

    // Envoi de l'e-mail via Resend
    const { data, error } = await resend.emails.send({
      // Si tu n'as pas de domaine personnalisé, Resend utilise onboarding@resend.dev par défaut
      from: "L'Étincelle <contact@noelie-talhouarn.fr>",
      to: [to],
      subject: "Rallumer votre Étincelle ✨",
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #4a4a4a; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
          <h2 style="color: #6c5ce7; text-align: center;">Bonjour ${prenom} ✨</h2>
          <p>Il arrive que l'on oublie le chemin. Pas d'inquiétude, voici une petite lueur pour vous aider à retrouver votre compte.</p>
          <p style="text-align: center; font-style: italic; margin: 20px 0;">"Chaque étincelle est le début d'une nouvelle lumière."</p>
          <p>Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #6c5ce7; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">Rallumer mon Étincelle</a>
          </div>
          <p style="font-size: 0.9em; color: #888;">Ce lien de secours expirera dans une heure. Si vous n'avez pas demandé ce changement, vous pouvez simplement laisser cette lueur s'éteindre.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="text-align: center; color: #a2a2a2; font-size: 0.8em;">L'Étincelle - Réenchanter le quotidien par la pleine conscience.</p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Erreur retournée par Resend :", error);
      throw new Error(`Resend Error: ${error.message}`);
    }

    console.log(`📧 Lueur de secours envoyée avec succès ! (ID: ${data.id})`);
  } catch (error) {
    console.error("❌ Échec de l'expédition de l'e-mail :", error);
    throw new Error(`Erreur d'envoi mail : ${error.message || "Impossible d'envoyer l'email."}`);
  }
};
