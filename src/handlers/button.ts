import { dispatchFloatingShow, dispatchFloatingUpdate, dispatchFloatingHide } from "../utils/event-utils";


export function setupButtonAnchor(eventAnchor: HTMLElement) {
  const btn = document.getElementById("preview-button");

  if (!btn) return;

  btn.addEventListener("pointerenter", () => {
    dispatchFloatingShow(eventAnchor);
    dispatchFloatingUpdate(eventAnchor, btn);
  });

  btn.addEventListener("pointerleave", () => {
    dispatchFloatingHide(eventAnchor);
  });
}
