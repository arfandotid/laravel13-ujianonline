import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Download } from "lucide-react";

export default function PwaInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowBanner(true);
        };
        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") setShowBanner(false);
        setDeferredPrompt(null);
    };

    if (!showBanner) return null;

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md">
            <Alert className="border shadow-lg bg-background">
                <Download className="h-4 w-4" />
                <AlertTitle>Install Aplikasi</AlertTitle>
                <AlertDescription className="mt-2">
                    Install aplikasi ini ke perangkat Anda untuk akses lebih
                    cepat.
                    <div className="flex gap-2 mt-3">
                        <Button size="sm" onClick={handleInstall}>
                            Install
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowBanner(false)}
                        >
                            Nanti
                        </Button>
                    </div>
                </AlertDescription>
            </Alert>
        </div>
    );
}
