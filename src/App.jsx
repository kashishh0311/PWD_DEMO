import React, { useEffect, useState, useRef } from "react";
import Hero from "./Components/Hero";
import Navbar from "./Components/Navbar";
import OfflineScreen from "./Components/OfflineScreen";
import FeatureGrid from "./Components/FeatureGrid";
import useOnlineStatus from "./hooks/useOnlineStatus";
import features from "./data/features.json";
import { authenticateUser } from "./utils/auth";
import { registerPasskey } from "./utils/registerPasskey";

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isOnline = useOnlineStatus();
  const isAuthenticating = useRef(false);

  // Auto-trigger authentication
  const triggerAuth = async () => {
    if (isAuthenticating.current) return;
    isAuthenticating.current = true;

    try {
      const credId = localStorage.getItem("passkey-cred-id");

      let success;
      if (!credId) {
        success = await registerPasskey();
      } else {
        success = await authenticateUser();
      }

      if (success) {
        setIsAuthenticated(true);
      } else {
        // If failed, try again after a short delay
        setTimeout(() => {
          isAuthenticating.current = false;
          triggerAuth();
        }, 1000);
      }
    } catch (err) {
      console.error("Auth error:", err);
      // Retry on error
      setTimeout(() => {
        isAuthenticating.current = false;
        triggerAuth();
      }, 1000);
    }
  };

  // Initial authentication on mount
  useEffect(() => {
    triggerAuth();
  }, []);

  // Re-authenticate when app comes back to foreground
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !isAuthenticated) {
        isAuthenticating.current = false;
        triggerAuth();
      } else if (document.visibilityState === "visible") {
        // App came back - require auth again
        setIsAuthenticated(false);
        isAuthenticating.current = false;
        setTimeout(triggerAuth, 100);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    const handleInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  // Show offline screen
  if (!isOnline) return <OfflineScreen />;
  
  // Show blank screen while authenticating (popup will appear)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800" />
    );
  }

  // Show main app only when authenticated
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