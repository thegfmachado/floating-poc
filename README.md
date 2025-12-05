# 🚀 Floating-PoC

Proof-of-concept demonstrating a floating UI component that can be anchored either to a DOM element (e.g. button, input) or to a text caret inside an input/textarea — built with **vanilla HTML + JS** for controls/anchors and **React + TypeScript + Popper.js** for the floating overlay.

It’s designed as a minimal, decoupled “floating component engine” — a base for tooltips, AI-suggestions, autocompletes, contextual menus, etc.

## 💡 Motivation

Often apps need a floating panel (tooltip / suggestion list / menu) that:

- can anchor to a widget (button, input, etc.), **or**
- to the current caret position inside a text input or textarea

This PoC shows a clean separation:

- The **anchor and controls live outside React** — plain HTML + JS.
- React only renders the floating panel, and gets updates via **custom events**.
- Uses **Popper.js (@popperjs/core)** inside React to handle positioning/offset/placement.

You get: decoupled layers, flexible anchoring, caret awareness, minimal overhead.

---

## 📁 Project structure

```
/
  ├─ index.html               ← controls panel + anchors (button / input / textarea)
  ├─ src/
  │    ├─ form-control.ts     ← listens controls panel, updates global form state + emits config events
  │    ├─ anchor-setup.ts     ← attaches events to anchors (hover, input, caret) and emits update events
  │    ├─ event-utils.ts      ← helpers to dispatch custom floating events
  │    ├─ App.tsx             ← mounts React + Floating component
  │    ├─ Floating.tsx        ← React floating component using Popper.js
  │    └─ ...
  └─ README.md
```

---

## 📦 How to run locally

1. Clone the repo
2. Install dependencies
   ```bash
   npm install
   ```
3. Start the dev server
   ```bash
   npm run dev
   ```
4. Open the page in your browser.

---

## 🧩 How it works (data & event flow)

1. The form panel (outside React) maintains a state object:  
   `{ elementType, mode, placement, offset }`.
2. On any change, it dispatches a `"form:config"` CustomEvent.
3. Anchors (button/input/textarea) emit `"floating:update"` when hovered, typed into, or when caret moves.
4. React listens, updates Popper config and anchor rect.
5. Popper.js computes the floating panel’s position.

Result: completely decoupled anchor logic + reactive floating component.

---

## 📌 When to use this pattern

- Floating UI that can be anchored to multiple element types.
- Caret-based positioning for autocomplete / AI suggestions.
- Need to keep anchor outside React (e.g., design systems, host apps).
- Need a simple way to update placement/offset in real time.

---

## ⚠️ Limitations

- No flip/preventOverflow modifiers (can be added).
- No animations.
- Caret tracking is basic (works for simple input/textarea).
- No accessibility layer yet.

---

## 🔄 Possible Improvements

- Add Popper modifiers (flip, preventOverflow).
- Add animations.
- Add accessibility (ARIA, keyboard nav).
- Support contentEditable anchors.
- Make the floating component a reusable library.

---

## 💻 Tech stack

- React + TypeScript
- Popper.js
- Vite
- Vanilla HTML/JS for anchors + form controls

---

## 📜 License

MIT License.
