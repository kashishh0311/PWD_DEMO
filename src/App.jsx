import React, { useEffect, useState } from "react";
import Hero from "./Components/Hero";
import Navbar from "./Components/Navbar";
import OfflineScreen from "./Components/OfflineScreen";
import FeatureGrid from "./Components/FeatureGrid";
import useOnlineStatus from "./hooks/useOnlineStatus";
import features from "./data/features.json";
import SplashScreen from "./Components/SplashScreen";

function App() {
  // All hooks must be at the top
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const isOnline = useOnlineStatus(); // ✅ Moved before ANY return

  // Splash Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Capture PWA install prompt
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

  // Install button
  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  // Now returns are safe, order does NOT break Hooks
  if (showSplash) return <SplashScreen />;
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
