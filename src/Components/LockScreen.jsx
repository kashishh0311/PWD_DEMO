import React from "react";
import OfflineScreen from "./OfflineScreen";
import useOnlineStatus from "../hooks/useOnlineStatus";

export default function LockScreen({ isAuthenticated, isPWA, children }) {
  const isOnline = useOnlineStatus();

  if (isPWA && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      </div>
    );
  }

  if (!isOnline) {
    return <OfflineScreen />;
  }

  return children;
}
