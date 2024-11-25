import { inyectarDatosUsuario, inyectarDatosPruebas } from "./inyeccionHTML";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import fs from "fs";

import { IUser } from "./../../../../../models/user";
import { IResultados } from "./../../../../../models/results";
import path from "path";
import { promises as fsPromises } from "fs";

const rutaHTMLPlantilla = path.resolve(
  process.cwd(),
  "src",
  "app",
  "assets",
  "Plantilla.html"
);

async function generarHTML(
  user: IUser,
  results: IResultados[]
): Promise<string> {
  try {
    const plantillaHTML: string = await fsPromises.readFile(
      rutaHTMLPlantilla,
      "utf8"
    );
    //* Inyectar datos del usuario
    let htmlConDatos: string = inyectarDatosUsuario(plantillaHTML, user);
    htmlConDatos = inyectarDatosPruebas(htmlConDatos, results);
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
    // executablePath: "/tmp/chromium",
    executablePath: await chromium.executablePath(
      `https://github.com/Sparticuz/chromium/releases/download/v129.0.0/chromium-v129.0.0-pack.tar`
    ),
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
    <div style="font-size:10px; background-color: white; text-align:center; width:100%; margin-bottom:15px; display:flex; justify-content: end;z-index: 50;">
      <span style="background-color: white;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
    </div>
  `,
    headerTemplate: header, // Un header vacío. Necesario para que el footer se muestre correctamente.
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

const header = `    <header
      style="text-align: center; margin-bottom: 20px; width: 100%; display: flex; flex-wrap: nowrap; align-items: center;">
      <span style="border: 5px orange solid; width: 100%; height: 0px;"></span>
      <svg width="100%" height="53px" viewBox="0 0 1350 571" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <g id="#fe311eff">
          <path fill="#fe311e" opacity="1.00"
            d=" M 897.44 0.00 L 900.72 0.00 C 902.70 3.16 904.95 6.16 906.75 9.44 C 907.86 11.32 908.85 13.36 910.48 14.88 C 912.19 15.40 913.99 14.83 915.67 14.39 C 916.99 14.01 918.33 13.65 919.66 13.24 C 920.53 13.07 921.41 12.90 922.31 12.72 C 924.63 11.80 927.16 11.98 929.62 11.93 C 929.94 12.61 930.59 13.96 930.92 14.64 C 930.93 15.09 930.97 15.98 930.98 16.43 C 927.41 20.81 923.58 24.97 920.26 29.54 C 920.23 29.74 920.17 30.14 920.13 30.34 C 922.17 35.10 925.72 39.00 928.04 43.62 C 927.99 44.95 928.03 46.29 927.87 47.61 C 926.78 49.60 924.39 48.86 922.57 49.07 C 921.53 48.38 920.51 47.70 919.49 47.02 C 919.00 47.01 918.03 46.98 917.54 46.97 C 916.51 46.32 915.48 45.68 914.46 45.03 C 913.98 45.02 913.01 44.99 912.52 44.97 C 911.46 44.29 910.42 43.63 909.38 42.95 C 905.06 47.02 901.56 51.78 897.55 56.12 C 895.67 55.86 893.24 56.60 892.13 54.62 C 891.77 51.67 891.97 48.69 892.17 45.74 C 893.34 43.17 893.23 40.23 892.85 37.50 C 891.89 35.92 889.95 35.54 888.42 34.75 C 887.41 34.20 886.41 33.63 885.43 33.06 C 884.96 33.04 884.01 32.99 883.53 32.96 C 882.50 32.32 881.47 31.67 880.46 31.03 C 879.95 31.02 878.94 31.00 878.43 30.99 C 877.61 30.18 876.80 29.36 876.00 28.55 C 875.99 27.51 875.99 26.48 876.00 25.44 C 876.80 24.64 877.62 23.84 878.44 23.03 C 879.72 22.98 881.00 22.93 882.31 22.87 C 884.07 22.25 885.89 21.76 887.67 21.15 C 888.61 21.09 889.57 21.04 890.54 20.99 C 892.37 20.07 893.89 18.69 894.55 16.69 C 895.34 12.33 894.94 7.88 894.97 3.48 C 895.77 2.31 896.56 1.13 897.44 0.00 Z" />
        </g>
        <g id="#ff9316ff">
          <path fill="#ff9316" opacity="1.00"
            d=" M 821.61 56.53 C 822.37 53.15 826.09 54.08 828.67 53.94 C 830.62 56.23 832.33 58.74 833.71 61.42 C 834.51 62.84 835.48 64.16 836.29 65.58 C 837.82 68.71 840.17 71.35 841.78 74.45 C 843.81 75.43 846.56 75.39 848.54 74.23 C 849.88 73.99 851.34 74.02 852.53 73.22 C 853.88 72.96 855.41 73.11 856.54 72.14 C 857.50 72.04 858.47 71.95 859.46 71.86 C 860.85 70.64 862.77 71.08 864.46 70.86 C 866.04 69.08 868.08 70.56 869.82 71.18 C 870.72 73.15 871.65 75.41 870.44 77.48 C 868.46 80.15 866.16 82.54 864.27 85.26 C 860.89 87.82 859.36 91.98 855.89 94.42 C 855.86 96.26 856.35 98.01 857.17 99.65 C 858.91 102.64 861.16 105.31 862.71 108.42 C 863.66 110.11 864.83 111.66 865.76 113.36 C 866.63 115.37 867.91 117.27 868.15 119.50 C 866.88 120.63 865.68 121.82 864.55 123.07 C 863.15 123.01 861.73 123.02 860.48 122.33 C 859.06 121.93 857.70 121.35 856.38 120.73 C 854.70 120.08 853.01 119.47 851.38 118.72 C 849.00 117.84 846.58 117.01 844.43 115.63 C 842.88 114.76 841.08 115.03 839.41 114.96 C 836.95 117.94 833.62 120.16 831.66 123.53 C 830.13 125.98 827.37 127.39 826.04 129.99 C 825.57 131.17 824.54 131.83 823.49 132.42 C 821.10 133.53 817.33 133.61 816.61 130.47 C 815.65 128.63 816.02 126.53 816.07 124.55 C 818.71 120.38 815.29 114.63 817.92 110.45 C 817.96 109.10 817.98 107.75 818.01 106.41 C 816.87 105.34 815.75 104.26 814.64 103.17 C 812.82 102.96 811.08 102.29 809.61 101.20 C 807.95 100.52 806.27 99.95 804.62 99.28 C 802.60 98.29 800.44 97.67 798.38 96.81 C 796.34 95.89 794.54 94.52 793.57 92.47 C 792.92 91.47 792.94 90.49 793.63 89.52 C 794.13 87.69 795.68 86.90 797.49 86.69 C 798.72 86.05 800.11 85.98 801.47 85.77 C 802.65 84.97 804.10 85.01 805.47 84.77 C 807.05 83.92 808.94 84.08 810.53 83.23 C 811.87 82.97 813.38 83.07 814.54 82.17 C 815.03 82.09 816.00 81.92 816.49 81.84 C 817.07 81.56 818.23 81.01 818.81 80.73 C 821.26 77.33 818.70 72.78 820.92 69.45 C 821.42 65.17 820.22 60.66 821.61 56.53 Z" />
        </g>
        <g id="#ffec32ff">
          <path fill="#ffec32" opacity="1.00"
            d=" M 936.73 64.52 C 938.78 63.50 941.26 64.01 943.48 64.13 C 945.16 64.26 944.75 66.39 945.28 67.51 C 946.19 69.07 945.72 71.08 946.88 72.53 C 946.94 73.51 947.02 74.49 947.12 75.48 C 948.20 76.54 947.91 78.13 948.19 79.48 C 949.36 80.89 948.89 82.81 949.12 84.48 C 950.59 86.15 949.55 88.59 950.60 90.47 C 951.16 91.83 952.15 92.83 953.53 93.39 C 955.99 94.88 959.33 92.91 961.53 94.94 C 965.12 95.55 969.35 93.87 972.53 95.93 C 974.83 96.13 977.30 95.55 979.46 96.63 C 983.07 97.50 982.00 101.73 981.87 104.48 C 980.25 106.30 977.74 107.45 975.59 108.71 C 974.10 109.43 972.87 110.55 971.44 111.32 C 970.47 111.77 969.51 112.23 968.56 112.68 C 967.11 113.46 965.87 114.56 964.42 115.29 C 962.31 116.21 960.60 117.78 958.54 118.77 C 957.43 120.78 958.16 123.27 958.07 125.47 C 959.23 126.50 958.90 128.13 959.19 129.49 C 960.70 131.21 959.24 133.88 960.89 135.52 C 960.95 136.50 961.02 137.49 961.11 138.48 C 962.85 140.11 961.07 143.02 963.00 144.54 C 963.01 145.88 963.03 147.25 962.39 148.47 C 961.82 149.84 960.84 150.84 959.47 151.36 C 958.45 152.15 957.47 152.12 956.51 151.27 C 953.57 151.25 952.38 148.19 950.02 147.01 C 946.52 144.93 944.49 141.09 941.00 139.00 C 938.80 137.82 937.46 135.63 935.54 134.11 C 933.35 133.35 931.41 134.76 929.56 135.67 C 928.13 136.48 926.87 137.55 925.41 138.30 C 923.31 139.17 921.68 140.83 919.59 141.71 C 918.11 142.45 916.86 143.52 915.44 144.32 C 912.62 145.42 909.64 148.39 906.54 146.36 C 902.46 145.07 903.67 139.34 905.22 136.39 C 906.96 134.05 907.03 130.95 908.78 128.61 C 909.69 126.58 910.29 124.42 911.22 122.39 C 912.25 120.92 912.86 119.22 913.28 117.49 C 914.20 116.52 914.21 115.62 913.32 114.81 C 910.59 112.14 907.99 109.33 905.17 106.77 C 900.88 104.23 897.93 100.07 894.24 96.79 C 892.45 95.62 892.68 93.17 893.62 91.53 C 894.15 90.16 895.14 89.16 896.53 88.62 C 897.77 87.84 899.50 87.57 900.53 88.94 C 903.83 89.06 907.15 88.94 910.47 89.07 C 913.32 91.06 917.20 89.52 920.48 90.05 C 921.36 91.14 922.36 91.24 923.47 90.36 C 924.84 89.84 925.89 88.88 926.28 87.42 C 928.25 84.36 928.95 80.73 930.73 77.59 C 932.49 74.78 933.01 71.42 934.75 68.60 C 935.37 67.23 935.92 65.81 936.73 64.52 Z" />
        </g>
        <g id="#00ccffff">
          <path fill="#00ccff" opacity="1.00"
            d=" M 609.68 96.71 C 628.08 85.77 650.29 80.54 671.56 83.99 C 657.94 91.26 645.02 100.10 634.61 111.59 C 619.90 127.60 609.73 148.11 607.40 169.83 C 599.02 167.97 590.05 167.86 581.95 170.98 C 572.62 174.42 565.13 181.96 561.07 190.96 C 559.17 170.87 563.66 150.19 573.55 132.60 C 581.98 117.59 594.97 105.48 609.68 96.71 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 680.64 84.36 C 700.71 87.80 720.14 96.92 734.47 111.58 C 750.23 127.39 757.76 149.96 757.79 172.01 C 752.71 173.35 747.61 174.65 742.54 176.03 C 744.35 156.62 739.48 136.52 728.76 120.20 C 719.53 106.10 705.72 95.41 690.43 88.56 C 687.21 87.05 683.80 85.97 680.64 84.36 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 874.89 162.82 C 877.18 160.45 881.80 158.60 884.17 161.83 C 885.88 164.83 883.75 168.12 882.15 170.67 C 884.75 168.71 887.58 166.46 891.02 166.49 C 893.59 166.72 894.61 169.85 893.79 172.01 C 892.32 176.09 888.83 178.91 885.77 181.79 C 888.56 180.79 892.76 179.03 894.75 182.23 C 896.03 186.77 892.60 190.71 890.02 194.04 C 881.97 203.36 872.29 211.11 862.53 218.55 C 857.64 221.97 853.25 226.02 848.79 229.96 C 841.23 227.13 837.00 219.45 835.05 212.04 C 834.25 208.52 833.20 204.89 833.42 201.28 C 836.33 198.24 839.56 195.22 840.92 191.10 C 843.36 183.85 843.54 175.91 847.10 169.02 C 848.62 166.26 850.14 163.13 853.03 161.57 C 855.56 160.66 856.56 164.08 856.50 165.97 C 856.34 171.67 855.99 177.39 856.47 183.09 C 862.81 176.52 868.66 169.50 874.89 162.82 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 586.37 176.57 C 600.23 172.02 616.56 180.48 620.63 194.52 C 623.46 203.75 621.34 214.47 614.61 221.52 C 606.58 230.52 592.38 232.92 581.76 227.26 C 572.49 222.62 566.46 212.32 566.97 201.96 C 567.10 190.47 575.35 179.75 586.37 176.57 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 628.96 213.10 C 671.70 201.89 714.47 190.78 757.23 179.62 C 755.40 186.64 753.45 193.63 751.58 200.64 C 700.01 215.48 648.48 230.46 596.91 245.26 C 591.24 245.04 587.29 239.92 583.68 236.06 C 593.31 238.24 603.84 237.50 612.57 232.66 C 620.19 228.41 625.68 221.08 628.96 213.10 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 773.38 226.88 C 790.58 220.22 808.00 213.48 823.36 203.08 C 825.69 215.79 829.13 229.95 839.99 238.16 C 829.26 249.20 816.45 258.57 801.86 263.75 C 795.96 265.72 789.78 267.16 783.53 267.00 C 783.08 253.09 779.02 239.53 773.38 226.88 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 751.40 208.56 C 753.80 207.91 756.46 206.81 758.92 207.93 C 762.37 209.52 763.72 214.35 761.41 217.41 C 759.71 219.77 756.63 220.11 754.07 220.93 C 702.39 235.84 650.73 250.85 599.04 265.77 C 594.39 267.87 589.02 262.73 590.79 258.01 C 591.65 254.33 595.71 253.61 598.80 252.75 C 649.67 238.04 700.54 223.32 751.40 208.56 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 329.10 216.19 C 337.48 214.80 346.91 216.68 352.96 222.99 C 362.61 232.34 361.20 250.42 349.89 257.89 C 343.55 262.34 335.28 263.03 327.84 261.70 C 320.22 260.29 313.32 254.89 310.65 247.55 C 308.61 241.64 308.82 234.96 311.28 229.21 C 314.47 222.18 321.53 217.31 329.10 216.19 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 130.89 219.55 C 141.64 219.47 152.39 219.45 163.13 219.56 C 177.58 262.81 192.42 305.92 206.93 349.14 C 220.16 305.97 233.22 262.74 246.31 219.53 C 262.59 219.47 278.87 219.50 295.14 219.51 C 273.02 282.67 250.93 345.84 228.81 409.00 C 214.69 408.95 200.57 409.09 186.45 408.93 C 173.64 370.24 160.26 331.74 147.26 293.12 C 134.55 331.85 121.62 370.52 108.18 409.00 C 94.39 409.00 80.60 408.98 66.81 409.02 C 44.57 345.86 22.39 282.67 0.20 219.49 C 16.43 219.50 32.66 219.51 48.89 219.49 C 55.41 239.94 61.82 260.43 68.28 280.89 C 75.53 303.13 81.26 325.83 88.11 348.18 C 102.43 305.33 116.66 262.44 130.89 219.55 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 386.73 219.53 C 400.99 219.46 415.24 219.51 429.50 219.50 C 429.54 282.64 429.41 345.78 429.57 408.93 C 415.29 409.10 401.02 408.95 386.75 409.00 C 386.74 345.84 386.77 282.68 386.73 219.53 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 460.73 219.53 C 474.98 219.46 489.24 219.52 503.50 219.50 C 503.53 282.65 503.44 345.80 503.55 408.94 C 489.28 409.07 475.01 408.96 460.75 409.00 C 460.73 345.84 460.78 282.69 460.73 219.53 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 1041.73 219.53 C 1055.98 219.45 1070.24 219.52 1084.50 219.50 C 1084.48 242.25 1084.54 265.00 1084.47 287.75 C 1108.18 266.11 1148.91 267.75 1171.11 290.82 C 1185.92 306.05 1191.40 328.26 1189.76 349.02 C 1188.66 367.35 1180.97 385.79 1166.67 397.71 C 1155.18 407.42 1139.98 412.22 1125.02 411.78 C 1108.82 412.06 1092.39 405.65 1081.58 393.40 C 1080.62 398.59 1079.76 403.80 1078.89 409.00 C 1066.51 409.00 1054.13 409.00 1041.75 409.00 C 1041.73 345.84 1041.78 282.69 1041.73 219.53 M 1109.10 309.14 C 1098.97 310.79 1090.52 318.51 1086.79 327.91 C 1082.07 340.67 1083.62 356.58 1093.29 366.70 C 1105.02 379.31 1127.58 378.94 1139.03 366.12 C 1147.00 357.61 1148.87 344.97 1146.75 333.84 C 1145.14 324.96 1139.56 316.81 1131.62 312.43 C 1124.84 308.62 1116.68 307.72 1109.10 309.14 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 685.96 245.50 C 709.97 238.64 733.87 231.41 757.88 224.58 C 769.34 236.26 774.63 252.49 776.77 268.38 C 778.98 285.25 778.21 302.49 774.68 319.12 C 771.64 336.22 767.72 353.98 757.16 368.18 C 753.84 372.63 749.44 376.15 744.59 378.80 C 743.28 393.34 741.93 407.88 740.49 422.41 C 743.94 422.49 747.55 422.71 750.69 424.34 C 756.61 427.18 759.28 434.61 757.86 440.79 C 756.42 445.91 751.49 449.07 746.72 450.71 C 739.15 453.60 730.94 452.24 723.06 452.18 C 715.60 451.68 707.97 451.50 700.81 449.13 C 697.05 447.87 695.25 443.75 695.06 440.05 C 694.49 434.97 696.51 430.13 696.81 425.11 C 697.52 416.52 698.44 407.95 699.08 399.36 C 685.69 402.30 671.89 403.10 658.23 402.16 C 657.22 411.77 656.11 421.37 654.98 430.98 C 661.11 430.83 668.09 431.68 672.41 436.53 C 676.44 441.35 676.01 448.35 673.97 453.93 C 672.52 457.49 668.72 459.26 665.25 460.29 C 656.69 462.74 647.70 461.90 638.94 461.46 C 631.41 461.34 622.52 460.99 617.61 454.32 C 612.42 448.33 614.03 440.04 614.17 432.80 C 614.26 423.19 615.35 413.56 614.32 403.97 C 613.89 398.97 613.64 393.96 613.20 388.97 C 608.94 385.88 604.77 382.24 602.79 377.23 C 599.03 367.97 598.19 357.85 597.59 347.96 C 596.45 321.94 598.76 295.89 602.02 270.09 C 626.36 262.99 650.69 255.89 675.02 248.73 C 679.26 257.59 682.76 266.79 685.93 276.08 C 677.01 278.12 668.06 280.03 659.13 282.04 C 652.82 301.59 658.46 322.92 667.79 340.54 C 678.25 337.02 688.69 333.46 699.14 329.90 C 702.51 352.05 703.52 374.59 701.56 396.92 C 705.35 395.45 709.18 394.07 713.05 392.79 C 715.20 370.50 714.44 347.97 711.17 325.83 C 719.31 323.10 727.43 320.30 735.57 317.58 C 737.09 305.20 737.88 292.25 733.76 280.27 C 731.92 275.26 729.10 270.19 724.20 267.61 C 715.56 269.59 706.90 271.54 698.22 273.31 C 694.89 263.73 690.90 254.36 685.96 245.50 M 608.31 343.52 C 604.16 356.84 609.50 372.17 620.45 380.62 C 629.02 387.55 640.49 390.42 651.35 388.87 C 642.48 383.79 632.87 379.64 625.44 372.42 C 616.77 364.86 612.34 353.98 608.31 343.52 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 1263.82 273.41 C 1282.61 270.74 1302.85 272.61 1319.49 282.35 C 1330.39 288.61 1339.04 298.54 1343.87 310.14 C 1349.90 324.22 1350.25 340.04 1347.94 355.00 C 1315.21 355.01 1282.47 354.98 1249.74 355.02 C 1251.03 361.35 1254.72 367.15 1260.05 370.85 C 1268.00 376.77 1278.34 378.23 1288.01 377.68 C 1299.43 376.97 1310.89 373.41 1320.01 366.35 C 1327.48 374.32 1334.86 382.39 1342.39 390.30 C 1328.81 403.11 1310.53 410.15 1292.10 411.92 C 1273.45 413.38 1253.77 411.28 1237.43 401.53 C 1222.49 393.00 1211.74 377.82 1208.20 361.02 C 1203.81 340.61 1206.38 317.90 1218.65 300.57 C 1228.95 285.60 1245.99 276.04 1263.82 273.41 M 1261.68 310.73 C 1254.82 314.91 1250.54 322.60 1250.10 330.57 C 1269.67 330.39 1289.25 330.56 1308.82 330.49 C 1308.26 326.60 1307.54 322.64 1305.59 319.17 C 1302.05 312.63 1295.29 308.29 1288.07 306.92 C 1279.22 305.26 1269.50 305.92 1261.68 310.73 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 567.27 275.28 C 574.60 272.28 582.98 274.61 588.97 279.41 C 585.93 289.97 582.68 300.48 579.70 311.05 C 571.29 310.12 562.86 307.85 555.59 303.43 C 552.63 301.50 549.65 299.36 547.81 296.26 C 552.40 287.88 558.01 279.00 567.27 275.28 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 312.75 275.25 C 327.00 275.26 341.26 275.23 355.51 275.26 C 355.51 319.82 355.46 364.39 355.53 408.96 C 341.27 409.05 327.01 408.98 312.75 409.00 C 312.75 364.41 312.75 319.83 312.75 275.25 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 669.49 289.39 C 687.05 285.57 704.59 281.67 722.13 277.78 C 727.95 287.55 727.89 299.62 726.65 310.55 C 708.67 316.80 690.60 322.85 672.56 328.95 C 667.73 317.04 664.37 303.93 666.55 291.04 C 666.63 289.58 668.50 289.81 669.49 289.39 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 545.51 305.56 C 554.36 313.86 566.31 318.41 578.34 319.13 C 575.19 334.12 572.75 349.27 571.10 364.50 C 560.05 359.84 547.88 354.78 535.70 357.65 C 532.82 339.97 534.49 320.32 545.51 305.56 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 539.43 368.87 C 549.27 363.71 560.64 368.57 569.14 374.20 C 569.26 379.19 570.49 384.31 573.75 388.22 C 578.81 394.58 584.92 400.79 586.43 409.10 C 586.58 410.51 586.94 413.01 584.90 413.21 C 583.30 413.19 581.81 412.44 580.63 411.42 C 576.78 408.15 573.17 404.50 568.73 402.01 C 569.97 409.36 571.11 416.74 572.36 424.09 C 572.80 426.92 573.26 430.15 571.49 432.63 C 570.23 434.44 567.31 434.87 565.77 433.20 C 564.13 431.48 563.43 429.14 562.61 426.98 C 562.86 430.03 562.87 433.38 561.09 436.02 C 559.79 438.06 556.46 437.57 555.31 435.61 C 552.94 432.13 553.23 427.71 552.66 423.72 C 551.77 425.88 551.38 428.81 548.96 429.86 C 545.84 430.78 543.70 427.54 542.88 425.01 C 539.79 416.03 539.93 406.37 539.50 396.99 C 539.46 387.61 540.30 378.23 539.43 368.87 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 929.26 482.23 C 937.39 476.19 949.63 476.45 957.57 482.75 C 955.75 486.20 953.94 489.65 952.11 493.10 C 948.71 491.27 944.02 490.01 940.73 492.68 C 938.59 494.48 939.07 497.52 938.94 500.00 C 943.37 500.00 947.81 500.00 952.25 500.00 C 952.25 504.33 952.25 508.66 952.25 513.00 C 947.83 513.00 943.41 513.00 939.00 513.00 C 939.00 525.33 939.00 537.67 939.00 550.00 C 933.58 550.00 928.16 550.00 922.75 550.00 C 922.76 537.67 922.73 525.35 922.77 513.02 C 919.84 512.99 916.91 512.99 914.00 513.00 C 914.00 508.66 914.00 504.33 914.00 500.00 C 916.91 500.00 919.82 500.00 922.74 499.99 C 922.20 493.50 923.85 486.35 929.26 482.23 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 68.44 479.06 C 86.38 478.92 104.32 479.04 122.25 479.00 C 122.25 483.49 122.24 487.98 122.27 492.47 C 109.77 492.54 97.26 492.48 84.75 492.50 C 84.75 497.50 84.75 502.50 84.75 507.50 C 96.60 507.53 108.44 507.44 120.28 507.54 C 120.23 512.02 120.25 516.51 120.25 521.00 C 108.42 521.00 96.59 521.00 84.75 521.00 C 84.75 526.16 84.75 531.33 84.75 536.50 C 97.59 536.52 110.43 536.45 123.27 536.53 C 123.24 541.02 123.25 545.51 123.25 550.00 C 104.97 549.93 86.69 550.14 68.41 549.90 C 68.58 526.29 68.51 502.67 68.44 479.06 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 385.00 479.00 C 390.33 479.00 395.66 479.00 401.00 479.00 C 401.00 502.67 401.00 526.33 401.00 550.00 C 396.35 550.00 391.71 549.99 387.06 550.00 C 386.75 548.24 386.45 546.49 386.14 544.74 C 381.76 548.70 376.08 551.38 370.06 551.04 C 360.96 551.65 352.04 546.02 348.51 537.65 C 344.32 527.83 345.05 515.41 351.87 506.92 C 359.67 497.17 375.83 496.13 385.03 504.46 C 384.96 495.97 385.02 487.48 385.00 479.00 M 369.21 513.30 C 361.37 516.16 359.70 527.34 364.67 533.43 C 368.49 538.27 376.29 538.78 380.95 534.86 C 386.13 530.45 386.56 521.84 382.40 516.60 C 379.33 512.81 373.70 511.52 369.21 513.30 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 678.00 479.00 C 683.33 479.00 688.66 479.00 694.00 479.00 C 694.00 502.67 694.00 526.33 694.00 550.00 C 689.35 550.00 684.70 549.99 680.06 550.00 C 679.74 548.24 679.45 546.49 679.14 544.74 C 672.30 551.42 661.51 552.81 652.85 549.16 C 645.60 546.02 640.77 538.76 639.48 531.11 C 638.07 522.77 639.38 513.52 644.92 506.86 C 652.74 497.17 668.84 496.15 678.03 504.45 C 677.96 495.97 678.02 487.48 678.00 479.00 M 662.22 513.30 C 654.17 516.24 652.61 527.92 658.08 533.91 C 662.19 538.51 670.04 538.63 674.47 534.40 C 678.96 530.01 679.38 522.34 675.88 517.23 C 672.95 512.98 666.95 511.42 662.22 513.30 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 794.51 487.45 C 799.84 486.85 805.17 486.34 810.49 485.69 C 810.49 490.43 810.54 495.18 810.44 499.93 C 814.54 500.04 818.65 499.99 822.76 500.01 C 822.74 504.33 822.74 508.66 822.76 512.99 C 818.67 513.00 814.58 513.00 810.50 513.00 C 810.54 519.33 810.43 525.66 810.52 532.00 C 810.43 534.22 811.70 536.68 814.04 537.17 C 816.67 538.10 819.34 536.83 821.86 536.08 C 823.07 540.15 824.36 544.20 825.61 548.27 C 819.44 551.09 812.34 551.87 805.75 550.29 C 800.14 548.81 795.89 543.82 795.14 538.10 C 793.94 529.81 794.67 521.40 794.55 513.06 C 791.77 512.99 789.00 512.99 786.24 512.98 C 786.25 508.66 786.25 504.34 786.23 500.02 C 788.98 500.00 791.74 499.99 794.50 500.00 C 794.49 495.81 794.49 491.63 794.51 487.45 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 1025.50 487.46 C 1030.83 486.84 1036.16 486.34 1041.49 485.68 C 1041.50 490.44 1041.53 495.19 1041.46 499.95 C 1045.55 500.03 1049.65 499.99 1053.76 500.01 C 1053.74 504.33 1053.73 508.65 1053.78 512.97 C 1049.68 513.01 1045.59 513.00 1041.50 513.00 C 1041.53 519.30 1041.44 525.61 1041.52 531.92 C 1041.42 534.15 1042.65 536.64 1045.00 537.16 C 1047.64 538.11 1050.33 536.84 1052.86 536.08 C 1054.07 540.15 1055.36 544.21 1056.60 548.28 C 1050.44 551.08 1043.35 551.87 1036.77 550.29 C 1031.14 548.81 1026.88 543.82 1026.14 538.08 C 1024.94 529.81 1025.67 521.40 1025.55 513.07 C 1022.77 512.99 1019.99 512.99 1017.22 512.97 C 1017.26 508.65 1017.25 504.33 1017.24 500.01 C 1019.98 500.00 1022.74 499.99 1025.50 500.00 C 1025.49 495.82 1025.49 491.64 1025.50 487.46 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 147.41 505.05 C 154.75 496.70 169.96 496.58 176.19 506.29 C 182.22 498.85 193.01 497.35 201.71 500.21 C 208.75 502.62 213.28 509.88 213.48 517.16 C 213.57 528.09 213.42 539.02 213.55 549.94 C 208.28 550.05 203.02 549.98 197.75 550.00 C 197.74 541.31 197.75 532.63 197.75 523.95 C 197.72 520.77 197.57 517.22 195.34 514.72 C 192.17 511.40 186.27 512.01 183.45 515.48 C 182.01 517.32 181.21 519.64 181.25 521.98 C 181.23 531.32 181.26 540.66 181.25 550.00 C 175.91 549.99 170.57 550.01 165.24 549.99 C 165.23 540.32 165.30 530.66 165.22 521.00 C 165.37 516.86 162.44 512.42 157.96 512.50 C 152.74 512.12 148.73 517.05 148.79 521.99 C 148.69 531.32 148.77 540.65 148.76 549.99 C 143.43 550.01 138.09 549.99 132.75 550.00 C 132.75 533.33 132.75 516.67 132.75 500.00 C 137.41 500.00 142.07 499.97 146.73 500.03 C 146.96 501.70 147.19 503.37 147.41 505.05 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 239.51 505.22 C 248.56 496.60 264.59 496.65 273.12 505.95 C 279.47 512.71 280.78 522.69 279.28 531.52 C 277.89 539.17 272.91 546.36 265.57 549.32 C 257.43 552.51 247.40 551.57 240.71 545.64 C 240.80 554.09 240.73 562.55 240.75 571.00 L 224.75 571.00 C 224.75 547.33 224.75 523.67 224.75 500.00 C 229.42 500.00 234.09 499.97 238.76 500.05 C 239.01 501.77 239.26 503.49 239.51 505.22 M 248.17 513.24 C 243.06 515.03 240.20 520.76 240.73 525.98 C 240.74 532.36 246.49 538.11 252.98 537.48 C 260.25 537.31 265.27 529.70 263.84 522.84 C 263.32 515.49 254.96 510.46 248.17 513.24 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 304.55 499.66 C 313.33 498.02 323.22 498.82 330.49 504.48 C 340.76 512.42 342.24 528.25 336.11 539.15 C 331.47 547.15 321.97 551.25 312.96 551.04 C 304.77 551.46 296.08 548.67 290.71 542.24 C 284.71 535.12 283.76 524.85 286.20 516.13 C 288.57 507.71 296.07 501.37 304.55 499.66 M 308.21 513.25 C 297.66 517.04 298.73 535.43 310.09 537.25 C 318.32 539.31 325.39 530.64 323.62 522.83 C 323.12 515.58 314.96 510.38 308.21 513.25 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 411.50 515.40 C 414.26 506.93 422.11 500.66 430.85 499.36 C 438.94 498.25 447.94 499.03 454.54 504.31 C 462.26 510.22 464.22 520.79 462.78 529.95 C 450.56 530.10 438.34 529.90 426.12 530.05 C 427.25 533.60 430.21 536.28 433.80 537.20 C 440.05 538.68 446.92 537.54 452.25 533.90 C 455.07 536.89 457.99 539.78 460.71 542.85 C 454.54 548.36 446.27 551.38 438.01 551.04 C 429.81 551.32 421.13 548.59 415.68 542.23 C 409.54 534.91 408.63 524.26 411.50 515.40 M 426.26 520.96 C 433.57 521.02 440.88 521.03 448.20 520.96 C 447.49 518.81 447.03 516.37 445.22 514.83 C 439.19 509.54 427.07 512.05 426.26 520.96 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 493.32 500.20 C 499.87 497.45 507.52 499.27 513.08 503.41 C 511.03 507.39 508.53 511.12 506.48 515.11 C 503.22 513.62 499.69 511.72 496.02 512.79 C 490.79 513.63 487.77 519.08 487.81 524.04 C 487.66 532.69 487.79 541.34 487.76 549.99 C 482.42 550.00 477.08 550.00 471.75 550.00 C 471.75 533.33 471.75 516.67 471.75 500.00 C 476.41 500.00 481.08 500.00 485.74 500.00 C 486.08 501.66 486.38 503.36 486.90 504.99 C 489.09 503.50 490.72 501.13 493.32 500.20 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 521.32 505.31 C 529.95 496.63 545.39 496.82 554.14 505.26 C 554.44 503.49 554.75 501.75 555.07 500.00 C 559.71 500.00 564.35 500.00 569.00 500.00 C 569.00 516.67 569.00 533.33 569.00 550.00 C 564.35 550.00 559.71 549.99 555.07 550.00 C 554.74 548.23 554.44 546.47 554.13 544.71 C 547.32 551.45 536.48 552.80 527.83 549.15 C 520.27 545.87 515.37 538.13 514.33 530.12 C 513.05 521.40 514.92 511.72 521.32 505.31 M 537.25 513.28 C 529.40 516.11 527.69 527.26 532.63 533.38 C 536.42 538.26 544.24 538.79 548.91 534.89 C 554.12 530.49 554.57 521.87 550.41 516.61 C 547.35 512.82 541.74 511.53 537.25 513.28 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 594.53 505.17 C 598.88 501.57 604.14 498.64 609.98 498.96 C 616.08 498.53 622.42 500.98 626.15 505.92 C 629.65 510.46 630.80 516.38 630.76 522.00 C 630.75 531.33 630.74 540.66 630.76 549.99 C 625.42 550.01 620.09 549.99 614.75 550.00 C 614.74 540.97 614.75 531.95 614.75 522.92 C 614.77 519.85 613.98 516.48 611.52 514.44 C 607.79 511.43 601.79 512.05 598.64 515.63 C 596.50 517.85 595.74 521.01 595.75 524.02 C 595.74 532.67 595.75 541.33 595.76 549.99 C 590.42 550.01 585.08 550.00 579.75 550.00 C 579.75 533.33 579.75 516.67 579.75 500.00 C 584.42 500.01 589.09 499.94 593.77 500.07 C 594.01 501.76 594.26 503.46 594.53 505.17 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 722.54 499.66 C 730.67 498.16 739.67 498.68 746.79 503.28 C 761.44 512.54 761.43 537.47 746.78 546.73 C 741.81 549.93 735.81 551.24 729.95 551.04 C 722.08 551.27 713.84 548.38 708.71 542.24 C 702.71 535.13 701.76 524.88 704.19 516.17 C 706.55 507.74 714.05 501.37 722.54 499.66 M 726.24 513.23 C 715.67 516.99 716.70 535.41 728.07 537.25 C 736.26 539.31 743.34 530.73 741.64 522.94 C 741.19 515.66 733.04 510.38 726.24 513.23 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 1139.88 505.38 C 1142.87 501.73 1147.16 498.86 1152.05 498.97 C 1157.13 498.49 1161.94 500.57 1166.06 503.35 C 1164.08 507.39 1161.52 511.11 1159.46 515.11 C 1156.23 513.62 1152.72 511.74 1149.07 512.78 C 1143.80 513.60 1140.76 519.08 1140.81 524.06 C 1140.66 532.70 1140.79 541.35 1140.76 549.99 C 1135.42 550.00 1130.08 550.00 1124.75 550.00 C 1124.75 533.33 1124.75 516.67 1124.75 500.00 C 1129.41 500.00 1134.09 500.00 1138.76 500.00 C 1139.11 501.78 1139.50 503.58 1139.88 505.38 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 1186.48 499.68 C 1194.63 498.16 1203.65 498.67 1210.78 503.28 C 1225.45 512.55 1225.43 537.52 1210.74 546.75 C 1205.81 549.91 1199.85 551.23 1194.04 551.04 C 1186.14 551.29 1177.87 548.40 1172.71 542.24 C 1166.71 535.12 1165.75 524.85 1168.20 516.13 C 1170.57 507.74 1178.03 501.40 1186.48 499.68 M 1190.23 513.24 C 1182.15 516.22 1180.61 527.95 1186.10 533.97 C 1189.66 537.96 1196.19 538.61 1200.59 535.62 C 1206.13 531.92 1207.17 523.74 1204.07 518.14 C 1201.49 513.35 1195.24 511.26 1190.23 513.24 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 832.24 500.01 C 837.57 499.99 842.91 500.00 848.25 500.00 C 848.29 509.66 848.16 519.33 848.30 528.99 C 848.35 533.90 852.89 538.30 857.90 537.43 C 863.17 537.09 866.74 531.90 866.73 526.91 C 866.79 517.94 866.72 508.97 866.75 500.00 C 872.08 500.00 877.42 499.99 882.76 500.01 C 882.74 516.67 882.75 533.33 882.76 549.99 C 878.12 550.01 873.49 549.97 868.86 550.03 C 868.55 548.29 868.24 546.54 867.97 544.81 C 862.10 550.81 852.88 552.50 845.02 550.03 C 839.18 548.04 834.82 542.85 833.28 536.96 C 831.88 532.44 832.28 527.68 832.25 523.03 C 832.24 515.35 832.26 507.68 832.24 500.01 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 959.24 500.01 C 964.57 499.99 969.91 500.00 975.25 500.00 C 975.30 509.66 975.16 519.33 975.30 528.99 C 975.42 533.18 978.69 537.33 983.07 537.45 C 988.67 538.15 993.45 533.15 993.67 527.76 C 993.87 518.51 993.68 509.25 993.75 500.00 C 999.08 500.00 1004.42 499.99 1009.76 500.01 C 1009.75 516.67 1009.74 533.33 1009.76 549.99 C 1005.12 550.01 1000.47 549.99 995.83 550.00 C 995.54 548.27 995.24 546.53 994.97 544.80 C 986.43 553.69 969.24 553.56 962.65 542.43 C 960.22 538.45 959.20 533.72 959.24 529.09 C 959.25 519.40 959.26 509.71 959.24 500.01 Z" />
          <path fill="#00ccff" opacity="1.00"
            d=" M 1063.24 500.01 C 1068.57 499.99 1073.91 500.00 1079.25 500.00 C 1079.29 509.65 1079.17 519.31 1079.30 528.96 C 1079.41 533.15 1082.67 537.33 1087.08 537.45 C 1092.70 538.15 1097.47 533.11 1097.68 527.71 C 1097.86 518.48 1097.68 509.23 1097.75 500.00 C 1103.08 500.00 1108.42 499.98 1113.77 500.02 C 1113.74 516.67 1113.75 533.33 1113.76 549.99 C 1109.11 550.00 1104.47 549.99 1099.84 550.01 C 1099.54 548.27 1099.24 546.53 1098.97 544.80 C 1090.73 553.31 1074.54 553.65 1067.42 543.58 C 1064.41 539.39 1063.19 534.14 1063.24 529.04 C 1063.25 519.36 1063.26 509.69 1063.24 500.01 Z" />
        </g>
      </svg>
      <span style="border: 5px orange solid; width: 100%; height: 0px;"></span>
    </header>`;

export { generarHTML, generarPDF };
