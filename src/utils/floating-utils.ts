export function clampCaretRectToInput(rect: DOMRect, input: HTMLElement): DOMRect {
  const inputRect = input.getBoundingClientRect();

  const x = Math.min(Math.max(rect.x, inputRect.left), inputRect.right);
  const y = Math.min(Math.max(rect.y, inputRect.top), inputRect.bottom);

  return new DOMRect(x, y, rect.width, rect.height);
}

export function getCaretRect(el: HTMLInputElement | HTMLTextAreaElement): DOMRect {
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
    // @ts-expect-error dynamic CSS assignment
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