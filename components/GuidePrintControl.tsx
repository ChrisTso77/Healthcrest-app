'use client';

import { useId, useState } from 'react';

export function GuidePrintControl() {
  const id = useId();
  const [error, setError] = useState('');
  function print() {
    setError('');
    try { window.print(); }
    catch { setError('The print dialog could not be opened. You can try your browser’s Print command.'); }
  }
  return (
    <div className="hc-guide-print-controls">
      <noscript><style>{'.hc-guide-print-controls { display: none; }'}</style></noscript>
      <button type="button" onClick={print} aria-describedby={id + '-help'}>Print this guide</button>
      <p id={id + '-help'}>Print the full guide with its sources. Choose a printer or Save as PDF if your browser offers it.</p>
      {error && <p role="status">{error}</p>}
    </div>
  );
}
