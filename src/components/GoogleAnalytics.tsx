import Script from "next/script";
import { headers } from "next/headers";

const GA_ID = "G-3HQ2S17P54";
const PRODUCTION_HOST = "share.canusta.com";

export async function GoogleAnalytics() {
  const host = (await headers()).get("host")?.split(":")[0];
  if (host !== PRODUCTION_HOST) return null;

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
