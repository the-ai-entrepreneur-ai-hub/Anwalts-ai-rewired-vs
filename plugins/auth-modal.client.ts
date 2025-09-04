import { useAuthModal } from "~/composables/useAuthModal";

export default defineNuxtPlugin(() => {
  if (process.client) {
    const auth = useAuthModal();

    // Expose a global opener for iframe/buttons
    // Usage: window.openAuthModal()
    (window as any).openAuthModal = () => auth.open();
    (window as any).openSignInModal = () => auth.open(); // alias

    // Back-compat and robust postMessage bridge
    window.addEventListener("message", (event: MessageEvent) => {
      try {
        const data: any = (event as any).data;
        const msg = typeof data === "string" ? data : data?.type;

        // Trust same-origin by default; allow extra origins via runtime config
        let isTrustedOrigin = event.origin === window.location.origin || event.origin === "" || event.origin === "null";
        try {
          const runtime = useRuntimeConfig();
          const allowed: string[] | undefined = (runtime as any)?.public?.postMessageAllowedOrigins;
          if (!isTrustedOrigin && Array.isArray(allowed)) {
            isTrustedOrigin = allowed.includes(event.origin);
          }
        } catch {}

        if (isTrustedOrigin && (msg === "openSignInModal" || msg === "openAuthModal")) {
          auth.open();
        }
      } catch {}
    });
  }
});

