export default function usePasskeyAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isAuthenticating = useRef(false);

  const triggerAuth = async () => {
    if (isAuthenticating.current || !isPWA()) return; 
    isAuthenticating.current = true;

    try {
      const credId = localStorage.getItem("passkey-cred-id");

      const result = credId
        ? await authenticateUser()
        : await registerPasskey();

      if (result) {
        setIsAuthenticated(true);
      } else {
        setTimeout(() => {
          isAuthenticating.current = false;
          triggerAuth();
        }, 1000);
      }
    } catch (e) {
      console.error("Auth error:", e);
      setTimeout(() => {
        isAuthenticating.current = false;
        triggerAuth();
      }, 1000);
    }
  };

  useEffect(() => {
    if (isPWA()) triggerAuth();
  }, []);

  useEffect(() => {
    const onVisible = () => {
      // Only trigger if document was hidden and is now visible
      if (document.visibilityState === 'visible' && !isPWA()) return;
      if (document.visibilityState !== 'visible') return;
      
      setIsAuthenticated(false);
      isAuthenticating.current = false;
      setTimeout(triggerAuth, 100);
    };

    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  return { isAuthenticated, triggerAuth, isPWA };
}