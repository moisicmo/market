// app/routes/deep-link-redirect.tsx
import { useEffect, useState } from "react";

export default function DeepLinkRedirect() {
  const [storeUrl, setStoreUrl] = useState("#");
  const [intentUrl, setIntentUrl] = useState("#");

useEffect(() => {
    const url = new URL(window.location.href);
    const route = url.searchParams.get("route");
    const client = url.searchParams.get("client");
    const params = `route=${route}&client=${client}`;

    const userAgent = navigator.userAgent || "";
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    const isAndroid = /Android/i.test(userAgent);

    if (isIOS || isAndroid) {
        // Manejar el enlace directamente en la app
        window.location.href = `myapp://deep-link-redirect?${params}`;
    } else {
        // Redireccionar a la App Store si no se detecta la app
        const appStoreUrl = "https://apps.apple.com/app/id6448075291";
        window.location.href = appStoreUrl;
    }
}, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-4">
      <h1 className="text-2xl font-bold mb-2">Redirigiendo...</h1>
      <p className="text-gray-600">
        Si no eres redirigido automáticamente,{" "}
        <a href={storeUrl} className="text-blue-600 underline">
          descarga la app aquí
        </a>
        .
      </p>
    </div>
  );
}