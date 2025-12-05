import { getEventAnchor } from "../utils/event-utils";
import { setupButtonAnchor } from "./button";
import { setupInputAndTextareaAnchor } from "./input-textarea";

export function setupAnchors() {
  const eventAnchor = getEventAnchor();

  setupButtonAnchor(eventAnchor);
  setupInputAndTextareaAnchor(eventAnchor);
}