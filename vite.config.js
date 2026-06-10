import path from "path";
import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/css/app.css", "resources/js/app.jsx"],
            refresh: true,
        }),
        react(),
        tailwindcss(),
        // ─── Progressive Web App ────────────────────────────────────────────
        VitePWA({
            outDir: "public/build",
            buildBase: "/build/",
            scope: "/",

            // "autoUpdate" → SW baru langsung aktif, React component yang
            // menampilkan notifikasi update kepada user.
            registerType: "prompt",

            // Jangan inject script SW otomatis ke HTML Laravel (karena kita
            // pakai Blade template); kita registrasikan manual di app.jsx
            // via virtual:pwa-register/react
            injectRegister: false,

            // File yang selalu di-include dalam precache manifest
            includeAssets: [
                "favicon.ico",
                "icons/apple-touch-icon.png",
                "icons/icon-192x192.png",
                "icons/icon-512x512.png",
            ],

            // ── Web App Manifest ─────────────────────────────────────────
            manifest: {
                name: "AlamKoding",
                short_name: "AlamKoding",
                description:
                    "Starter Code Laravel 13 ReactJSX and Spatie Role Permission",
                theme_color: "#1e40af",
                background_color: "#030712",
                display: "standalone",
                orientation: "portrait-primary",
                scope: "/",
                start_url: "/",
                lang: "id",
                categories: ["utilities", "lifestyle"],
                icons: [
                    {
                        src: "/icons/icon-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        src: "/icons/icon-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "any",
                    },
                    {
                        src: "/icons/icon-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
                screenshots: [],
            },

            // ── Workbox Config ───────────────────────────────────────────
            workbox: {
                // Nama file SW yang di-generate
                swDest: "public/build/sw.js",

                // Glob patterns untuk precache (relative to dist/build output)
                globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,woff}"],

                // Jangan cache halaman offline bawaan Workbox — kita pakai
                // offline.blade.php yang di-serve Laravel
                navigateFallback: "/offline.html",

                // Jangan fallback ke offline untuk:
                // - request API / CSRF / Ziggy routes
                // - asset uploads user
                navigateFallbackDenylist: [
                    /^\/api\//,
                    /^\/sanctum\//,
                    /^\/uploads\//,
                    /^\/_debugbar\//,
                    /^\/horizon\//,
                    /^\/telescope\//,
                ],

                // ── Runtime Caching Strategies ──────────────────────────
                runtimeCaching: [
                    // 1. Vite build assets (JS/CSS dengan hash) → Cache First
                    //    Aman karena nama file berubah setiap build
                    {
                        urlPattern: /\/build\/.*/i,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "vite-assets-cache",
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 365 * 24 * 60 * 60, // 1 tahun
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },

                    // 2. Gambar & icons dari public → Cache First (30 hari)
                    {
                        urlPattern:
                            /\/(?:icons|images|uploads)\/.*\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "images-cache",
                            expiration: {
                                maxEntries: 200,
                                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },

                    // 3. Google Fonts → Stale While Revalidate
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: "StaleWhileRevalidate",
                        options: {
                            cacheName: "google-fonts-stylesheets",
                        },
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "google-fonts-webfonts",
                            expiration: {
                                maxEntries: 30,
                                maxAgeSeconds: 365 * 24 * 60 * 60,
                            },
                            cacheableResponse: {
                                statuses: [0, 200],
                            },
                        },
                    },

                    // 4. API routes → Network Only (JANGAN di-cache)
                    //    Ini melindungi CSRF dan mutasi data
                    {
                        urlPattern: /^.*\/api\/.*/i,
                        handler: "NetworkOnly",
                    },

                    // 5. Sanctum CSRF endpoint → Network Only
                    {
                        urlPattern: /\/sanctum\/csrf-cookie/i,
                        handler: "NetworkOnly",
                    },

                    // 6. Halaman navigasi Inertia (GET) → Network First
                    //    Fallback ke cache jika offline, sehingga masih bisa
                    //    buka halaman yang pernah dikunjungi
                    {
                        urlPattern: ({ request }) =>
                            request.mode === "navigate",
                        handler: "NetworkFirst",
                        options: {
                            cacheName: "inertia-pages-cache",
                            networkTimeoutSeconds: 5,
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 7 * 24 * 60 * 60, // 7 hari
                            },
                            cacheableResponse: {
                                statuses: [200],
                            },
                        },
                    },
                ],

                // Skip SW update untuk saat development
                skipWaiting: false,
                clientsClaim: true,

                // Modes lain yang TIDAK boleh di-cache oleh SW
                // (ini berlaku sebagai filter tambahan di fetch event)
                // POST, PUT, PATCH, DELETE → tidak bisa masuk ke cache
                // karena Workbox secara default hanya cache GET/HEAD
            },

            // Mode development: nonaktifkan SW agar tidak mengganggu HMR
            devOptions: {
                enabled: false,
            },
        }),
        // ────────────────────────────────────────────────────────────────────
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "resources/js"),
        },
    },
    server: {
        watch: {
            usePolling: true,
            ignored: ["**/storage/framework/views/**"],
        },
    },
});
