import type { Locale } from "@/content";

export function ModelArchitecture({ locale }: { locale: Locale }) {
  const isZh = locale === "zh";
  const text = isZh ? {
    input: "DomainConditioning",
    inputDetail: "数据域标识与共享时序 token",
    branchA: "xLSTM 分支",
    branchADetail: "递归记忆视角",
    branchB: "Transformer 分支",
    branchBDetail: "全局依赖视角",
    parallel: "并行时序视角",
    fusion: "DominanceSafeFusion",
    fused: "双分支融合",
    safe: "单分支安全保留",
    pool: "TemporalAttentionPooling",
    poolDetail: "把时序表示汇聚为生命周期状态",
    output: "LifecycleDecoder",
    note: "融合层不是强制平均：当一个分支占优时，可保留单分支输出路径。",
  } : {
    input: "DomainConditioning",
    inputDetail: "Domain identity and shared temporal tokens",
    branchA: "xLSTM branch",
    branchADetail: "Recurrent memory view",
    branchB: "Transformer branch",
    branchBDetail: "Global dependency view",
    parallel: "Parallel temporal views",
    fusion: "DominanceSafeFusion",
    fused: "Two-branch fusion",
    safe: "Single-branch safe path",
    pool: "TemporalAttentionPooling",
    poolDetail: "Pools temporal representations into lifecycle state",
    output: "LifecycleDecoder",
    note: "Fusion is not a forced average: a dominant branch can retain a single-branch output path.",
  };

  return (
    <figure className="model-plate model-plate-expanded" data-case-reveal>
      <div className="model-stage model-conditioning" data-model-stage="conditioning">
        <span>01</span><strong>{text.input}</strong><p>{text.inputDetail}</p>
      </div>
      <div className="model-stage model-parallel" data-model-stage="parallel">
        <span>02 · {text.parallel}</span>
        <div className="model-branches">
          <article><strong>{text.branchA}</strong><p>{text.branchADetail}</p></article>
          <article><strong>{text.branchB}</strong><p>{text.branchBDetail}</p></article>
        </div>
      </div>
      <div className="model-stage model-fusion" data-model-stage="fusion">
        <span>03</span><strong>{text.fusion}</strong>
        <div className="fusion-modes"><i data-fusion-mode="fused">{text.fused}</i><i data-fusion-mode="single-branch-safe">{text.safe}</i></div>
      </div>
      <div className="model-stage model-pooling" data-model-stage="pooling">
        <span>04</span><strong>{text.pool}</strong><p>{text.poolDetail}</p>
      </div>
      <div className="model-stage model-decoder" data-model-stage="decoder">
        <span>05</span><strong>{text.output}</strong><p>trajectory · RUL · EOL · knee · uncertainty</p>
      </div>
      <figcaption>{text.note}</figcaption>
    </figure>
  );
}
