import { ImageResponse } from "next/og";
import { PROJECT_TITLE, PROJECT_DESCRIPTION } from "~/lib/constants";
import { readFileSync } from "fs";
import { join } from "path";

export const alt = PROJECT_TITLE;
export const contentType = "image/png";

// Debug logging function
function debugLog(message: string, ...args: any[]) {
  console.log(`[OG Image Debug] ${message}`, ...args);
}

// Function to load font with error handling
async function loadFont(fontPath: string): Promise<Buffer> {
  try {
    debugLog(`Attempting to load font from: ${fontPath}`);
    debugLog(`Current working directory: ${process.cwd()}`);

    // Try to load font synchronously
    const fontData = readFileSync(fontPath);
    debugLog(`Successfully loaded font: ${fontPath}`);
    return fontData;
  } catch (error) {
    debugLog(`Error loading font ${fontPath}:`, error);

    // Fallback to loading from absolute path
    try {
      const absolutePath = join(
        __dirname,
        "..",
        "..",
        "public",
        "fonts",
        fontPath.split("/").pop()!
      );
      debugLog(`Trying absolute path: ${absolutePath}`);
      return readFileSync(absolutePath);
    } catch (fallbackError) {
      debugLog(`Fallback also failed:`, fallbackError);
      throw new Error(`Failed to load font ${fontPath}: ${error}`);
    }
  }
}

// Create reusable options object
let imageOptions: any = null;

// Initialize fonts
async function initializeFonts() {
  if (imageOptions) return imageOptions;

  debugLog("Initializing fonts...");

  try {
    const regularFont = await loadFont(
      join(process.cwd(), "public/fonts/Nunito-Regular.ttf")
    );
    const semiBoldFont = await loadFont(
      join(process.cwd(), "public/fonts/Nunito-SemiBold.ttf")
    );

    imageOptions = {
      width: 1200,
      height: 800,
      fonts: [
        {
          name: "Nunito",
          data: regularFont,
          weight: 400,
          style: "normal",
        },
        {
          name: "Nunito",
          data: semiBoldFont,
          weight: 600,
          style: "normal",
        },
      ],
    };

    debugLog("Fonts initialized successfully");
    return imageOptions;
  } catch (error) {
    debugLog("Font initialization failed:", error);
    throw error;
  }
}

export default async function Image() {
  debugLog("Starting OG image generation");

  const options = await initializeFonts();

  const BACKGROUND_GRADIENT_START = "#4A2C2A"; // Deep roasted coffee
  const BACKGROUND_GRADIENT_END = "#8B593E";   // Rich mocha
  const BACKGROUND_GRADIENT_STYLE = {
    backgroundImage: `linear-gradient(to bottom, ${BACKGROUND_GRADIENT_START}, ${BACKGROUND_GRADIENT_END})`,
    color: "white",
  };

  debugLog("Generating image response");
  /*
this Image is rendered using vercel/satori.

Satori supports a limited subset of HTML and CSS features, due to its special use cases. In general, only these static and visible elements and properties that are implemented.
For example, the <input> HTML element, the cursor CSS property are not in consideration. And you can't use <style> tags or external resources via <link> or <script>.
Also, Satori does not guarantee that the SVG will 100% match the browser-rendered HTML output since Satori implements its own layout engine based on the SVG 1.1 spec.
Please refer to Satori’s documentation for a list of supported HTML and CSS features. https://github.com/vercel/satori#css
*/
  return new ImageResponse(
    (
      <div
        tw="h-full w-full flex flex-col justify-center items-center relative p-12"
        style={BACKGROUND_GRADIENT_STYLE}
      >
        <div tw="flex flex-col items-center gap-8">
          <h1 tw="text-8xl text-center font-semibold tracking-tight">{PROJECT_TITLE}</h1>
          <div tw="w-24 h-1 bg-white/80 rounded-full"/>
          <h3 tw="text-3xl text-center font-normal text-white/90 max-w-[800px]">{PROJECT_DESCRIPTION}</h3>
        </div>
      </div>
    ),
    options
  );
}
