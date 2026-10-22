import { describe, it, expect } from 'test-anywhere';
import {
  NUCLEAR_PULSE_MAX_KM_S,
  PILOT_SCENE,
  SHACADOS_PROBE_VARIANT,
  SPEED_OF_LIGHT_KM_S,
  analyzeScene,
  lorentzFactor,
  relativeClosingSpeed,
} from '../examples/first-contact-physics.mjs';

// The numbers asserted here are quoted in
// docs/master-plan/lore/first-contact.md ("Physics check of the pilot").
describe('First Contact pilot scene physics check', () => {
  it('reproduces the 50 second impact window of the scene', () => {
    const result = analyzeScene();
    expect(result.impactSeconds).toBe(50);
    expect(Number(result.launchAt.toFixed(3))).toBe(5.011);
  });

  it('flags the written probe speed as faster than light', () => {
    expect(PILOT_SCENE.probeSpeedKmS > SPEED_OF_LIGHT_KM_S).toBe(true);
    expect(analyzeScene().findings).toEqual([
      'probe speed 500000 km/s is not below the speed of light',
    ]);
  });

  it('accepts the proposed variant with the probe at half the speed of light', () => {
    const result = analyzeScene({
      ...PILOT_SCENE,
      probeSpeedKmS: 0.5 * SPEED_OF_LIGHT_KM_S,
    });
    expect(result.findings).toEqual([]);
    expect(Number(result.interceptAt.toFixed(1))).toBe(14.5);
    expect(Number(result.remainingSeconds.toFixed(1))).toBe(35.5);
    expect(Number(result.deflectFor100KmKmS.toFixed(1))).toBe(2.8);
    expect(Math.round(result.matchSpeedKmS / 1000)).toBe(178);
  });

  it('flags the written object speed as beyond a primitive Shacados drive', () => {
    expect(
      analyzeScene({ ...PILOT_SCENE, driveLimitKmS: NUCLEAR_PULSE_MAX_KM_S })
        .findings
    ).toEqual([
      'probe speed 500000 km/s is not below the speed of light',
      'object speed 40000 km/s exceeds the drive limit of 10000 km/s',
    ]);
  });

  it('accepts the nuclear-pulse Shacados probe variant with a 50 second window', () => {
    const result = analyzeScene(SHACADOS_PROBE_VARIANT);
    expect(result.findings).toEqual([]);
    expect(result.impactSeconds).toBe(50);
    expect(Number(result.interceptAt.toFixed(1))).toBe(7.8);
    expect(Number(result.remainingSeconds.toFixed(1))).toBe(42.2);
    expect(Math.round(result.objectEnergyPerTonneMt)).toBe(12);
    expect(Number(result.deflectFor100KmKmS.toFixed(1))).toBe(2.4);
    expect(Number(result.detectionLightSeconds.toFixed(2))).toBe(1.67);
  });

  it('keeps the light-time and energy facts quoted in the lore', () => {
    const result = analyzeScene();
    expect(Number(result.detectionLightSeconds.toFixed(2))).toBe(6.67);
    expect(Math.round(result.trueDistanceAtDetectionKm / 1000)).toBe(1733);
    expect(Math.round(result.objectEnergyPerTonneMt)).toBe(194);
    expect(Math.round(result.maxCorrelationDistanceKm)).toBe(300);
  });

  it('uses relativistic velocity addition and the Lorentz factor', () => {
    expect(lorentzFactor(0)).toBe(1);
    expect(lorentzFactor(SPEED_OF_LIGHT_KM_S)).toBe(Infinity);
    const c = SPEED_OF_LIGHT_KM_S;
    expect(Math.abs(relativeClosingSpeed(c, c) - c) < 1e-6).toBe(true);
  });
});
