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

    const playStore = "https://play.google.com/store/apps/details?id=miscuentas.com.bo.miscuentas";
    const appStore = "https://apps.apple.com/app/id6448075291";
    const appGallery = "https://appgallery.huawei.com/app/CXXXXXXXX";

    const userAgent = navigator.userAgent || "";
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    const isHuawei = /Huawei/i.test(userAgent) && /AppGallery/i.test(userAgent);
    const isAndroid = /Android/i.test(userAgent);

    const store = isIOS ? appStore : isHuawei ? appGallery : playStore;
    setStoreUrl(store);

    const intent = `intent://deep-link-redirect?${params}#Intent;scheme=https;package=miscuentas.com.bo.miscuentas;S.browser_fallback_url=${encodeURIComponent(store)};end`;
    setIntentUrl(intent);

    if (isAndroid) {
      window.location.href = intent;
    } else {
      window.location.href = store;
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