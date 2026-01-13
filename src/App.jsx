import React, { useEffect, useState } from "react";

function App() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const features = [
    { title: "App Installation", desc: "Install like a mobile app" },
    { title: "Offline Support", desc: "Works without internet" },
    { title: "Push Notifications", desc: "Engage users easily" },
  ];

  // Capture install event
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  // Install app on button click
  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Navbar */}
      <nav className="flex flex-col gap-4 sm:flex-row justify-between items-center px-10 py-6">
        <h1 className="text-2xl font-bold tracking-wide">PWA Demo</h1>

        {deferredPrompt && (
          <button
            onClick={handleInstall}
            className="px-5 py-2 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition"
          >
            Install App
          </button>
        )}
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center mt-20 px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          Progressive Web App
        </h2>
        <p className="text-gray-300 max-w-xl mb-10">
          This is a simple PWA hosted on Vercel with offline support,
          installation, and push notifications.
        </p>

        <div className="flex gap-6 flex-wrap justify-center">
          <button className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition shadow-lg">
            Enable Notifications
          </button>

          {deferredPrompt && (
            <button
              onClick={handleInstall}
              className="px-8 py-4 rounded-xl border border-white hover:bg-white hover:text-black transition shadow-lg"
            >
              Download
            </button>
          )}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-24 px-6">
        {features.map((item, index) => (
          <div
            key={index}
            className="p-8 rounded-2xl bg-slate-700 hover:bg-slate-600 hover:-translate-y-2 transition-all duration-300 shadow-xl"
          >
            <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
            <p className="text-gray-300">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-400 mt-24 pb-8">
        © 2026 Simple PWA Demo
      </footer>
    </div>
  );
}

export default App;
