import React, { useEffect, useState } from "react";
import Hero from "./Components/Hero";
import Navbar from "./Components/Navbar";
import OfflineScreen from "./Components/OfflineScreen";
import FeatureGrid from "./Components/FeatureGrid";
import useOnlineStatus from "./hooks/useOnlineStatus";
import features from "./data/features.json";
import { authenticateUser } from "./utils/auth"
import { registerPasskey } from "./utils/registerPasskey";

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const isOnline = useOnlineStatus();

useEffect(() => {
  async function initAuth() {
    const hasPasskey = localStorage.getItem("passkey-registered");

    if (!hasPasskey) {
      const registered = await registerPasskey();
      if (registered) {
        localStorage.setItem("passkey-registered", "true");
      }
    } else {
      await authenticateUser();
    }
  }

  initAuth();
}, []);

  // Capture install prompt
  useEffect(() => {
    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
    };
  }, []);

  // Install handler
  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  if (!isOnline) return <OfflineScreen />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Navbar deferredPrompt={deferredPrompt} onInstall={handleInstall} />

      <Hero deferredPrompt={deferredPrompt} onInstall={handleInstall} />

      <FeatureGrid features={features} />

      <footer className="text-center text-gray-400 mt-24 pb-8">
        © 2026 Simple PWA Demo
      </footer>
    </div>
  );
}

export default App;
