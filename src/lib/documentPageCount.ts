import JSZip from "jszip";
import { renderAsync } from "docx-preview";
import { pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const DOCX_RENDER_OPTIONS = {
  className: "docx-document",
  inWrapper: true,
  ignoreWidth: false,
  ignoreHeight: false,
  ignoreFonts: false,
  breakPages: true,
  ignoreLastRenderedPageBreak: false,
  experimental: true,
  trimXmlDeclaration: true,
  debug: false,
} as const;

export const DOCX_PAGE_SELECTOR = ".docx-document-wrapper > section.docx-document";

export function countDocxRenderedPages(container: ParentNode): number {
  return container.querySelectorAll(DOCX_PAGE_SELECTOR).length;
}

export async function getPdfPageCount(blob: Blob): Promise<number> {
  const data = await blob.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data }).promise;
  return pdf.numPages;
}

export async function getDocxPageCount(blob: Blob): Promise<number> {
  const container = document.createElement("div");
  container.style.cssText = "position:fixed;left:-10000px;top:0;visibility:hidden;pointer-events:none;";
  document.body.appendChild(container);

  try {
    await renderAsync(blob, container, undefined, DOCX_RENDER_OPTIONS);
    const pageCount = countDocxRenderedPages(container);
    if (pageCount === 0) {
      throw new Error("DOCX rendered without detectable pages");
    }
    return pageCount;
  } finally {
    document.body.removeChild(container);
  }
}

function getPptxSlidePaths(zip: JSZip): string[] {
  return Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
    .sort((a, b) => {
      const slideNumber = (path: string) => Number(path.match(/slide(\d+)\.xml$/i)?.[1] ?? 0);
      return slideNumber(a) - slideNumber(b);
    });
}

export async function getPptxSlideCount(blob: Blob): Promise<number> {
  const zip = await JSZip.loadAsync(blob);
  const slidePaths = getPptxSlidePaths(zip);
  if (slidePaths.length === 0) {
    throw new Error("No slides found in PPTX file");
  }
  return slidePaths.length;
}

export async function getPptxSlideTexts(blob: Blob, slideIndex: number): Promise<string[]> {
  const zip = await JSZip.loadAsync(blob);
  const slidePaths = getPptxSlidePaths(zip);
  const slidePath = slidePaths[slideIndex];
  if (!slidePath) {
    throw new Error(`Slide ${slideIndex + 1} not found`);
  }

  const xml = await zip.file(slidePath)!.async("text");
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  return Array.from(doc.getElementsByTagName("a:t"))
    .map((node) => node.textContent?.trim() ?? "")
    .filter(Boolean);
}

export async function detectDocumentPageCount(
  fileType: string,
  downloadUrl: string,
): Promise<number> {
  const response = await fetch(downloadUrl, { credentials: "include" });
  if (!response.ok) {
    throw new Error(`Failed to fetch document (status ${response.status})`);
  }

  const blob = await response.blob();

  if (fileType === "pdf") {
    return getPdfPageCount(blob);
  }

  if (fileType === "docx" || fileType === "doc") {
    return getDocxPageCount(blob);
  }

  if (fileType === "pptx" || fileType === "ppt") {
    return getPptxSlideCount(blob);
  }

  throw new Error(`Page count detection is not supported for .${fileType}`);
}
