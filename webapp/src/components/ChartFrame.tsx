import { useId, useState, type ReactNode } from 'react';

/** Every chart ships with the table behind it. Two reasons: the light-mode aqua
 *  slot sits below 3:1 against the surface (the relief rule requires a table or
 *  visible labels — this gives both), and the people reading this atlas will ask
 *  for the numbers within about ninety seconds. */
export const ChartFrame = ({
  title,
  caption,
  legend,
  table,
  children,
}: {
  title: string;
  caption?: ReactNode;
  legend?: ReactNode;
  table: ReactNode;
  children: ReactNode;
}) => {
  const [mode, setMode] = useState<'chart' | 'table'>('chart');
  const id = useId();

  return (
    <div className="figure">
      <div className="section__head" style={{ marginBottom: 12 }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <span className="topbar__spacer" />
        <div className="toggle" role="group" aria-label={`${title} view`}>
          <button aria-pressed={mode === 'chart'} onClick={() => setMode('chart')}>
            Chart
          </button>
          <button aria-pressed={mode === 'table'} onClick={() => setMode('table')}>
            Table
          </button>
        </div>
      </div>
      {legend && mode === 'chart' && <div style={{ marginBottom: 12 }}>{legend}</div>}
      <div id={id}>{mode === 'chart' ? children : <div className="tablewrap">{table}</div>}</div>
      {caption && <div className="figure__caption">{caption}</div>}
    </div>
  );
};
