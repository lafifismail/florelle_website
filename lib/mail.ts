import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
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
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h1>Bienvenue chez Florelle</h1>
                    <p>Merci de vous être inscrit. Pour valider votre compte, veuillez utiliser le code de vérification ci-dessous :</p>
                    <div style="background-color: #f4f4f4; padding: 15px; text-align: center; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
                        ${code}
                    </div>
                    <p>Ce code expire dans 15 minutes.</p>
                    <p>Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email.</p>
                </div>
            `,
        });
        console.log(`Email de vérification envoyé à ${email}`);
        return { success: true };
    } catch (error) {
        console.error('Erreur envoi email:', error);
        return { success: false, error };
    }
}
