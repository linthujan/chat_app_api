const app = require("./app")
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});

if (process.env.NODE_ENV != 'production') {
    const ngrok = require('@ngrok/ngrok');
    ngrok.connect({ addr: port, authtoken_from_env: true, domain: process.env.NGROK_DOMAIN })
        .then((listener) => console.log(`Ingress established at: ${listener.url()}`));
}