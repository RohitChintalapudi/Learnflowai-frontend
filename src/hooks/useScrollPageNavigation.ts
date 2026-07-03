import { useCallback, useEffect, useRef, useState } from "react";

export function useScrollPageNavigation(totalPages: number, resetKey: string) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const suppressScrollUpdateRef = useRef(false);

  useEffect(() => {
    setCurrentPage(1);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [resetKey]);

  const scrollToPage = useCallback((pageNumber: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const target = container.querySelector<HTMLElement>(
      `[data-page-number="${pageNumber}"]`,
    );
    if (!target) return;

    suppressScrollUpdateRef.current = true;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    setCurrentPage(pageNumber);

    window.setTimeout(() => {
      suppressScrollUpdateRef.current = false;
    }, 600);
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || totalPages < 1) return;

    const updateVisiblePage = () => {
      if (suppressScrollUpdateRef.current) return;

      const pages = container.querySelectorAll<HTMLElement>("[data-page-number]");
      if (!pages.length) return;

      const containerRect = container.getBoundingClientRect();
      let bestPage = 1;
      let bestDistance = Infinity;

      pages.forEach((pageElement) => {
        const pageNumber = Number(pageElement.dataset.pageNumber);
        if (!pageNumber) return;

        const pageRect = pageElement.getBoundingClientRect();
        const distance = Math.abs(pageRect.top - containerRect.top);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestPage = pageNumber;
        }
      });

      setCurrentPage(bestPage);
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateVisiblePage();
        ticking = false;
      });
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    updateVisiblePage();

    return () => container.removeEventListener("scroll", onScroll);
  }, [totalPages, resetKey]);

  return {
    scrollContainerRef,
    currentPage,
    scrollToPage,
  };
}
