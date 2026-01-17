// utils/auth.js
export async function authenticateUser() {
  try {
    const storedCredId = localStorage.getItem("passkey-cred-id");
    
    if (!storedCredId) {
      return false;
    }

    const publicKey = {
      challenge: crypto.getRandomValues(new Uint8Array(32)),
      allowCredentials: [{
        type: "public-key",
        id: Uint8Array.from(atob(storedCredId), c => c.charCodeAt(0))
      }],
      userVerification: "required",
      timeout: 60000,
    };

    const result = await navigator.credentials.get({ publicKey });
    return !!result;
  } catch (error) {
    console.log("Auth failed:", error);
    return false;
  }
}