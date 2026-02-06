import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        // Basic validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Veuillez remplir tous les champs obligatoires.' },
                { status: 400 }
            );
        }

        // Configure transporter with SMTP settings from env
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false, // Allow self-signed certificates if needed
            },
        });

        // Email to Admin (info@florelle.ma)
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: process.env.SMTP_USER, // Send to info@florelle.ma
            replyTo: email, // Allow replying directly to the user
            subject: `[Contact Form] ${subject || 'Nouveau message'} - ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
                    <h2 style="color: #000;">Nouveau message de contact</h2>
                    <p><strong>De:</strong> ${name} (${email})</p>
                    <p><strong>Sujet:</strong> ${subject || 'Aucun sujet'}</p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #d4af37; margin: 20px 0;">
                        <p style="margin: 0; white-space: pre-wrap;">${message}</p>
                    </div>
                    <p style="color: #999; font-size: 12px; margin-top: 30px;">
                        Ce message a été envoyé depuis le formulaire de contact de Florelle.
                    </p>
                </div>
            `,
        });

        return NextResponse.json(
            { message: 'Votre message a été envoyé avec succès.' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Une erreur est survenue lors de l\'envoi du message.' },
            { status: 500 }
        );
    }
}
