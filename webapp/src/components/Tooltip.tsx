import { useCallback, useState, type ReactNode } from 'react';

interface TipState {
  x: number;
  y: number;
  content: ReactNode;
}

/** One tooltip per chart. Hit targets are the marks themselves plus padding;
 *  the tooltip follows the pointer and never intercepts it. */
export const useTooltip = () => {
  const [tip, setTip] = useState<TipState | null>(null);

  const show = useCallback((e: { clientX: number; clientY: number }, content: ReactNode) => {
    setTip({ x: e.clientX, y: e.clientY, content });
  }, []);

  const hide = useCallback(() => setTip(null), []);

  const node = tip ? (
    <div
      className="tip"
      role="tooltip"
      style={{
        left: Math.min(tip.x + 14, window.innerWidth - 316),
        top: Math.min(tip.y + 14, window.innerHeight - 120),
      }}
    >
      {tip.content}
    </div>
  ) : null;

  return { show, hide, node };
};

export const TipTitle = ({ children }: { children: ReactNode }) => <div className="tip__title">{children}</div>;

export const TipRow = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="tip__row">
    <span>{label}</span>
    <b>{value}</b>
  </div>
);
