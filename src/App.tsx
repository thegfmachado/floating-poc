import { useEffect, useState } from 'react';
import { Floating } from './Floating';
import type { Placement } from '@popperjs/core';
import { getEventAnchor, type FloatingUpdateEventDetail } from './utils/event-utils';
import type { FormUpdateEventDetail } from './controls/form-control';

function Content() {
  return <div className="floating-content">
    ⭐ Floating Element
  </div>;
}

function App() {
  const [anchorRect, setAnchorRect] = useState<DOMRect>(new DOMRect(0, 0, 0, 0));

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'default' | 'caret'>('default');
  const [placement, setPlacement] = useState<Placement>('top');
  const [offset, setOffset] = useState(8);

  useEffect(() => {
    function formConfigEventHandler(event: CustomEvent<FormUpdateEventDetail>) {

      const { mode, placement, offset } = event.detail;

      setMode(mode);
      setPlacement(placement);
      setOffset(offset);
    };

    window.addEventListener("form:config", formConfigEventHandler as EventListener);
    
    return () => {
      window.removeEventListener("form:config", formConfigEventHandler as EventListener);
    }
  }, []);


  useEffect(() => {
    const eventAnchor = getEventAnchor();

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function handleUpdate(event: CustomEvent<FloatingUpdateEventDetail>) {
      const { rect } = event.detail;

      setAnchorRect(rect);
    }

    eventAnchor.addEventListener("floating:show", handleOpen);
    eventAnchor.addEventListener("floating:hide", handleClose);
    eventAnchor.addEventListener("floating:update", handleUpdate as EventListener);

    return () => {
      eventAnchor.removeEventListener("floating:show", handleOpen);
      eventAnchor.removeEventListener("floating:hide", handleClose);
      eventAnchor.removeEventListener("floating:update", handleUpdate as EventListener);
    };
  }, []);

  return (
    <Floating anchorRect={anchorRect} mode={mode} placement={placement} offset={offset} open={open}>
      <Content />
    </Floating>
  );
}

export default App
