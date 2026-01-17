export async function authenticateUser() {
  try {
    const publicKey = {
      challenge: crypto.getRandomValues(new Uint8Array(32)),
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
