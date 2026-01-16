import React, { useEffect, useState } from "react";
import Hero from "./Components/Hero";
import Navbar from "./Components/Navbar";
import OfflineScreen from "./Components/OfflineScreen";
import FeatureGrid from "./Components/FeatureGrid";
import useOnlineStatus from "./hooks/useOnlineStatus";
import features from "./data/features.json";

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Reusable online/offline hook
  const isOnline = useOnlineStatus();

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

      {/* Features from JSON */}
    <FeatureGrid features={features} />


    {/* footer */}
      <footer className="text-center text-gray-400 mt-24 pb-8">
        © 2026 Simple PWA Demo
      </footer>
    </div>
  );
}

export default App;
