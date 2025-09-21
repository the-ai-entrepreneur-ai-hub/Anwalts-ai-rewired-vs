import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin(() => {
  if (process.client) {
    const store = useAuthStore();

    // Expose a global opener for iframe/buttons
    // Usage: window.openAuthModal()
    (window as any).openAuthModal = () => store.open('login');
    (window as any).openSignInModal = () => store.open('login'); // alias
    (window as any).openRegisterModal = () => store.open('register');

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
          store.open('login');
        }
      } catch {}
    });

    // Auto-open modal when auth=required appears in URL
    try {
      const url = new URL(window.location.href)
      if (url.searchParams.get('auth') === 'required') {
        setTimeout(() => store.open('login'), 0)
      }
    } catch {}
  }
});
