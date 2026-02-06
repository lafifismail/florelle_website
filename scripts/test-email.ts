import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

console.log('📧 Testing SMTP Configuration...');
console.log(`Host: ${process.env.SMTP_HOST}`);
console.log(`User: ${process.env.SMTP_USER}`);

const transporter = nodemailer.createTransport({
    host: '138.201.165.90', // Using direct IP to bypass DNS propagation
    port: Number(process.env.SMTP_PORT),
    secure: false,
    tls: {
        rejectUnauthorized: false // Allow self-signed certs if IP doesn't match cert name
    },
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function main() {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: process.env.SMTP_USER, // Send to self to test
            subject: 'Test SMTP Florelle',
            text: 'Ceci est un email de test pour vérifier la configuration SMTP.',
            html: '<b>Ceci est un email de test pour vérifier la configuration SMTP.</b>',
        });

        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
}

main();
