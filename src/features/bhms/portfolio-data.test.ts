import { describe, expect, it } from 'vitest';

import {
  bhmsDataSources,
  bhmsDisplayDataNotice,
  bhmsLifecycleSeries,
  bhmsMarkers,
  bhmsReleaseClaim,
} from './portfolio-data';

const observedRows = bhmsLifecycleSeries.filter(
  (point) => 'observed' in point,
);
const lastObservedCycle = observedRows.at(-1)?.cycle ?? Number.NEGATIVE_INFINITY;
const forecastRows = bhmsLifecycleSeries.filter(
  (point) => point.cycle > lastObservedCycle || !('observed' in point),
);

const forecastFields = ['bilstm', 'hybrid', 'lower', 'upper'] as const;

function assertValidForecastRows(rows: readonly object[]) {
  for (const point of rows) {
    for (const field of forecastFields) {
      expect(point).toHaveProperty(field);

      const value: unknown = Reflect.get(point, field);
      expect(typeof value).toBe('number');

      if (typeof value === 'number') {
        expect(Number.isFinite(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1.2);
      }
    }

    const lower: unknown = Reflect.get(point, 'lower');
    const hybrid: unknown = Reflect.get(point, 'hybrid');
    const upper: unknown = Reflect.get(point, 'upper');

    if (
      typeof lower === 'number' &&
      typeof hybrid === 'number' &&
      typeof upper === 'number'
    ) {
      expect(lower).toBeLessThanOrEqual(hybrid);
      expect(hybrid).toBeLessThanOrEqual(upper);
    }
  }
}

describe('BHMS portfolio data', () => {
  it('assigns lifecycle roles to the exact primary source ids', () => {
    expect(
      bhmsDataSources
        .filter((source) => source.role === 'lifecycle')
        .map((source) => source.id),
    ).toEqual(['nasa', 'calce', 'kaggle', 'hust', 'matr']);
  });

  it('assigns auxiliary-only roles to Oxford and PulseBat', () => {
    expect(bhmsDataSources.find((source) => source.id === 'oxford')?.role).toBe(
      'trajectory-auxiliary',
    );
    expect(bhmsDataSources.find((source) => source.id === 'pulsebat')?.role).toBe(
      'enhancement-only',
    );
  });

  it('gives every forecast row a finite and bounded prediction contract', () => {
    expect(observedRows.length).toBeGreaterThan(0);
    expect(forecastRows.length).toBeGreaterThan(0);
    assertValidForecastRows(forecastRows);
  });

  it('keeps lifecycle cycles strictly increasing', () => {
    for (let index = 1; index < bhmsLifecycleSeries.length; index += 1) {
      expect(bhmsLifecycleSeries[index].cycle).toBeGreaterThan(
        bhmsLifecycleSeries[index - 1].cycle,
      );
    }
  });

  it('publishes the exact lifecycle markers', () => {
    expect(bhmsMarkers).toEqual({ knee: 538, eol: 642, rul: 162 });
  });

  it('keeps lifecycle markers within the cycle domain and RUL arithmetically consistent', () => {
    const cycles = bhmsLifecycleSeries.map((point) => point.cycle);

    expect(lastObservedCycle).toBe(480);
    expect(bhmsMarkers.knee).toBeLessThan(bhmsMarkers.eol);
    expect(bhmsMarkers.knee).toBeGreaterThanOrEqual(Math.min(...cycles));
    expect(bhmsMarkers.eol).toBeLessThanOrEqual(Math.max(...cycles));
    expect(bhmsMarkers.rul).toBe(bhmsMarkers.eol - lastObservedCycle);
  });

  it('does not claim Hybrid is comprehensively superior to BiLSTM', () => {
    expect(bhmsReleaseClaim).toContain('不宣称 Hybrid 全面优于 BiLSTM');
  });

  it('does not encode model quality from trajectory height', () => {
    for (const point of forecastRows) {
      expect(point).toHaveProperty('bilstm');
      expect(point).toHaveProperty('hybrid');
    }

    expect(bhmsReleaseClaim).toContain('不宣称 Hybrid 全面优于 BiLSTM');
    expect(bhmsDisplayDataNotice).toContain('不作为实测性能结论');
  });

  it('labels the display data as reconstructed and not a measured performance conclusion', () => {
    expect(bhmsDisplayDataNotice).toContain('作品集可视化重建数据');
    expect(bhmsDisplayDataNotice).toContain('不作为实测性能结论');
  });
});
