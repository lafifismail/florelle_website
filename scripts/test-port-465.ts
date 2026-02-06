import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

// Force IP and Port 465 for this test
const SMTP_HOST = '138.201.165.90';
const SMTP_PORT = 465;

async function main() {
    console.log(`📧 Testing SMTP on Port ${SMTP_PORT} (SSL/Secure)...`);

    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: true, // MUST be true for port 465
        tls: {
            rejectUnauthorized: false // Still needed because IP != domain in cert
        },
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: process.env.SMTP_USER, // Send to self
            subject: 'Test Port 465',
            text: 'Test connection via Port 465',
        });
        console.log('✅ Success on Port 465!', info.messageId);
    } catch (error) {
        console.error('❌ Failed on Port 465:', error);
    }
}

main();
