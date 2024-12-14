// Fetch the QR code from the backend
fetch('/generate-qr')
    .then(response => response.json())
    .then(data => {
        const qrCodeUrl = data.qrCodeUrl;
        document.getElementById('qr-code').src = qrCodeUrl;
    });

// Verify the entered TOTP
document.getElementById('verify-button').addEventListener('click', () => {
    const token = document.getElementById('totp-input').value;

    fetch('/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('result').textContent = data.message;
        })
        .catch(error => {
            document.getElementById('result').textContent = 'Invalid TOTP';
        });
});
