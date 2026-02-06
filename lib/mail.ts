import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465 (SSL), false for other ports
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export async function sendVerificationEmail(email: string, code: string) {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Vérifiez votre compte - Florelle Beauty',
            text: `Bienvenue chez Florelle.\n\nMerci de vous être inscrit. Votre code de vérification est : ${code}\n\nCe code expire dans 15 minutes.`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Vérification de compte</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f9f9f9;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden;">
                    <!-- Header with Logo -->
                    <tr>
                        <td align="center" style="padding: 40px 0; background-color: #ffffff; border-bottom: 2px solid #f0f0f0;">
                            <img src="https://florelle.ma/logo.png" alt="Florelle Beauty" width="150" style="display: block; width: 150px; height: auto;">
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h1 style="color: #1a1a1a; font-size: 24px; margin: 0 0 20px 0; text-align: center; font-weight: 300;">Bienvenue chez <span style="font-weight: 600; color: #d4a373;">Florelle</span></h1>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 30px;">
                                Merci de rejoindre notre communauté beauté. Pour sécuriser votre compte et commencer vos achats, veuillez utiliser le code ci-dessous :
                            </p>
                            
                            <div style="background-color: #f8f5f2; border: 1px solid #eaddcf; border-radius: 6px; padding: 20px; text-align: center; margin: 0 auto 30px auto; width: fit-content;">
                                <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #1a1a1a; display: block;">${code}</span>
                            </div>
                            
                            <p style="color: #999999; font-size: 14px; text-align: center; margin-top: 0;">
                                ⏳ Ce code expire dans 15 minutes.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #1a1a1a; padding: 20px; text-align: center;">
                            <p style="color: #ffffff; font-size: 14px; margin: 0;">&copy; ${new Date().getFullYear()} Florelle Beauty. Tous droits réservés.</p>
                            <div style="margin-top: 10px;">
                                <a href="https://florelle.ma" style="color: #d4a373; text-decoration: none; font-size: 14px; margin: 0 10px;">Visiter le site</a>
                                <a href="https://florelle.ma/contact" style="color: #d4a373; text-decoration: none; font-size: 14px; margin: 0 10px;">Nous contacter</a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
            `,
        });
        console.log(`Email de vérification envoyé à ${email}`);
        return { success: true };
    } catch (error) {
        console.error('Erreur envoi email:', error);
        return { success: false, error };
    }
}
