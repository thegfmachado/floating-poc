import { state as formState } from "../controls/form-control";
import { clampCaretRectToInput, getCaretRect } from "./floating-utils";


const EVENT_ANCHOR_ID = "event-anchor";

export const FLOATING_UPDATE_EVENT = "floating:update";
export const FLOATING_SHOW_EVENT = "floating:show";
export const FLOATING_HIDE_EVENT = "floating:hide";

export type FloatingUpdateEventDetail = {
  rect: DOMRect;
};

export function getEventAnchor(): HTMLElement {
  const element = document.getElementById(EVENT_ANCHOR_ID);

  if (!element) {
    throw new Error("Event anchor not found.");
  }

  return element;
}

export function dispatchFloatingUpdate(scope: HTMLElement, target: HTMLElement) {
  let referenceRect: DOMRect = target.getBoundingClientRect();

  if (formState.mode === "caret") {
    const caretRect = getCaretRect(target as HTMLInputElement | HTMLTextAreaElement);

    /** 
     * Clamp the caret rect so it never leaves the input/textarea’s visual box.
     * This prevents the floating element from drifting outside or overlapping
     * the anchor when the user types and the text wraps/overflows.
     */
    referenceRect = clampCaretRectToInput(caretRect, target);
  }

  const event = new CustomEvent<FloatingUpdateEventDetail>(FLOATING_UPDATE_EVENT, {
    bubbles: true,
    detail: {
      rect: referenceRect,
    }
  });

  scope.dispatchEvent(event);
}

export function dispatchFloatingShow(scope: HTMLElement) {
  const event = new Event(FLOATING_SHOW_EVENT, { bubbles: true });
  scope.dispatchEvent(event);
}

export function dispatchFloatingHide(scope: HTMLElement) {
  const event = new Event(FLOATING_HIDE_EVENT, { bubbles: true });
  scope.dispatchEvent(event);
}
