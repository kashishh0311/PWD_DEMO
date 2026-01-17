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
        authenticatorAttachment: "platform",
        userVerification: "required",
      },

      timeout: 60000,
      attestation: "none",
    };

    const cred = await navigator.credentials.create({ publicKey });
    
    if (cred) {
      // ✅ Store the credential ID for future authentications
      const credId = btoa(String.fromCharCode(...new Uint8Array(cred.rawId)));
      localStorage.setItem("passkey-cred-id", credId);
      localStorage.setItem("passkey-registered", "true");
    }
    
    return !!cred;
  } catch (e) {
    console.error("Registration failed:", e);
    return false;
  }
}