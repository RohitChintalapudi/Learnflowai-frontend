import { useEffect, useRef, useState } from "react";
import { renderAsync } from "docx-preview";
import { countDocxRenderedPages, DOCX_PAGE_SELECTOR, DOCX_RENDER_OPTIONS } from "../lib/documentPageCount";

interface DocxViewerProps {
  fileUrl: string;
  zoom?: number;
  onLoadSuccess?: (numPages: number) => void;
}

export function DocxViewer({ fileUrl, zoom = 1, onLoadSuccess }: DocxViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const onLoadSuccessRef = useRef(onLoadSuccess);

  useEffect(() => {
    onLoadSuccessRef.current = onLoadSuccess;
  }, [onLoadSuccess]);

  useEffect(() => {
    let isMounted = true;

    async function loadDocx() {
      if (!containerRef.current) return;

      try {
        setLoading(true);
        setError(null);
        containerRef.current.innerHTML = "";

        const response = await fetch(fileUrl, { credentials: "include" });
        if (!response.ok) {
          let errorText = response.statusText;
          try {
            const errJson = await response.json();
            if (errJson.error) errorText = errJson.error;
          } catch {
            // ignore JSON parse errors
          }
          throw new Error("Failed to fetch document: " + errorText);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("text/html")) {
          throw new Error("Received HTML instead of DOCX. The backend URL might be incorrect or returning an error page.");
        }

        const blob = await response.blob();

        if (!isMounted || !containerRef.current) return;

        await renderAsync(blob, containerRef.current, undefined, DOCX_RENDER_OPTIONS);

        if (!isMounted || !containerRef.current) return;

        const pageCount = countDocxRenderedPages(containerRef.current);
        if (pageCount === 0) {
          throw new Error("DOCX rendered without detectable pages");
        }

        const sections = Array.from(containerRef.current.querySelectorAll(DOCX_PAGE_SELECTOR));
        sections.forEach((section, index) => {
          section.setAttribute("data-page-number", String(index + 1));
        });

        onLoadSuccessRef.current?.(pageCount);
      } catch (err) {
        if (!isMounted) return;
        console.error("Error rendering docx:", err);
        const message = err instanceof Error ? err.message : "Failed to render document";
        setError(message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDocx();

    return () => {
      isMounted = false;
    };
  }, [fileUrl]);

  return (
    <div className="w-full min-h-[500px] relative rounded-xl flex flex-col items-stretch py-0">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="animate-pulse text-stone-500 font-medium p-12">Loading DOCX...</div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-red-500 p-12">
          <p className="font-bold text-lg">Failed to render DOCX.</p>
          <p className="text-sm mt-2 opacity-80">{error}</p>
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full docx-wrapper-container flex flex-col items-stretch transition-transform"
        style={{ zoom }}
      />
    </div>
  );
}
