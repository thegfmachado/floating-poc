import {
  dispatchFloatingShow,
  dispatchFloatingUpdate,
  dispatchFloatingHide
} from "../utils/event-utils";

export function setupInputAndTextareaAnchor(eventAnchor: HTMLElement) {
  const input = document.getElementById("preview-input") as HTMLInputElement;
  const textarea = document.getElementById("preview-textarea") as HTMLTextAreaElement;

  if (!input || !textarea) return;

  const elements = [input, textarea];

  function shouldShow(el: HTMLInputElement | HTMLTextAreaElement) {
    return el.value.trim().length >= 3;
  }

  function handleUpdate(el: HTMLInputElement | HTMLTextAreaElement) {
    if (!shouldShow(el)) {
      dispatchFloatingHide(eventAnchor);
      return;
    }

    requestAnimationFrame(() => {
      dispatchFloatingShow(eventAnchor);
      dispatchFloatingUpdate(eventAnchor, el);
    });
  }

  for (const el of elements) {

    // Focus → se tiver chars suficientes, mostra
    el.addEventListener("focus", () => {
      handleUpdate(el);
    });

    // Blur → sempre esconde
    el.addEventListener("blur", () => {
      dispatchFloatingHide(eventAnchor);
    });

    // Keyup → caret + conteúdo mudam
    el.addEventListener("keyup", () => {
      handleUpdate(el);
    });

    // Click → caret move
    el.addEventListener("click", () => {
      handleUpdate(el);
    });
  }

  //
  // selectionchange só funciona no document
  //
  document.addEventListener("selectionchange", () => {
    const active = document.activeElement;
    if (active === input || active === textarea) {
      const el = active as HTMLInputElement | HTMLTextAreaElement;
      handleUpdate(el);
    }
  });
}
