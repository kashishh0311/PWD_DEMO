export async function registerPasskey() {
  try {
    const publicKey = {
      challenge: crypto.getRandomValues(new Uint8Array(32)),

      rp: {
        name: "PWA Demo",
        id: window.location.hostname
      },

      user: {
        id: crypto.getRandomValues(new Uint8Array(16)),
        name: "user@example.com",
        displayName: "Local User"
      },

      pubKeyCredParams: [
        { type: "public-key", alg: -7 } // ES256
      ],

      authenticatorSelection: {
        authenticatorAttachment: "platform", // 🔥 ONLY this device
        userVerification: "required",        // 🔥 MUST use biometrics or PIN
      },

      timeout: 60000,
      attestation: "none",
    };

    const cred = await navigator.credentials.create({ publicKey });
    return !!cred;
  } catch (e) {
    console.error(e);
    return false;
  }
}
