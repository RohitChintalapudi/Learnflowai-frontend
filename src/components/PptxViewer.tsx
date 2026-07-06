import { useEffect, useRef, useState } from "react";
import { getPptxSlideCount, getPptxSlideTexts } from "../lib/documentPageCount";

interface PptxViewerProps {
  fileUrl: string;
  zoom?: number;
  onLoadSuccess?: (numPages: number) => void;
}

export function PptxViewer({ fileUrl, zoom = 1, onLoadSuccess }: PptxViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [slides, setSlides] = useState<string[][]>([]);
  const onLoadSuccessRef = useRef(onLoadSuccess);

  useEffect(() => {
    onLoadSuccessRef.current = onLoadSuccess;
  }, [onLoadSuccess]);

  useEffect(() => {
    let isMounted = true;

    async function loadPresentation() {
      try {
        setLoading(true);
        setError(null);
        setSlides([]);

        const response = await fetch(fileUrl, { credentials: "include" });
        if (!response.ok) {
          throw new Error(`Failed to fetch presentation (status ${response.status})`);
        }

        const blob = await response.blob();
        if (!isMounted) return;

        const slideCount = await getPptxSlideCount(blob);
        const slideContents = await Promise.all(
          Array.from({ length: slideCount }, (_, index) => getPptxSlideTexts(blob, index)),
        );

        if (!isMounted) return;

        setSlides(slideContents);
        onLoadSuccessRef.current?.(slideCount);
      } catch (err) {
        if (!isMounted) return;
        console.error("Error loading PPTX:", err);
        setError(err instanceof Error ? err.message : "Failed to render presentation");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPresentation();

    return () => {
      isMounted = false;
    };
  }, [fileUrl]);

  return (
    <div className="w-full h-full relative rounded-xl flex flex-col items-center py-8">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="animate-pulse text-stone-500 font-medium p-12">Loading presentation...</div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-red-500 p-12">
          <p className="font-bold text-lg">Failed to render presentation.</p>
          <p className="text-sm mt-2 opacity-80">{error}</p>
        </div>
      )}
      {!loading && !error && (
        <div
          className="w-full flex flex-col items-center gap-8 transition-transform origin-top"
          style={{ transform: `scale(${zoom})` }}
        >
          {slides.map((slideTexts, index) => (
            <div
              key={index + 1}
              data-page-number={index + 1}
              className="w-full max-w-4xl aspect-video bg-white shadow-xl border border-stone-200 dark:border-stone-800 rounded-sm overflow-hidden p-4 sm:p-8"
            >
              {slideTexts.length > 0 ? (
                <div className="space-y-4">
                  {slideTexts.map((text, textIndex) => (
                    <p key={`${index + 1}-${textIndex}`} className="text-stone-900 text-xs sm:text-base md:text-lg leading-relaxed">
                      {text}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-stone-500 text-xs sm:text-sm italic">This slide has no extractable text content.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
