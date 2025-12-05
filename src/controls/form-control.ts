import type { Placement } from "@popperjs/core";

export type FormUpdateEventDetail = {
  elementType: "button" | "input" | "textarea";
  mode: "default" | "caret";
  placement: Placement;
  offset: number;
};

export const state: FormUpdateEventDetail = {
  elementType: "button",
  mode: "default",
  placement: "top",
  offset: 8,
};

const elements = {
  button: document.getElementById("preview-button"),
  input: document.getElementById("preview-input"),
  textarea: document.getElementById("preview-textarea"),
};

const offsetValue = document.getElementById("offsetValue");

function renderElement() {
  // Esconde todos
  Object.values(elements).forEach(el => {
    el.style.display = "none";
  });

  // Mostra só o selecionado
  elements[state.elementType].style.display = "block";
}

function emitConfig() {
  // Dispara um evento global com o estado atual
  window.dispatchEvent(
    new CustomEvent<FormUpdateEventDetail>("form:config", {
      detail: { ...state },
    })
  );
}

export function setupForm() {
  // Element type (button / input / textarea)
  document.querySelectorAll("input[name='elementType']").forEach(radio => {
    radio.addEventListener("change", e => {
      state.elementType = e.target.value;
      renderElement();
      emitConfig();
    });
  });

  // Mode (default / caret)
  document.querySelectorAll("input[name='mode']").forEach(radio => {
    radio.addEventListener("change", e => {
      state.mode = e.target.value;
      emitConfig();
    });
  });

  // Placement
  document.getElementById("placementControl")
    .addEventListener("change", e => {
      state.placement = e.target.value;
      emitConfig();
    });

  // Offset
  document.getElementById("offsetControl")
    .addEventListener("input", e => {
      state.offset = Number(e.target.value);
      offsetValue.textContent = state.offset;
      emitConfig();
    });

  // Render inicial + emitir estado inicial
  renderElement();
  emitConfig();
}
