<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Geist:400,500,600,700&display=swap">
    
    {{-- PWA --}}
    <link rel="manifest" href="/build/manifest.webmanifest">
    <meta name="theme-color" content="#ffffff">

    {{-- iOS support --}}
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="LaravelApp">
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">

    @viteReactRefresh
    @vite(['resources/js/app.jsx', 'resources/css/app.css'])
    @inertiaHead
    <style>
        body {
            font-family: 'Geist', sans-serif;
        }
    </style>
</head>

<body>

    @inertia

</body>

</html>
