import { inyectarDatosUsuario } from "./inyeccionHTML";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import fs from "fs";

import { IUser } from "./../../../../../models/user";
import path from "path";
import { promises as fsPromises } from "fs";

const rutaHTMLPlantilla = path.resolve(
  process.cwd(),
  "src",
  "app",
  "assets",
  "Plantilla.html"
);

async function generarHTML(user: IUser): Promise<string> {
  try {
    const plantillaHTML: string = await fsPromises.readFile(
      rutaHTMLPlantilla,
      "utf8"
    );
    //* Inyectar datos del usuario
    const htmlConDatos: string = inyectarDatosUsuario(plantillaHTML, user);
    return htmlConDatos;
  } catch (error) {
    throw new Error(
      `Error al leer la plantilla HTML: ${error.message} Ruta de plantilla ${rutaHTMLPlantilla}`
    );
  }
}

async function generarPDF(HTMLBase: string): Promise<Buffer> {
  console.debug("Launching browser with Puppeteer...");
  // console.log(chromium.executablePath());
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    // executablePath: await chromium.executablePath(),
    executablePath: "/tmp/chromium",
    headless: chromium.headless,
  });

  console.debug("Opening new page...");
  const page = await browser.newPage();

  console.debug("Setting page content...");
  await page.setContent(HTMLBase, { waitUntil: "domcontentloaded" });

  console.debug("Emulating media type as screen...");
  await page.emulateMediaType("screen");

  const pdfOptions: any = {
    format: "letter",
    margin: { top: "20px", right: "20px", bottom: "60px", left: "20px" },
    displayHeaderFooter: true,
    footerTemplate: `
    <div style="font-size:10px; background-color: white; text-align:center; width:100%; margin-bottom:15px; display:flex; justify-content: space-around;z-index: 50;">
      <span style="background-color: white;">Codigo único de Generacion: ${Date.now()}</span>
      <span style="background-color: white;">Fecha: ${new Date().toLocaleString()}</span>
      <span style="background-color: white;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
    </div>
  `,
    headerTemplate: "<p></p>", // Un header vacío. Necesario para que el footer se muestre correctamente.
    printBackground: true,
    preferCSSPageSize: true,
  };

  console.debug("Generating PDF...");
  const pdfBuffer = await page.pdf(pdfOptions);

  console.debug("Closing browser...");
  await browser.close();

  console.debug("PDF generation completed.");
  return pdfBuffer;
}

export { generarHTML, generarPDF };
