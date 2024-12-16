// index.js
const express = require('express');
const otplib = require('otplib');
const qrcode = require('qrcode');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Generate a secret for the user
const secret = otplib.authenticator.generateSecret();

app.use(express.static('public')); // Serve static files like HTML and JS
app.use(express.json());

// Endpoint to get the QR code URL
app.get('/generate-qr', (req, res) => {
    const otpauth = otplib.authenticator.keyuri('user', 'TOTP', secret);
    qrcode.toDataURL(otpauth, (err, qrCodeUrl) => {
        if (err) return res.status(500).send('Error generating QR code');
        res.json({ qrCodeUrl });
    });
});

// Endpoint to verify TOTP code
app.post('/verify', (req, res) => {
    const { token } = req.body;
    const isValid = otplib.authenticator.verify({ token, secret });

    if (isValid) {
        res.json({ message: 'TOTP is valid!' });
    } else {
        res.status(400).json({ message: 'Invalid TOTP' });
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
