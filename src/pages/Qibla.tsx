import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Check,
  Compass,
  Crosshair,
  MapPin,
  Navigation,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

const KAABA = { lat: 21.4225, lon: 39.8262 };
const DEFAULT_LOCATION = {
  lat: 32.5739,
  lon: 74.0796,
  name: 'Gujrat, Pakistan',
};

type PermissionState = 'idle' | 'granted' | 'denied';
type CompassState =
  | 'idle'
  | 'requesting'
  | 'active'
  | 'denied'
  | 'unsupported';

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function toDegrees(value: number) {
  return (value * 180) / Math.PI;
}

function normalizeDegrees(value: number) {
  return ((value % 360) + 360) % 360;
}

function shortestAngleDelta(from: number, to: number) {
  return ((to - from + 540) % 360) - 180;
}

function getBearing(lat: number, lon: number) {
  const φ1 = toRadians(lat);
  const φ2 = toRadians(KAABA.lat);
  const Δλ = toRadians(KAABA.lon - lon);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  return normalizeDegrees(toDegrees(Math.atan2(y, x)));
}

function getDistanceKm(lat: number, lon: number) {
  const R = 6371;
  const φ1 = toRadians(lat);
  const φ2 = toRadians(KAABA.lat);
  const Δφ = toRadians(KAABA.lat - lat);
  const Δλ = toRadians(KAABA.lon - lon);

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) *
      Math.cos(φ2) *
      Math.sin(Δλ / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getDirectionLabel(degrees: number) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(normalizeDegrees(degrees) / 45) % 8];
}

export default function Qibla() {
  const [permissionState, setPermissionState] =
    useState<PermissionState>('idle');
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [qiblaBearing, setQiblaBearing] = useState(() =>
    getBearing(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon),
  );
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [compassState, setCompassState] =
    useState<CompassState>('idle');
  const [locationLoading, setLocationLoading] = useState(false);
  const [isMobileLike, setIsMobileLike] = useState(false);

  const lastHeadingRef = useRef<number | null>(null);

  const orientationSupported =
    typeof window !== 'undefined' &&
    'DeviceOrientationEvent' in window;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(
      '(pointer: coarse), (max-width: 768px)',
    );

    const update = () => setIsMobileLike(media.matches);
    update();

    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setPermissionState('denied');
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lon } = position.coords;

        setLocation({
          lat,
          lon,
          name: 'Current location',
        });
        setQiblaBearing(getBearing(lat, lon));
        setPermissionState('granted');
        setLocationLoading(false);
      },
      () => {
        setPermissionState('denied');
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 300000,
      },
    );
  };

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('DeviceOrientationEvent' in window)
    ) {
      return;
    }

    const onOrientation = (event: DeviceOrientationEvent) => {
      let heading: number | null = null;

      const e = event as DeviceOrientationEvent & {
        webkitCompassHeading?: number;
      };

      // iOS Safari exposes a calibrated compass heading directly.
      if (
        typeof e.webkitCompassHeading === 'number' &&
        Number.isFinite(e.webkitCompassHeading)
      ) {
        heading = normalizeDegrees(e.webkitCompassHeading);
      } else if (
        typeof event.alpha === 'number' &&
        Number.isFinite(event.alpha)
      ) {
        // Android/Chromium commonly exposes alpha through deviceorientation.
        // Account for screen rotation so landscape mode remains usable.
        const screenAngle =
          window.screen?.orientation?.angle ??
          0;

        heading = normalizeDegrees(
          360 - event.alpha + screenAngle,
        );
      }

      if (heading === null || !Number.isFinite(heading)) return;

      const previous = lastHeadingRef.current;

      if (previous === null) {
        lastHeadingRef.current = heading;
        setDeviceHeading(heading);
        setCompassState('active');
        return;
      }

      const delta = shortestAngleDelta(previous, heading);

      // Ignore very small magnetometer noise.
      if (Math.abs(delta) < 0.6) return;

      // Circular smoothing prevents visible jumps around 0°/360°.
      const smoothed = normalizeDegrees(previous + delta * 0.28);

      lastHeadingRef.current = smoothed;
      setDeviceHeading(smoothed);
      setCompassState('active');
    };

    window.addEventListener(
      'deviceorientation',
      onOrientation as EventListener,
    );
    window.addEventListener(
      'deviceorientationabsolute',
      onOrientation as EventListener,
    );

    return () => {
      window.removeEventListener(
        'deviceorientation',
        onOrientation as EventListener,
      );
      window.removeEventListener(
        'deviceorientationabsolute',
        onOrientation as EventListener,
      );
    };
  }, []);

  const requestCompass = async () => {
    if (!orientationSupported) {
      setCompassState('unsupported');
      return;
    }

    setCompassState('requesting');

    const DeviceOrientation =
      window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
        requestPermission?: () => Promise<
          'granted' | 'denied' | 'default'
        >;
      };

    if (typeof DeviceOrientation.requestPermission === 'function') {
      try {
        const result = await DeviceOrientation.requestPermission();

        if (result !== 'granted') {
          lastHeadingRef.current = null;
          setDeviceHeading(null);
          setCompassState('denied');
          return;
        }
      } catch {
        lastHeadingRef.current = null;
        setDeviceHeading(null);
        setCompassState('denied');
        return;
      }
    }

    lastHeadingRef.current = null;
    setCompassState('active');
  };

  const compassAngle = useMemo(() => {
    if (deviceHeading === null) return qiblaBearing;

    return normalizeDegrees(qiblaBearing - deviceHeading);
  }, [deviceHeading, qiblaBearing]);

  const distance = useMemo(
    () => getDistanceKm(location.lat, location.lon),
    [location.lat, location.lon],
  );

  const qiblaDirection = getDirectionLabel(qiblaBearing);
  const usingFallback = permissionState === 'denied';

  const liveStatus = (() => {
    if (!isMobileLike) {
      return {
        title: 'Desktop view',
        text: 'Use the bearing above to face the Qibla. Live compass is for supported phones.',
      };
    }

    if (deviceHeading !== null) {
      return {
        title: 'Compass is live',
        text: 'Turn your phone until the gold arrow points straight ahead.',
      };
    }

    if (compassState === 'requesting') {
      return {
        title: 'Starting compass…',
        text: 'Allow motion and orientation access if your browser asks.',
      };
    }

    if (compassState === 'denied') {
      return {
        title: 'Compass access denied',
        text: 'You can still use the accurate Qibla bearing above.',
      };
    }

    if (compassState === 'unsupported') {
      return {
        title: 'Live compass unavailable',
        text: 'This browser does not provide a compatible device compass.',
      };
    }

    return {
      title: 'Ready for live guidance',
      text: 'Tap Enable Compass and keep your phone flat while turning.',
    };
  })();

  return (
    <div
      className="min-h-screen pt-20 pb-24 lg:pb-8"
      style={{
        background:
          'radial-gradient(circle at 50% 18%, rgba(232,189,75,0.055), transparent 28%), #061812',
      }}
    >
      {/* Hero */}
      <header
        className="relative overflow-hidden border-b"
        style={{
          background:
            'linear-gradient(135deg, #0B2820 0%, #0A241D 55%, #0B2820 100%)',
          borderColor: 'rgba(232,189,75,0.12)',
        }}
      >
        <div className="islamic-pattern absolute inset-0 opacity-35 pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 py-10 sm:py-12 lg:py-14">
          <div className="mx-auto max-w-3xl text-center">
            <div
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{
                background:
                  'linear-gradient(145deg, rgba(232,189,75,0.16), rgba(232,189,75,0.05))',
                border: '1px solid rgba(232,189,75,0.24)',
                boxShadow: '0 12px 35px rgba(0,0,0,0.16)',
              }}
            >
              <Compass size={27} className="text-noor-gold" />
            </div>

            <p className="font-arabic text-noor-gold text-lg mb-1">
              القِبْلَة
            </p>

            <h1 className="font-display text-noor-ivory text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight">
              Find Your Qibla
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base leading-6 text-noor-muted">
              A simple, accurate way to find the direction of the Kaaba
              from wherever you are.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <TrustPill icon={<Check size={12} />} text="Accurate bearing" />
              <TrustPill icon={<ShieldCheck size={12} />} text="Location stays on device" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8 lg:py-10">
        {/* First-use state */}
        {permissionState === 'idle' && (
          <section
            className="mx-auto max-w-2xl overflow-hidden rounded-3xl p-6 sm:p-9 text-center"
            style={{
              background:
                'linear-gradient(145deg, rgba(16,51,41,1), rgba(11,40,32,1))',
              border: '1px solid rgba(232,189,75,0.13)',
              boxShadow: '0 22px 70px rgba(0,0,0,0.16)',
            }}
          >
            <div
              className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full"
              style={{
                background: 'rgba(232,189,75,0.09)',
                border: '1px solid rgba(232,189,75,0.22)',
              }}
            >
              <Navigation size={34} className="text-noor-gold" />
            </div>

            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-noor-gold">
              Start here
            </p>

            <h2 className="mt-2 font-display text-noor-ivory text-2xl sm:text-3xl font-semibold">
              Find the Qibla from your location
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-noor-muted">
              Allow location access to calculate the Qibla bearing and
              distance to the Kaaba. On supported phones, you can then
              turn on live compass guidance.
            </p>

            <button
              type="button"
              onClick={requestLocation}
              disabled={locationLoading}
              className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background: '#E8BD4B',
                color: '#061812',
                boxShadow: '0 10px 28px rgba(232,189,75,0.13)',
              }}
            >
              {locationLoading ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <MapPin size={16} />
              )}
              {locationLoading ? 'Finding location…' : 'Use My Location'}
            </button>

            <p className="mt-4 text-[11px] leading-5 text-noor-muted">
              Your location is used only for the Qibla calculation.
            </p>
          </section>
        )}

        {permissionState === 'denied' && (
          <section
            className="mb-5 flex flex-col gap-3 rounded-2xl px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            style={{
              background: 'rgba(232,189,75,0.065)',
              border: '1px solid rgba(232,189,75,0.16)',
            }}
          >
            <div className="flex items-start gap-3">
              <MapPin size={17} className="mt-0.5 shrink-0 text-noor-gold" />
              <div>
                <p className="text-sm font-semibold text-noor-ivory">
                  Showing Gujrat, Pakistan
                </p>
                <p className="mt-0.5 text-xs leading-5 text-noor-muted">
                  Location access was unavailable, so the default
                  calculation is being used.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={requestLocation}
              disabled={locationLoading}
              className="inline-flex min-h-9 shrink-0 items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold"
              style={{
                background: 'rgba(232,189,75,0.10)',
                border: '1px solid rgba(232,189,75,0.20)',
                color: '#E8BD4B',
              }}
            >
              {locationLoading && (
                <RefreshCw size={13} className="animate-spin" />
              )}
              Try Again
            </button>
          </section>
        )}

        {(permissionState === 'granted' ||
          permissionState === 'denied') && (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)] lg:items-start">
            {/* Main compass */}
            <section
              className="overflow-hidden rounded-3xl"
              style={{
                background:
                  'linear-gradient(145deg, #103329 0%, #0C2A21 100%)',
                border: '1px solid rgba(232,189,75,0.13)',
                boxShadow: '0 24px 70px rgba(0,0,0,0.17)',
              }}
            >
              <div className="p-5 sm:p-7">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-medium text-noor-muted">
                      Qibla bearing
                    </p>

                    <div className="mt-1 flex items-center gap-2.5">
                      <span className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-noor-gold">
                        {Math.round(qiblaBearing)}°
                      </span>

                      <span
                        className="rounded-full px-2.5 py-1 text-[11px] font-bold"
                        style={{
                          color: '#E8BD4B',
                          background: 'rgba(232,189,75,0.10)',
                          border:
                            '1px solid rgba(232,189,75,0.14)',
                        }}
                      >
                        {qiblaDirection}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-noor-muted">
                      Measured clockwise from true north
                    </p>
                  </div>

                  {isMobileLike && (
                    <button
                      type="button"
                      onClick={requestCompass}
                      disabled={
                        compassState === 'requesting' ||
                        compassState === 'active'
                      }
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-75"
                      style={{
                        color: '#E8BD4B',
                        background:
                          'rgba(232,189,75,0.08)',
                        border:
                          '1px solid rgba(232,189,75,0.24)',
                      }}
                    >
                      {compassState === 'requesting' ? (
                        <RefreshCw
                          size={13}
                          className="animate-spin"
                        />
                      ) : compassState === 'active' &&
                        deviceHeading !== null ? (
                        <Check size={13} />
                      ) : (
                        <Crosshair size={13} />
                      )}

                      {compassState === 'active' &&
                      deviceHeading !== null
                        ? 'Compass Active'
                        : compassState === 'requesting'
                          ? 'Starting…'
                          : 'Enable Compass'}
                    </button>
                  )}
                </div>

                <div className="mt-5 sm:mt-7">
                  <CompassVisual
                    angle={compassAngle}
                    live={deviceHeading !== null}
                  />
                </div>

                <div
                  className="mt-5 rounded-2xl px-4 py-4"
                  style={{
                    background: 'rgba(6,24,18,0.42)',
                    border:
                      '1px solid rgba(26,64,53,0.62)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                      style={{
                        background:
                          'rgba(232,189,75,0.09)',
                      }}
                    >
                      {deviceHeading !== null ? (
                        <Check
                          size={14}
                          className="text-noor-gold"
                        />
                      ) : (
                        <Compass
                          size={14}
                          className="text-noor-gold"
                        />
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-noor-ivory">
                        {liveStatus.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-noor-muted">
                        {liveStatus.text}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Details column */}
            <aside className="space-y-5">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
                <InfoCard
                  icon={<Navigation size={16} />}
                  label="Distance to Kaaba"
                  value={Math.round(distance).toLocaleString()}
                  suffix="kilometers"
                />

                <InfoCard
                  icon={<MapPin size={16} />}
                  label="Your location"
                  value={location.name}
                  suffix={`${location.lat.toFixed(4)}° N · ${location.lon.toFixed(4)}° E`}
                />
              </div>

              <section
                className="rounded-2xl p-5"
                style={{
                  background: '#0B2820',
                  border:
                    '1px solid rgba(26,64,53,0.60)',
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background:
                        'rgba(232,189,75,0.09)',
                    }}
                  >
                    <Compass
                      size={17}
                      className="text-noor-gold"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-noor-ivory">
                      For the best compass reading
                    </p>

                    <ul className="mt-2 space-y-2 text-xs leading-5 text-noor-muted">
                      <li className="flex gap-2">
                        <span className="text-noor-gold">•</span>
                        Keep your phone flat and steady.
                      </li>
                      <li className="flex gap-2">
                        <span className="text-noor-gold">•</span>
                        Move away from magnets and strong electronics.
                      </li>
                      <li className="flex gap-2">
                        <span className="text-noor-gold">•</span>
                        If the reading drifts, slowly move the phone in a
                        figure-eight.
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section
                className="rounded-2xl p-5"
                style={{
                  background:
                    'linear-gradient(145deg, rgba(16,51,41,0.82), rgba(11,40,32,0.82))',
                  border:
                    '1px solid rgba(232,189,75,0.10)',
                }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-noor-gold">
                  Qibla reference
                </p>
                <p className="mt-2 font-display text-lg font-semibold text-noor-ivory">
                  The Kaaba, Makkah
                </p>
                <p className="mt-1 text-xs leading-5 text-noor-muted">
                  The gold arrow indicates the calculated initial bearing
                  from your location toward the Kaaba.
                </p>
              </section>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

function TrustPill({
  icon,
  text,
}: {
  icon: ReactNode;
  text: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-medium"
      style={{
        color: '#B9C8C1',
        background: 'rgba(6,24,18,0.32)',
        border: '1px solid rgba(26,64,53,0.55)',
      }}
    >
      <span className="text-noor-gold">{icon}</span>
      {text}
    </span>
  );
}

function InfoCard({
  icon,
  label,
  value,
  suffix,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  suffix: string;
}) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: '#103329',
        border: '1px solid rgba(26,64,53,0.62)',
      }}
    >
      <div className="flex items-center gap-2 text-noor-muted">
        <span className="text-noor-gold">{icon}</span>
        <p className="text-xs">{label}</p>
      </div>

      <p className="mt-3 truncate font-display text-2xl font-bold text-noor-gold">
        {value}
      </p>

      <p className="mt-1 text-[10px] leading-4 text-noor-muted">
        {suffix}
      </p>
    </div>
  );
}

function CompassVisual({
  angle,
  live,
}: {
  angle: number;
  live?: boolean;
}) {
  const directions = [
    { label: 'N', degrees: 0 },
    { label: 'E', degrees: 90 },
    { label: 'S', degrees: 180 },
    { label: 'W', degrees: 270 },
  ];

  return (
    <div className="flex justify-center">
      <div className="relative aspect-square w-full max-w-[360px]">
        {/* Outer rings */}
        <div
          className="absolute inset-1 rounded-full"
          style={{
            background:
              'radial-gradient(circle at center, rgba(232,189,75,0.065) 0%, rgba(16,51,41,0.72) 48%, rgba(11,40,32,0.98) 72%, rgba(6,24,18,0.72) 100%)',
            border:
              '1px solid rgba(232,189,75,0.18)',
            boxShadow:
              'inset 0 0 55px rgba(0,0,0,0.18), 0 18px 50px rgba(0,0,0,0.15)',
          }}
        />

        <div
          className="absolute inset-[10%] rounded-full"
          style={{
            border:
              '1px solid rgba(26,64,53,0.70)',
          }}
        />

        {/* Cardinal labels */}
        {directions.map(({ label, degrees }) => {
          const rad = toRadians(degrees - 90);
          const radius = 39;

          return (
            <span
              key={label}
              className="absolute text-xs font-bold"
              style={{
                left: `calc(50% + ${Math.cos(rad) * radius}%)`,
                top: `calc(50% + ${Math.sin(rad) * radius}%)`,
                transform: 'translate(-50%, -50%)',
                color:
                  label === 'N' ? '#E8BD4B' : '#A9B8B1',
              }}
            >
              {label}
            </span>
          );
        })}

        {/* Tick marks */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 360 360"
          aria-hidden="true"
        >
          {Array.from({ length: 72 }, (_, i) => {
            const degrees = i * 5;
            const rad = toRadians(degrees - 90);
            const major = i % 9 === 0;
            const medium = i % 3 === 0;

            const r1 = major ? 145 : medium ? 151 : 155;
            const r2 = 163;

            return (
              <line
                key={degrees}
                x1={180 + r1 * Math.cos(rad)}
                y1={180 + r1 * Math.sin(rad)}
                x2={180 + r2 * Math.cos(rad)}
                y2={180 + r2 * Math.sin(rad)}
                stroke={
                  major
                    ? 'rgba(232,189,75,0.48)'
                    : 'rgba(169,184,177,0.13)'
                }
                strokeWidth={
                  major ? 1.6 : medium ? 1 : 0.65
                }
              />
            );
          })}
        </svg>

        {/* Qibla arrow */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `rotate(${angle}deg)`,
            transition:
              'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          aria-label={`Qibla direction ${Math.round(
            angle,
          )} degrees relative to the phone`}
        >
          <div className="relative h-[58%] w-2">
            <div
              className="absolute left-1/2 top-0 -translate-x-1/2"
              style={{
                width: 0,
                height: 0,
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderBottom: '58px solid #E8BD4B',
                filter:
                  'drop-shadow(0 5px 10px rgba(232,189,75,0.22))',
              }}
            />

            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2"
              style={{
                width: 0,
                height: 0,
                borderLeft: '7px solid transparent',
                borderRight: '7px solid transparent',
                borderTop: '36px solid rgba(232,189,75,0.20)',
              }}
            />
          </div>
        </div>

        {/* Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, #F5D878, #E8BD4B 70%)',
              boxShadow:
                '0 0 0 8px rgba(232,189,75,0.07), 0 8px 24px rgba(0,0,0,0.20)',
            }}
          >
            <Navigation
              size={21}
              strokeWidth={2.2}
              style={{ color: '#061812' }}
            />
          </div>
        </div>

        {live && (
          <div
            className="absolute bottom-[8%] left-1/2 -translate-x-1/2 rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.20em]"
            style={{
              color: '#E8BD4B',
              background: 'rgba(232,189,75,0.09)',
              border:
                '1px solid rgba(232,189,75,0.17)',
              boxShadow: '0 5px 16px rgba(0,0,0,0.12)',
            }}
          >
            Live
          </div>
        )}
      </div>
    </div>
  );
}
