import { computePosition, offset as offsetMiddleware, type Placement } from '@floating-ui/react';
import { useEffect, useRef } from 'react';

function clampCaretRectToInput(rect: DOMRect, input: HTMLElement): DOMRect {
  const inputRect = input.getBoundingClientRect();

  const x = Math.min(
    Math.max(rect.x, inputRect.left),
    inputRect.right
  );

  const y = Math.min(
    Math.max(rect.y, inputRect.top),
    inputRect.bottom
  );

  return new DOMRect(
    x,
    y,
    rect.width,
    rect.height
  );
}

function getCaretRect(el: HTMLInputElement | HTMLTextAreaElement): DOMRect {
  const selectionStart = el.selectionStart ?? 0;
  const style = window.getComputedStyle(el);
  const inputRect = el.getBoundingClientRect();

  const mirror = document.createElement("div");
  mirror.style.position = "absolute";
  mirror.style.visibility = "hidden";
  mirror.style.pointerEvents = "none";
  mirror.style.overflow = "hidden";

  const properties = [
    "boxSizing",
    "width",
    "height",
    "paddingLeft",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "borderLeftWidth",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "fontStyle",
    "fontVariant",
    "fontWeight",
    "fontStretch",
    "fontSize",
    "fontFamily",
    "lineHeight",
    "textAlign",
    "letterSpacing",
    "whiteSpace",
  ];

  for (const prop of properties) {
    const value = style.getPropertyValue(prop);
    // @ts-expect-error -- CSSStyleDeclaration signature
    if (value) mirror.style[prop] = value;
  }

  mirror.style.whiteSpace = el instanceof HTMLInputElement ? "pre" : "pre-wrap";

  mirror.style.left = `${inputRect.left + window.scrollX}px`;
  mirror.style.top = `${inputRect.top + window.scrollY}px`;

  const value = el.value;
  const before = document.createTextNode(value.slice(0, selectionStart));
  const marker = document.createElement("span");
  const zeroWidthSpace = "\u200b";
  marker.textContent = value.slice(selectionStart, selectionStart + 1) || zeroWidthSpace;

  mirror.appendChild(before);
  mirror.appendChild(marker);

  document.body.appendChild(mirror);
  const markerRect = marker.getBoundingClientRect();
  document.body.removeChild(mirror);

  return new DOMRect(markerRect.x, markerRect.y, markerRect.width, markerRect.height);
}

function createVirtualElementFromRect(rect: DOMRect) {
  return {
    getBoundingClientRect() {
      return rect;
    },
  };
}

interface FloatingProps {
  anchorRef: React.RefObject<HTMLElement | null>;
  mode?: "default" | "caret";
  placement?: Placement;
  offset?: number;
  open?: boolean;
  children: React.ReactNode;
}

export function Floating({ anchorRef, mode = "default", placement = "bottom", offset = 8, open = true, children }: FloatingProps) {
  const floatingElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || !floatingElementRef.current) return;

    const updateFloatingPosition = () => {
      if (!floatingElementRef.current) return;

      const anchorElement = anchorRef.current;
      if (!anchorElement) return;

      let referenceElement: HTMLElement | ReturnType<typeof createVirtualElementFromRect>;

      if (mode === "caret") {
        let rect = getCaretRect(anchorElement as HTMLInputElement | HTMLTextAreaElement);

        /** 
         * Clamp the caret rect so it never leaves the input/textarea’s visual box.
         * This prevents the floating element from drifting outside or overlapping
         * the anchor when the user types and the text wraps/overflows.
         */
        rect = clampCaretRectToInput(rect, anchorElement);
        referenceElement = createVirtualElementFromRect(rect);
      } else {
        referenceElement = anchorElement;
      }

      computePosition(referenceElement, floatingElementRef.current, {
        placement,
        middleware: [offsetMiddleware(offset)]
      })
        .then(({ x, y, strategy }) => {
          if (!floatingElementRef.current) return;

          floatingElementRef.current.style.position = strategy;
          floatingElementRef.current.style.top = `${y}px`;
          floatingElementRef.current.style.left = `${x}px`;
        });
    };

    /**
     * Why caret mode needs BOTH requestAnimationFrame(tick) AND event-based updateFloatingPosition():
     *
     * - Key presses, mouse events, and selection changes fire BEFORE the browser
     *   updates the caret's final position (layout happens on the next animation frame).
     *
     * - Calling updateFloatingPosition() only inside event listeners may read a stale caret rect.
     *   The caret visually moves after layout → one frame later.
     *
     * - The rAF tick runs AFTER layout/paint, so updateFloatingPosition() inside tick() always reads
     *   the correct, final caret position.
     *
     * - Using both gives the best behavior:
     *     - event listeners → immediate response, no visible lag
     *     - rAF tick → accurate final caret position every frame
     *
     * This is the same pattern used by editors like CodeMirror/Slate/ProseMirror
     * to reliably track caret geometry.
     */

    let rAF = 0;

    const tick = () => {
      updateFloatingPosition();
      rAF = requestAnimationFrame(tick);
    };

    tick();

    if (mode === "caret") {
      anchorRef.current?.addEventListener("keyup", updateFloatingPosition);
      document.addEventListener("selectionchange", updateFloatingPosition);
    }

    return () => {
      cancelAnimationFrame(rAF);
      if (mode === "caret") {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        anchorRef.current?.removeEventListener("keyup", updateFloatingPosition);
        document.removeEventListener("selectionchange", updateFloatingPosition);
      }
    };
  }, [anchorRef, mode, placement, offset, open]);

  if (!open) return null;

  return <div id="floating-content-wrapper" ref={floatingElementRef}>{children}</div>;
}
