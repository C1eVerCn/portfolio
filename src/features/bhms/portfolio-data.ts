export const bhmsDataSources = [
  { id: 'nasa', label: 'NASA PCoE', role: 'lifecycle' },
  { id: 'calce', label: 'CALCE', role: 'lifecycle' },
  { id: 'kaggle', label: 'Kaggle Battery', role: 'lifecycle' },
  { id: 'hust', label: 'HUST', role: 'lifecycle' },
  { id: 'matr', label: 'MATR', role: 'lifecycle' },
  {
    id: 'oxford',
    label: 'Oxford Battery Degradation',
    role: 'trajectory-auxiliary',
  },
  { id: 'pulsebat', label: 'PulseBat', role: 'enhancement-only' },
] as const;

export const bhmsLifecycleSeries = [
  { cycle: 0, observed: 1.0 },
  { cycle: 120, observed: 0.978 },
  { cycle: 240, observed: 0.947 },
  { cycle: 360, observed: 0.908 },
  { cycle: 480, observed: 0.854 },
  { cycle: 560, bilstm: 0.813, hybrid: 0.805, lower: 0.782, upper: 0.828 },
  { cycle: 640, bilstm: 0.764, hybrid: 0.747, lower: 0.712, upper: 0.782 },
  { cycle: 720, bilstm: 0.721, hybrid: 0.688, lower: 0.641, upper: 0.735 },
  { cycle: 800, bilstm: 0.687, hybrid: 0.623, lower: 0.552, upper: 0.694 },
] as const;

export const bhmsMarkers = { knee: 538, eol: 642, rul: 162 } as const;

export const bhmsReleaseClaim =
  '当前工程封版保留真实实验边界，不宣称 Hybrid 全面优于 BiLSTM。';

export const bhmsDisplayDataNotice =
  '作品集可视化重建数据，用于复现交互形态，不作为实测性能结论。';
