const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
require('dotenv').config();

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('📱 Escaneá el código QR');
});

client.on('ready', () => {
    console.log('✅ Bot WhatsApp listo');
});

client.on('message', async (msg) => {
    console.log(`Mensaje recibido de ${msg.from}: ${msg.body}`);
    if (!process.env.WEBHOOK_URL) {
        console.error('❌ WEBHOOK_URL no está configurado en las variables de entorno');
        return;
    }
    const body = msg.body?.trim();
    const from = msg.from;

    try {
        console.log(`Enviando mensaje al webhook: ${body} desde ${from}`);
        await axios.post(process.env.WEBHOOK_URL, {
            Body: body,
            From: from
        });
    } catch (err) {
        console.error('❌ Error enviando al webhook:', err.message);
    }
});

client.initialize();
