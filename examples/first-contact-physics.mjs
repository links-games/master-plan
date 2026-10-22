#!/usr/bin/env node
// Physics check of the First Contact pilot scene
// (docs/case-studies/issue-1/data/first-contact-pilot-scene.md).
//
// The master plan asks that our final simulator be "actually real", so the
// lore is checked the same way a level would be: every number of the scene
// goes through special relativity and simple kinematics. Run:
//
//   node examples/first-contact-physics.mjs            # scene as written
//   node examples/first-contact-physics.mjs 0.5        # probe at 0.5 c
//   node examples/first-contact-physics.mjs shacados   # nuclear-pulse probe
//   node examples/first-contact-physics.mjs binary     # the start systems
//
// Units: km, s, kg, J. One-dimensional approximation along the line from
// the station to the object; the station is at rest at x = 0.

import { pathToFileURL } from 'node:url';

export const SPEED_OF_LIGHT_KM_S = 299792.458;
const JOULES_PER_MEGATON_TNT = 4.184e15;

// Numbers taken verbatim from the pilot scene.
export const PILOT_SCENE = Object.freeze({
  detectionDistanceKm: 2e6,
  objectSpeedKmS: 4e4,
  probeSpeedKmS: 5e5,
  analysisSeconds: 0.01,
  // Manipulators (2.4 s) then gas tanks (1.2 s), in parallel with the
  // 4.5 s sensor installation; then 0.5 s on the rails and a 0.001 s launch.
  refitSequentialSeconds: [2.4, 1.2],
  refitParallelSeconds: 4.5,
  railSeconds: 0.5,
  launchSeconds: 0.001,
  correlationSeconds: 0.002,
  returnSpeedKmS: 250,
});

// Dyson's optimistic nuclear-pulse ("ablation") ship reaches about c/30
// (F. J. Dyson, "Interstellar Transport", Physics Today, October 1968).
// It is the fastest drive the least advanced spacefaring civilization,
// Shacados, could build (docs/master-plan/lore/shacados.md).
export const NUCLEAR_PULSE_MAX_KM_S = 1e4;

// Proposed variant: a crude Shacados nuclear-pulse probe at the drive limit,
// detected at 500,000 km so the scene keeps its 50 second window, and the
// Rayan probe at half the speed of light.
export const SHACADOS_PROBE_VARIANT = Object.freeze({
  ...PILOT_SCENE,
  detectionDistanceKm: 5e5,
  objectSpeedKmS: NUCLEAR_PULSE_MAX_KM_S,
  probeSpeedKmS: 0.5 * SPEED_OF_LIGHT_KM_S,
  driveLimitKmS: NUCLEAR_PULSE_MAX_KM_S,
});

// The start systems (docs/master-plan/lore/first-contact.md): a wide binary
// of Raya's yellow star and Shacados' dimmer orange star. Absolute visual
// magnitudes: the Sun is 4.83; a K dwarf like Shacados' star is about 6.
export const KM_PER_AU = 149597870.7;
const AU_PER_PARSEC = 206264.806;
const SECONDS_PER_DAY = 86400;
export const START_SYSTEMS = Object.freeze({
  separationAu: 2000,
  rayaStar: { massSun: 1, absoluteMagnitude: 4.83 },
  shacadosStar: { massSun: 0.8, absoluteMagnitude: 6 },
  shacadosProbeKmS: NUCLEAR_PULSE_MAX_KM_S,
  rayanProbeKmS: 0.5 * SPEED_OF_LIGHT_KM_S,
});

// Apparent magnitude of a star of the given absolute magnitude.
function apparentMagnitude(absoluteMagnitude, distanceAu) {
  const parsecs = distanceAu / AU_PER_PARSEC;
  return absoluteMagnitude + 5 * Math.log10(parsecs / 10);
}

export function analyzeStartSystems(systems = START_SYSTEMS) {
  const distanceKm = systems.separationAu * KM_PER_AU;
  const days = (seconds) => seconds / SECONDS_PER_DAY;
  return {
    distanceKm,
    lightDays: days(lightTimeSeconds(distanceKm)),
    shacadosProbeDays: days(distanceKm / systems.shacadosProbeKmS),
    rayanProbeDays: days(distanceKm / systems.rayanProbeKmS),
    // Kepler's third law in years, AU and solar masses.
    orbitYears: Math.sqrt(
      systems.separationAu ** 3 /
        (systems.rayaStar.massSun + systems.shacadosStar.massSun)
    ),
    rayaSunSeenFromShacados: apparentMagnitude(
      systems.rayaStar.absoluteMagnitude,
      systems.separationAu
    ),
    shacadosSunSeenFromRaya: apparentMagnitude(
      systems.shacadosStar.absoluteMagnitude,
      systems.separationAu
    ),
  };
}

export function lorentzFactor(speedKmS) {
  const beta = speedKmS / SPEED_OF_LIGHT_KM_S;
  return beta < 1 ? 1 / Math.sqrt(1 - beta * beta) : Infinity;
}

// Relativistic kinetic energy (gamma - 1) m c^2 for one kilogram.
export function kineticEnergyPerKg(speedKmS) {
  const c = SPEED_OF_LIGHT_KM_S * 1000;
  return (lorentzFactor(speedKmS) - 1) * c * c;
}

export function lightTimeSeconds(distanceKm) {
  return distanceKm / SPEED_OF_LIGHT_KM_S;
}

// Relative speed of two bodies moving towards each other, as measured by
// one of them (relativistic velocity addition).
export function relativeClosingSpeed(aKmS, bKmS) {
  const c2 = SPEED_OF_LIGHT_KM_S * SPEED_OF_LIGHT_KM_S;
  return (aKmS + bKmS) / (1 + (aKmS * bKmS) / c2);
}

export function analyzeScene(scene = PILOT_SCENE) {
  const impactSeconds = scene.detectionDistanceKm / scene.objectSpeedKmS;
  const sequential = scene.refitSequentialSeconds.reduce((a, b) => a + b, 0);
  const launchAt =
    scene.analysisSeconds +
    Math.max(sequential, scene.refitParallelSeconds) +
    scene.railSeconds +
    scene.launchSeconds;
  const gapAtLaunchKm =
    scene.detectionDistanceKm - scene.objectSpeedKmS * launchAt;
  // Closing speed in the station frame is the plain sum of both speeds.
  const interceptAfterLaunch =
    gapAtLaunchKm / (scene.probeSpeedKmS + scene.objectSpeedKmS);
  const interceptAt = launchAt + interceptAfterLaunch;
  const interceptDistanceKm = scene.probeSpeedKmS * interceptAfterLaunch;
  const remainingSeconds = impactSeconds - interceptAt;
  const remainingKm = scene.objectSpeedKmS * remainingSeconds;
  const objectSpeedMs = scene.objectSpeedKmS * 1000;
  const probeSpeedMs = scene.probeSpeedKmS * 1000;
  const detectionLightSeconds = lightTimeSeconds(scene.detectionDistanceKm);

  const findings = [];
  if (scene.probeSpeedKmS >= SPEED_OF_LIGHT_KM_S) {
    findings.push(
      `probe speed ${scene.probeSpeedKmS} km/s is not below the speed of light`
    );
  }
  if (scene.objectSpeedKmS >= SPEED_OF_LIGHT_KM_S) {
    findings.push(`object speed ${scene.objectSpeedKmS} km/s exceeds c`);
  }
  if (scene.driveLimitKmS && scene.objectSpeedKmS > scene.driveLimitKmS) {
    findings.push(
      `object speed ${scene.objectSpeedKmS} km/s exceeds the drive limit of ${scene.driveLimitKmS} km/s`
    );
  }
  if (interceptAt >= impactSeconds) {
    findings.push('the probe cannot reach the object before impact');
  }
  // A 0.002 s round trip limits how far the correlation center can be.
  const maxCorrelationDistanceKm =
    (scene.correlationSeconds / 2) * SPEED_OF_LIGHT_KM_S;

  return {
    impactSeconds,
    launchAt,
    gapAtLaunchKm,
    interceptAfterLaunch,
    interceptAt,
    interceptDistanceKm,
    remainingSeconds,
    remainingKm,
    detectionLightSeconds,
    // Where the object really is when its light reaches the station.
    trueDistanceAtDetectionKm:
      scene.detectionDistanceKm - scene.objectSpeedKmS * detectionLightSeconds,
    objectLorentzFactor: lorentzFactor(scene.objectSpeedKmS),
    objectEnergyPerTonneMt:
      (kineticEnergyPerKg(scene.objectSpeedKmS) * 1000) /
      JOULES_PER_MEGATON_TNT,
    // Constant deceleration needed to stop the object before the station.
    stopDecelerationG:
      (objectSpeedMs * objectSpeedMs) / (2 * remainingKm * 1e3) / 9.80665,
    // Sideways speed that makes the object miss the station by 100 km.
    deflectFor100KmKmS: 100 / remainingSeconds,
    railAccelerationG: probeSpeedMs / scene.launchSeconds / 9.80665,
    probeEnergyPerKgMt:
      kineticEnergyPerKg(scene.probeSpeedKmS) / JOULES_PER_MEGATON_TNT,
    matchSpeedKmS: relativeClosingSpeed(
      Math.min(scene.probeSpeedKmS, SPEED_OF_LIGHT_KM_S),
      scene.objectSpeedKmS
    ),
    maxCorrelationDistanceKm,
    findings,
  };
}

function format(value) {
  if (!Number.isFinite(value)) {
    return String(value);
  }
  return Math.abs(value) >= 1e5 || (Math.abs(value) < 1e-2 && value !== 0)
    ? value.toExponential(3)
    : value.toFixed(3);
}

const isMain =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMain) {
  const argument = process.argv[2];
  const named = ['shacados', 'binary'].includes(argument);
  const beta = argument && !named ? Number(argument) : null;
  const scene = beta
    ? { ...PILOT_SCENE, probeSpeedKmS: beta * SPEED_OF_LIGHT_KM_S }
    : argument === 'shacados'
      ? SHACADOS_PROBE_VARIANT
      : PILOT_SCENE;
  const result =
    argument === 'binary'
      ? { ...analyzeStartSystems(), findings: [] }
      : analyzeScene(scene);
  for (const [key, value] of Object.entries(result)) {
    if (key !== 'findings') {
      console.log(`${key}: ${format(value)}`);
    }
  }
  console.log(
    result.findings.length
      ? `FINDINGS:\n- ${result.findings.join('\n- ')}`
      : 'FINDINGS: none'
  );
}
