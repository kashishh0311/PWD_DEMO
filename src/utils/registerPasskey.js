export async function registerPasskey() {
  try {
    const publicKey = {
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      rp: {
        name: "PWA Demo",
        id: window.location.hostname,
      },
      user: {
        id: crypto.getRandomValues(new Uint8Array(16)),
        name: "demo-user",
        displayName: "Demo User",
      },
      pubKeyCredParams: [
        { type: "public-key", alg: -7 }, // ES256
      ],
      authenticatorSelection: {
        userVerification: "required",
      },
      timeout: 60000,
      attestation: "none",
    };

    const credential = await navigator.credentials.create({ publicKey });
    return !!credential;
  } catch (err) {
    console.error("Passkey registration failed", err);
    return false;
  }
}
