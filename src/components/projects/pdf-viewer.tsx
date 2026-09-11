"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export function PdfViewer({ src, pageCount, title }: { src: string; pageCount: number; title: string }) {
  const [page, setPage] = useState(1);
  const [loadFailed, setLoadFailed] = useState(false);
  const [width, setWidth] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Track whichever page sits nearest the viewport's vertical center as the "current" page.
  useEffect(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    const onScroll = () => {
      const viewportCenter = scrollEl.scrollTop + scrollEl.clientHeight / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;
      pageRefs.current.forEach((el, i) => {
        if (!el) return;
        const elCenter = el.offsetTop + el.clientHeight / 2;
        const distance = Math.abs(elCenter - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });
      setPage(closestIndex + 1);
    };
    scrollEl.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => scrollEl.removeEventListener("scroll", onScroll);
  }, [width, pageCount]);

  function goToPage(target: number) {
    const clamped = Math.min(pageCount, Math.max(1, target));
    const el = pageRefs.current[clamped - 1];
    const scrollEl = scrollRef.current;
    if (!el || !scrollEl) return;
    const targetTop = el.offsetTop - (scrollEl.clientHeight - el.clientHeight) / 2;
    scrollEl.scrollTo({ top: targetTop, behavior: "smooth" });
  }

  if (loadFailed) return null;

  return (
    <div className="mt-5">
      <div
        ref={containerRef}
        role="img"
        aria-label={title}
        className="relative aspect-video overflow-hidden rounded-xl border border-[#ebebeb] bg-[#fafafa] dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div ref={scrollRef} className="absolute inset-0 scroll-smooth overflow-y-auto overflow-x-hidden">
          {width && (
            <Document
              file={src}
              onLoadError={() => setLoadFailed(true)}
              suspense={false}
              loading={
                <div className="flex h-full items-center justify-center text-sm text-[#888888] dark:text-zinc-500">
                  불러오는 중...
                </div>
              }
              className="flex flex-col items-center gap-3 py-3"
            >
              {Array.from({ length: pageCount }, (_, i) => (
                <Page
                  key={i + 1}
                  inputRef={(el) => {
                    pageRefs.current[i] = el;
                  }}
                  pageNumber={i + 1}
                  width={width}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  loading={
                    <div className="flex h-full items-center justify-center text-sm text-[#888888] dark:text-zinc-500">
                      불러오는 중...
                    </div>
                  }
                />
              ))}
            </Document>
          )}
        </div>
        <button
          type="button"
          aria-label="이전 페이지"
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
          className="absolute inset-y-0 left-0 flex items-center px-4 text-6xl font-thin leading-none text-[#4d4d4d] transition-colors hover:text-[#171717] disabled:opacity-20 disabled:hover:text-[#4d4d4d] dark:text-zinc-400 dark:hover:text-white dark:disabled:hover:text-zinc-400"
        >
          &lt;
        </button>
        <button
          type="button"
          aria-label="다음 페이지"
          onClick={() => goToPage(page + 1)}
          disabled={page >= pageCount}
          className="absolute inset-y-0 right-0 flex items-center px-4 text-6xl font-thin leading-none text-[#4d4d4d] transition-colors hover:text-[#171717] disabled:opacity-20 disabled:hover:text-[#4d4d4d] dark:text-zinc-400 dark:hover:text-white dark:disabled:hover:text-zinc-400"
        >
          &gt;
        </button>
      </div>
      <p className="mt-3 text-center text-sm tabular-nums text-[#888888] dark:text-zinc-500">
        {page} / {pageCount}
      </p>
      <p className="mt-3 text-center text-sm text-[#888888] dark:text-zinc-500">
        <a href={src} target="_blank" rel="noreferrer" className="underline underline-offset-4">
          새 탭에서 자료 보기
        </a>
      </p>
    </div>
  );
}
