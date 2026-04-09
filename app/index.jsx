import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import AnimationHome from "../components/cards/AnimationHome";
import { useAuthContext } from "../context/AuthContext";

const SPLASH_DURATION = 3000;

export default function SplashScreen() {
  const router = useRouter();
  const { loading: authLoading, isLogged } = useAuthContext();

  const [timerDone, setTimerDone] = useState(false);
  const [authDone, setAuthDone]   = useState(false);
  const hasNavigated = useRef(false);

  // Timer del splash
  useEffect(() => {
    const t = setTimeout(() => setTimerDone(true), SPLASH_DURATION);
    return () => clearTimeout(t);
  }, []);

  // Espera a que AuthContext termine de leer el token
  useEffect(() => {
    if (!authLoading) setAuthDone(true);
  }, [authLoading]);

  // Navega cuando AMBOS flags están listos
  useEffect(() => {
    if (!timerDone || !authDone) return;
    if (hasNavigated.current) return;
    hasNavigated.current = true;

    if (isLogged) {
      // Usuario con sesión activa → pantalla de bienvenida del flujo auth
      router.replace("/(auth)/welcome");
    } else {
      // Sin sesión → pantalla de login
      router.replace("/(auth)/login");
    }
  }, [timerDone, authDone, isLogged, router]);

  // Durante toda la animación (y el check de auth) se muestra solo el splash
  return <AnimationHome />;
}
