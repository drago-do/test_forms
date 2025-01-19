import "./globals.css";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { StyledEngineProvider } from "@mui/material/styles";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster, toast } from "sonner";
import { metadata } from "./metadata";
import Head from "next/head";
import "material-symbols";
import localFont from "next/font/local";

const materialSymbols = localFont({
  variable: "--font-family-symbols",
  style: "normal",
  src: "./../../node_modules/material-symbols/material-symbols-outlined.woff2",
  display: "block",
  weight: "100 700",
});

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${materialSymbols.variable}`}>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={metadata.openGraph.title} />
        <meta
          property="og:description"
          content={metadata.openGraph.description}
        />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:site_name" content={metadata.openGraph.siteName} />
        <meta property="og:type" content={metadata.openGraph.type} />
        <meta property="og:image" content={metadata.openGraph.images[0].url} />
        <meta
          property="og:image:width"
          content={metadata.openGraph.images[0].width.toString()}
        />
        <meta
          property="og:image:height"
          content={metadata.openGraph.images[0].height.toString()}
        />
        <meta
          property="og:image:alt"
          content={metadata.openGraph.images[0].alt}
        />
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content={metadata.twitter.card} />
        <meta name="twitter:title" content={metadata.twitter.title} />
        <meta
          name="twitter:description"
          content={metadata.twitter.description}
        />
        <meta name="twitter:image" content={metadata.twitter.images[0]} />
      </Head>
      <StyledEngineProvider injectFirst>
        <body>
          <Toaster richColors position="bottom-left" closeButton />
          {children}
          <SpeedInsights />
        </body>
      </StyledEngineProvider>
    </html>
  );
}
