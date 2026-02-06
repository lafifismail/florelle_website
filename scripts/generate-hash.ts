import bcrypt from 'bcryptjs';

async function generateHash() {
    const password = 'password123'; // Default reset password
    const hash = await bcrypt.hash(password, 10);
    console.log('🔑 Password:', password);
    console.log('🔒 Hash:', hash);
}

generateHash();
