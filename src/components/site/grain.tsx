import * as React from "react";

/**
 * Fixed full-viewport film-grain + vignette overlay.
 * Sits above page content (z-40) but below modals/sheets/dialogs (z-50).
 * Purely decorative — `pointer-events-none` so it never blocks clicks.
 */
export function Grain() {
  return (
    <>
      <div
        aria-hidden="true"
        className="grain-overlay"
        data-testid="grain-overlay"
      />
      <div
        aria-hidden="true"
        className="vignette-overlay"
        data-testid="vignette-overlay"
      />
    </>
  );
}
