/**
 * usePdfDownload
 * ─────────────────────────────────────────────────────────────────────────────
 * Generates a PDF from the dashboard using html2canvas + jsPDF.
 *
 * KEY DESIGN DECISION — onclone strategy
 * ───────────────────────────────────────
 * Previous versions patched the live DOM (background colors, display values…)
 * before calling html2canvas.  That caused two user-visible problems:
 *   1. A white "flash" as the page momentarily switches to white.
 *   2. css animations captured mid-run → opacity < 1 → ghostly, transparent look.
 *
 * html2canvas exposes an `onclone(clonedDoc, clonedEl)` callback that runs on
 * a deep clone of the DOM *before* the screenshot is taken.  We patch ONLY the
 * clone — the real page is never touched, so there is zero visual flicker.
 *
 * FIXES APPLIED
 * ─────────────
 *  ① Dark background preserved
 *     backgroundColor: '#0f172a'  matches the dashboard gradient base.
 *     We no longer replace it with white, so cards, gradients and text render
 *     exactly as they look on screen.
 *
 *  ② Opacity / animation bug
 *     We inject a <style> into the *clone* that collapses every animation to
 *     0.001 ms, forcing every element to its final (fully-visible) state before
 *     the screenshot fires.
 *
 *  ③ High resolution
 *     scale: 3  →  3× logical pixels before scaling to PDF units.
 *
 *  ④ Full-page capture (including Plan de Acción below the fold)
 *     windowWidth / windowHeight / width / height all set to scrollWidth /
 *     scrollHeight so html2canvas sees the whole document, not just the viewport.
 *
 *  ⑤ CORS
 *     useCORS: true  loads the DOMIND logo from any origin.
 *
 *  ⑥ No flicker, success modal
 *     The hook exposes isPdfSuccess / handleClosePdfSuccess so the parent can
 *     show a styled success modal instead of a browser alert().
 *
 * INSTALL
 * ───────
 *   npm install html2canvas jspdf
 *
 * USAGE
 * ─────
 *   const { dashboardRef, isGeneratingPdf, isPdfSuccess,
 *           handleDownloadPDF, handleClosePdfSuccess } = usePdfDownload({
 *     contactInfo, evaluationId
 *   });
 *
 * ELEMENT MARKING
 * ───────────────
 *   data-pdf-hide  →  hidden in the clone (buttons, nav, etc.)
 *   data-pdf-show  →  visible only in the clone (PdfHeader brand block)
 */

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export function usePdfDownload({ contactInfo, evaluationId } = {}) {
  const dashboardRef = useRef(null);

  const [isGeneratingPdf,  setIsGeneratingPdf]  = useState(false);
  const [isPdfSuccess,     setIsPdfSuccess]     = useState(false);

  // ── Close success modal ────────────────────────────────────────────────────
  const handleClosePdfSuccess = () => setIsPdfSuccess(false);

  // ── Main capture + PDF generation ─────────────────────────────────────────
  const handleDownloadPDF = async () => {
    const node = dashboardRef.current;
    if (!node || isGeneratingPdf) return;

    setIsGeneratingPdf(true);

    try {
      // ── STEP 1 · Capture the dashboard via html2canvas ─────────────────
      //
      //  onclone(clonedDoc, clonedEl) is called with a deep clone of the
      //  captured element BEFORE the screenshot is taken.  Everything we do
      //  here is invisible to the user — the live page is never touched.
      const canvas = await html2canvas(node, {

        // ── Visual fidelity ─────────────────────────────────────────────
        scale          : 3,         // 3× pixel density → crisp text & SVG
        backgroundColor: "#0f172a", // match the dashboard's dark gradient base
        useCORS        : true,      // load cross-origin logo
        allowTaint     : false,
        logging        : false,

        // ── Full-document capture (including content below the fold) ────
        scrollX      : 0,
        scrollY      : 0,
        windowWidth  : node.scrollWidth,
        windowHeight : node.scrollHeight,
        width        : node.scrollWidth,
        height       : node.scrollHeight,
        x            : 0,
        y            : 0,

        // ── Non-destructive DOM preparation ────────────────────────────
        //
        //  We receive the cloned element (not the real one) and apply every
        //  patch here.  The user sees zero changes on the live page.
        onclone: (clonedDoc, clonedEl) => {

          // ① Kill CSS animations so nothing is caught at opacity < 1 ──
          //   The fadeUp keyframe starts at opacity:0.  If the snapshot
          //   fires while an animation is in-flight, elements render
          //   semi-transparent — the "ghostly" effect.
          const killAnim = clonedDoc.createElement("style");
          killAnim.textContent = `
            *, *::before, *::after {
              animation-duration:        0.001ms !important;
              animation-delay:           0ms     !important;
              animation-iteration-count: 1       !important;
              transition-duration:       0.001ms !important;
              transition-delay:          0ms     !important;
            }
          `;
          clonedDoc.head.appendChild(killAnim);

          // ② Remove navbar padding-top so the PDF starts flush ──────
          clonedEl.style.paddingTop = "0px";

          // ③ Show brand header (data-pdf-show) ──────────────────────
          clonedEl
            .querySelectorAll("[data-pdf-show]")
            .forEach(el => (el.style.display = "block"));

          // ④ Hide UI-only elements (data-pdf-hide) ──────────────────
          clonedEl
            .querySelectorAll("[data-pdf-hide]")
            .forEach(el => (el.style.display = "none"));
        },
      });

      // ── STEP 2 · Build a PDF whose page size matches the canvas exactly ──
      //
      //  Problem with fixed 'a4': if the captured image is shorter than 297 mm
      //  (because the CTA section is ignored), jsPDF shrinks the image to fit,
      //  leaving a large white gap and forcing the reader to zoom in.
      //
      //  Solution: one PDF page whose width × height == canvas dimensions.
      //  No scaling, no empty space, reads at 100 % zoom.
      //
      //  unit: 'px' + hotfixes: ['px_scaling']
      //  ──────────────────────────────────────
      //  By default jsPDF works at 72 DPI, so raw px values would be scaled
      //  ×1.33 internally.  The 'px_scaling' hotfix disables that correction,
      //  making jsPDF treat the format array as literal CSS pixels — the same
      //  unit html2canvas uses.
      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      const pdf = new jsPDF({
        orientation: node.scrollWidth > node.scrollHeight ? "landscape" : "portrait",
        unit       : "px",
        format     : [node.scrollWidth, node.scrollHeight],  // exact canvas dimensions
        hotfixes   : ["px_scaling"],                  // 1 px in == 1 px out
      });

      // Image fills the entire page — no margins, no shrinking
pdf.addImage(imgData, "JPEG", 0, 0, node.scrollWidth, node.scrollHeight); // <--- ¡Y AQUÍ!

      // ── STEP 3 · Trigger download ──────────────────────────────────────
      const safeName = (contactInfo?.name ?? "reporte")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")   // strip accents
        .replace(/\s+/g, "-")
        .toLowerCase();

      const id = evaluationId ?? Date.now();
      pdf.save(`diagnostico-organizacional-${safeName}-${id}.pdf`);

      // ── STEP 4 · Show success modal ────────────────────────────────────
      setIsPdfSuccess(true);

    } catch (err) {
      console.error("[usePdfDownload] Error al generar el PDF:", err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return {
    dashboardRef,
    isGeneratingPdf,
    handleDownloadPDF,
    isPdfSuccess,
    handleClosePdfSuccess,
  };
}