import { useRef, useState } from 'react';
import { Floating } from './Floating';
import type { Placement } from '@floating-ui/react';

function Content() {
  return <div className="floating-content">
    ⭐ Floating Element
  </div>;
}

function App() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'default' | 'caret'>('default');
  const [elementType, setElementType] = useState<'button' | 'input' | 'textarea'>('button');
  const [placement, setPlacement] = useState<Placement>('top');
  const [offset, setOffset] = useState(8);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.target.value.length >= 3) {
      handleOpen();
    } else {
      handleClose();
    }
  }

  const renderElement = () => {
    switch (elementType) {
      case 'button':
        return (
          <button 
            className="demo-button"
            onPointerEnter={handleOpen} 
            onPointerLeave={handleClose} 
            ref={ref as React.RefObject<HTMLButtonElement>}
          >
            Hover here…
          </button>
        );
      case 'input':
        return (
          <input 
            className="demo-input"
            ref={ref as React.RefObject<HTMLInputElement>} 
            placeholder="Type here…" 
            onChange={handleChange}
          />
        );
      case 'textarea':
        return (
          <textarea 
            className="demo-textarea"
            ref={ref as React.RefObject<HTMLTextAreaElement>} 
            placeholder="Type here…"
            onChange={handleChange}
          />
        );
    }
  };

  return (
    <div className="app">
      <div className="demo-container">
        <h2 className="demo-title">Floating Component Demo</h2>
        
        <div className="controls-panel">
          <div className="control-group">
            <div className="control-label">Mode</div>
            <label className="radio-option">
            <input 
                type="radio" 
                value="default" 
                checked={mode === 'default'} 
                onChange={(e) => setMode(e.target.value as 'default')}
              />
              <span>Default</span>
            </label>
            <label className="radio-option">
            <input 
                type="radio" 
                value="caret" 
                checked={mode === 'caret'} 
                onChange={(e) => setMode(e.target.value as 'caret')}
              />
              <span>Caret</span>
            </label>
          </div>
          
          <div className="control-group">
            <label className="control-label" htmlFor="placement-select">Placement</label>
            <select 
              id="placement-select"
              className="control-select"
              value={placement} 
              onChange={(e) => setPlacement(e.target.value as Placement)}
            >
              <option value="top">top</option>
              <option value="top-start">top-start</option>
              <option value="top-end">top-end</option>
              <option value="bottom">bottom</option>
              <option value="bottom-start">bottom-start</option>
              <option value="bottom-end">bottom-end</option>
              <option value="left">left</option>
              <option value="left-start">left-start</option>
              <option value="left-end">left-end</option>
              <option value="right">right</option>
              <option value="right-start">right-start</option>
              <option value="right-end">right-end</option>
            </select>
          </div>
          
          <div className="control-group">
            <label className="control-label" htmlFor="offset-input">
              Offset: {offset}px
            </label>
            <input 
              id="offset-input"
              type="range"
              className="control-range"
              min="0"
              max="50"
              value={offset}
              onChange={(e) => setOffset(Number(e.target.value))}
            />
          </div>
          
          <div className="control-group">
            <div className="control-label">Element Type</div>
            <label className="radio-option">
            <input 
                type="radio" 
                value="button" 
                checked={elementType === 'button'} 
                onChange={(e) => setElementType(e.target.value as 'button')}
              />
              <span>Button</span>
            </label>
            <label className="radio-option">
            <input 
                type="radio" 
                value="input" 
                checked={elementType === 'input'} 
                onChange={(e) => setElementType(e.target.value as 'input')}
              />
              <span>Input</span>
            </label>
            <label className="radio-option">
            <input 
                type="radio" 
                value="textarea" 
                checked={elementType === 'textarea'} 
                onChange={(e) => setElementType(e.target.value as 'textarea')}
              />
              <span>Textarea</span>
            </label>
          </div>
        </div>

        {renderElement()}

        <Floating anchorRef={ref} mode={mode} placement={placement} offset={offset} open={open}>
          <Content />
        </Floating>
      </div>
    </div>
  );
}

export default App
