import * as dotenv from 'dotenv';
dotenv.config();

async function main() {
    console.log('📧 Testing lib/mail.ts function...');
    console.log(`Host: ${process.env.SMTP_HOST}`);

    // Dynamic import to ensure env vars are loaded first
    const { sendVerificationEmail } = await import('../lib/mail');

    const result = await sendVerificationEmail('admin@florelle.com', '123456');

    if (result.success) {
        console.log('✅ Success!');
    } else {
        console.error('❌ Failed:', result.error);
    }
}

main();
