import { useEffect, useRef } from "react";
import {
  createPopper,
  type Instance as PopperInstance,
  type Placement,
  type VirtualElement
} from "@popperjs/core";

function createVirtualElementFromRect(rect: DOMRect): VirtualElement {
  return {
    getBoundingClientRect: () => rect,
  };
}

type FloatingProps = {
  anchorRect: DOMRect;
  mode?: "default" | "caret";
  placement?: Placement;
  offset?: number;
  open?: boolean;
  children: React.ReactNode;
};

export function Floating({
  anchorRect,
  mode = "default",
  placement = "bottom",
  offset = 8,
  open = true,
  children,
}: FloatingProps) {
  const floatingElementRef = useRef<HTMLDivElement | null>(null);
  const popperInstanceRef = useRef<PopperInstance | null>(null);

  // ------------------------------
  // Cria a instância otimizadamente
  // ------------------------------
  const createPopperInstance = (
    reference: HTMLElement | VirtualElement,
    popperEl: HTMLElement,
    placement: Placement,
    offset: number
  ) => {
    // Sempre destrói antes (mudança de reference = nova instância)
    if (popperInstanceRef.current) {
      popperInstanceRef.current.destroy();
      popperInstanceRef.current = null;
    }

    popperInstanceRef.current = createPopper(reference, popperEl, {
      placement,
      modifiers: [
        {
          name: "offset",
          options: { offset: [0, offset] },
        },
      ],
    });
  };

  useEffect(() => {
    if (!open || !floatingElementRef.current) return;

    const popperEl = floatingElementRef.current;

    const updateFloatingPosition = () => {
      const referenceElement = createVirtualElementFromRect(anchorRect);

      createPopperInstance(referenceElement, popperEl, placement, offset);
    };

    // rAF loop somente para caret mode (alto desempenho sem jumps)
    let rAF = 0;

    const tick = () => {
      updateFloatingPosition();
      rAF = requestAnimationFrame(tick);
    };

    // Default mode → atualiza só 1x por render
    if (mode === "default") {
      updateFloatingPosition();
    } else {
      tick(); // caret mode
    }

    return () => {
      cancelAnimationFrame(rAF);
      if (popperInstanceRef.current) {
        popperInstanceRef.current.destroy();
        popperInstanceRef.current = null;
      }
    };
  }, [anchorRect, mode, placement, offset, open]);

  if (!open) {
    return null;
  }

  return (
    <div ref={floatingElementRef}>
      {children}
    </div>
  );
}
