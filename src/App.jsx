import React, { useEffect, useState } from "react";
import Hero from "./Components/Hero";
import Navbar from "./Components/Navbar";
import FeatureGrid from "./Components/FeatureGrid";
import Footer from "./Components/Footer";
import features from "./data/features.json";
import usePasskeyAuth from "./hooks/usePasskeyAuth";
import LockScreen from "./Components/LockScreen";

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const { isAuthenticated, isPWA } = usePasskeyAuth();

  // PWA install 
  useEffect(() => {
    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    return () =>
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return (
    <LockScreen isAuthenticated={isAuthenticated} isPWA={isPWA()}>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 text-white">

        {/* Header */}
        <Navbar deferredPrompt={deferredPrompt} onInstall={handleInstall} />

        {/* Main content */}
        <main className="flex-grow">
          <Hero />
          <FeatureGrid features={features} />
        </main>

        {/* Footer section */}
        <Footer />

      </div>
    </LockScreen>
  );
}

export default App;
