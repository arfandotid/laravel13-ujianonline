import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { toast } from "sonner";

// ✅ Tangkap event SEBELUM React mount — di level paling atas file ini
window.__pwaInstallPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    window.__pwaInstallPrompt = e;
    // Dispatch custom event agar hook yang sudah mount juga bisa dengar
    window.dispatchEvent(new Event("pwa-installable"));
});

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.jsx", { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});

registerSW({
    registrationOptions: {
        scope: "/",
    },
    onNeedRefresh() {
        toast.info("Update tersedia", {
            description: "Klik refresh untuk memperbarui aplikasi.",
            action: {
                label: "Refresh",
                onClick: () => updateSW(true),
            },
        });
    },

    onOfflineReady() {
        toast.success("Aplikasi siap offline");
    },
});
