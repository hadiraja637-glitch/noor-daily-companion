import { useEffect, useMemo, useRef, useState } from 'react';
import { Compass, Crosshair, MapPin, Navigation, RefreshCw } from 'lucide-react';

const KAABA = { lat: 21.4225, lon: 39.8262 };
const DEFAULT_LOCATION = { lat: 32.5739, lon: 74.0796, name: 'Gujrat, Pakistan' };

type PermissionState = 'idle' | 'granted' | 'denied';
type CompassState = 'idle' | 'requesting' | 'active' | 'denied' | 'unsupported';

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function toDegrees(value: number) {
  return (value * 180) / Math.PI;
}

function normalizeDegrees(value: number) {
  return ((value % 360) + 360) % 360;
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
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getDirectionLabel(degrees: number) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(normalizeDegrees(degrees) / 45) % 8];
}

export default function Qibla() {
  const [permissionState, setPermissionState] = useState<PermissionState>('idle');
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [qiblaBearing, setQiblaBearing] = useState(() =>
    getBearing(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon),
  );
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [compassState, setCompassState] = useState<CompassState>('idle');
  const [locationLoading, setLocationLoading] = useState(false);
  const lastHeadingRef = useRef<number | null>(null);

  const orientationSupported =
    typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;

  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setPermissionState('denied');
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        setLocation({ lat, lon, name: 'Current location' });
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
    if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) {
      return;
    }

    const onOrientation = (event: DeviceOrientationEvent) => {
      let heading: number | null = null;
      const e = event as DeviceOrientationEvent & {
        webkitCompassHeading?: number;
      };

      if (typeof e.webkitCompassHeading === 'number') {
        heading = normalizeDegrees(e.webkitCompassHeading);
      } else if (event.absolute && typeof event.alpha === 'number') {
        heading = normalizeDegrees(360 - event.alpha);
      }

      if (heading === null || !Number.isFinite(heading)) return;

      // Ignore tiny sensor noise to keep the needle visually stable.
      const previous = lastHeadingRef.current;
      if (previous !== null) {
        const delta = Math.abs(normalizeDegrees(heading - previous));
        const shortestDelta = Math.min(delta, 360 - delta);
        if (shortestDelta < 0.7) return;
      }

      lastHeadingRef.current = heading;
      setDeviceHeading(heading);
      setCompassState('active');
    };

    // deviceorientation is the broadly supported event; iOS exposes
    // webkitCompassHeading through it. Absolute orientation is preferred
    // where available by the browser.
    window.addEventListener('deviceorientation', onOrientation as EventListener);
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

    const DeviceOrientation = window.DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
    };

    if (typeof DeviceOrientation.requestPermission === 'function') {
      try {
        const result = await DeviceOrientation.requestPermission();

        if (result !== 'granted') {
          setDeviceHeading(null);
          setCompassState('denied');
          return;
        }
      } catch {
        setDeviceHeading(null);
        setCompassState('denied');
        return;
      }
    }

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
  const isUsingFallback = permissionState === 'denied';

  return (
    <div
      className="min-h-screen pt-20 pb-24 lg:pb-8"
      style={{ background: '#061812' }}
    >
      <header
        className="relative overflow-hidden border-b"
        style={{
          background: '#0B2820',
          borderColor: 'rgba(26,64,53,0.55)',
        }}
      >
        <div className="islamic-pattern absolute inset-0 opacity-40 pointer-events-none" />
        <div className="relative mx-auto max-w-3xl px-4 py-10 sm:py-14 text-center">
          <div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{
              background: 'rgba(232,189,75,0.10)',
              border: '1px solid rgba(232,189,75,0.22)',
            }}
          >
            <Compass size={24} className="text-noor-gold" />
          </div>
          <p className="font-arabic text-noor-gold text-lg mb-1">ا</p>
          <h1 className="font-display text-noor-ivory text-3xl sm:text-4xl font-semibold">
            Qibla Finder
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-noor-muted">
            Find the direction of the Kaaba from your current location.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-7 sm:py-9">
        {permissionState === 'idle' && (
          <section
            className="rounded-3xl p-6 sm:p-9 text-center shadow-lg"
            style={{
              background: '#103329',
              border: '1px solid rgba(26,64,53,0.65)',
            }}
          >
            <div
              className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full"
              style={{
                background: 'rgba(232,189,75,0.10)',
                border: '2px solid rgba(232,189,75,0.25)',
              }}
            >
              <Navigation size={34} className="text-noor-gold" />
            </div>

            <h2 className="font-display text-noor-ivory text-2xl font-semibold">
              Find Your Qibla
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-noor-muted">
              Allow location access so Noor can calculate the Qibla bearing
              from where you are.
            </p>

            <button
              type="button"
              onClick={requestLocation}
              disabled={locationLoading}
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
              style={{ background: '#E8BD4B', color: '#061812' }}
            >
              {locationLoading ? (
                <RefreshCw size={15} className="animate-spin" />
              ) : (
                <MapPin size={15} />
              )}
              {locationLoading ? 'Finding location…' : 'Use My Location'}
            </button>

            <p className="mt-4 text-[11px] leading-5 text-noor-muted">
              Your location is used only to calculate the direction and
              distance to the Kaaba.
            </p>
          </section>
        )}

        {permissionState === 'denied' && (
          <section
            className="mb-5 rounded-2xl px-4 py-3"
            style={{
              background: 'rgba(232,189,75,0.07)',
              border: '1px solid rgba(232,189,75,0.18)',
            }}
          >
            <div className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-noor-gold" />
              <div>
                <p className="text-sm font-medium text-noor-ivory">
                  Location access unavailable
                </p>
                <p className="mt-1 text-xs leading-5 text-noor-muted">
                  Showing the Qibla calculation for Gujrat, Pakistan. Allow
                  location access and try again for your current location.
                </p>
              </div>
            </div>
          </section>
        )}

        {(permissionState === 'granted' || permissionState === 'denied') && (
          <div className="space-y-5">
            <section
              className="overflow-hidden rounded-3xl p-5 sm:p-7"
              style={{
                background: '#103329',
                border: '1px solid rgba(26,64,53,0.65)',
              }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs text-noor-muted">Qibla direction</p>
                  <div className="mt-1 flex items-end gap-2">
                    <p className="font-display text-4xl font-bold text-noor-gold">
                      {Math.round(qiblaBearing)}°
                    </p>
                    <span className="mb-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                      style={{
                        background: 'rgba(232,189,75,0.10)',
                        color: '#E8BD4B',
                      }}
                    >
                      {qiblaDirection}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-noor-muted">
                    Bearing from true north
                  </p>
                </div>

                <button
                  type="button"
                  onClick={requestCompass}
                  disabled={compassState === 'requesting'}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    borderColor: 'rgba(232,189,75,0.30)',
                    color: '#E8BD4B',
                  }}
                >
                  {compassState === 'requesting' ? (
                    <RefreshCw size={13} className="animate-spin" />
                  ) : (
                    <Crosshair size={13} />
                  )}
                  {compassState === 'active' && deviceHeading !== null
                    ? 'Compass Active'
                    : 'Enable Compass'}
                </button>
              </div>

              <div className="mt-7">
                <CompassVisual
                  angle={compassAngle}
                  live={deviceHeading !== null}
                />
              </div>

              <div
                className="mt-5 rounded-2xl px-4 py-3 text-center"
                style={{
                  background: 'rgba(6,24,18,0.42)',
                  border: '1px solid rgba(26,64,53,0.55)',
                }}
              >
                <p className="text-xs leading-5 text-noor-muted">
                  {deviceHeading !== null
                    ? 'Turn your phone until the gold Qibla arrow points straight ahead.'
                    : compassState === 'unsupported'
                      ? 'Live compass is not supported by this browser. The Qibla bearing above is still accurate.'
                      : compassState === 'denied'
                        ? 'Compass permission was denied. You can still use the north-based Qibla bearing.'
                        : 'Enable the compass on a supported mobile device for live guidance.'}
                </p>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoCard
                label="Distance to Kaaba"
                value={Math.round(distance).toLocaleString()}
                suffix="kilometers"
              />
              <InfoCard
                label="Location"
                value={location.name}
                suffix={`${location.lat.toFixed(4)}° N · ${location.lon.toFixed(4)}° E`}
              />
            </div>

            <section
              className="rounded-2xl px-5 py-4"
              style={{
                background: '#0B2820',
                border: '1px solid rgba(26,64,53,0.55)',
              }}
            >
              <div className="flex items-start gap-3">
                <Compass size={17} className="mt-0.5 shrink-0 text-noor-gold" />
                <div>
                  <p className="text-sm font-medium text-noor-ivory">
                    How to use the live compass
                  </p>
                  <p className="mt-1 text-xs leading-5 text-noor-muted">
                    Keep your phone flat and away from magnets or other
                    electronic interference. If the direction appears
                    unstable, slowly move the phone in a figure-eight and try
                    again.
                  </p>
                </div>
              </div>
            </section>

            {isUsingFallback && (
              <button
                type="button"
                onClick={requestLocation}
                disabled={locationLoading}
                className="mx-auto flex min-h-10 items-center justify-center gap-2 rounded-full px-5 py-2 text-xs font-semibold"
                style={{
                  background: 'rgba(232,189,75,0.10)',
                  color: '#E8BD4B',
                  border: '1px solid rgba(232,189,75,0.22)',
                }}
              >
                {locationLoading && (
                  <RefreshCw size={13} className="animate-spin" />
                )}
                Try Location Again
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function InfoCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix: string;
}) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: '#103329',
        border: '1px solid rgba(26,64,53,0.65)',
      }}
    >
      <p className="text-xs text-noor-muted">{label}</p>
      <p className="mt-2 truncate font-display text-2xl font-bold text-noor-gold">
        {value}
      </p>
      <p className="mt-1 text-[10px] text-noor-muted">{suffix}</p>
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
    { label: 'N', angle: 0 },
    { label: 'E', angle: 90 },
    { label: 'S', angle: 180 },
    { label: 'W', angle: 270 },
  ];

  return (
    <div className="flex justify-center">
      <div className="relative aspect-square w-full max-w-[280px]">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'radial-gradient(circle at center, rgba(232,189,75,0.045), #103329 58%, #0B2820 100%)',
            border: '1px solid rgba(232,189,75,0.20)',
            boxShadow: '0 16px 45px rgba(0,0,0,0.18)',
          }}
        />

        {directions.map(({ label, angle: degrees }) => {
          const rad = toRadians(degrees - 90);
          const radius = 112;
          return (
            <span
              key={label}
              className="absolute text-xs font-bold"
              style={{
                left: `calc(50% + ${Math.cos(rad) * radius}px)`,
                top: `calc(50% + ${Math.sin(rad) * radius}px)`,
                transform: 'translate(-50%, -50%)',
                color: label === 'N' ? '#E8BD4B' : '#A9B8B1',
              }}
            >
              {label}
            </span>
          );
        })}

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 280 280"
          aria-hidden="true"
        >
          {Array.from({ length: 36 }, (_, i) => {
            const degrees = i * 10;
            const rad = toRadians(degrees - 90);
            const major = i % 9 === 0;
            const r1 = major ? 96 : 100;
            const r2 = 105;

            return (
              <line
                key={degrees}
                x1={140 + r1 * Math.cos(rad)}
                y1={140 + r1 * Math.sin(rad)}
                x2={140 + r2 * Math.cos(rad)}
                y2={140 + r2 * Math.sin(rad)}
                stroke={
                  major
                    ? 'rgba(232,189,75,0.45)'
                    : 'rgba(26,64,53,0.70)'
                }
                strokeWidth={major ? 1.5 : 0.8}
              />
            );
          })}
        </svg>

        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `rotate(${angle}deg)`,
            transition:
              'transform 180ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          aria-label={`Qibla direction ${Math.round(angle)} degrees`}
        >
          <div className="relative h-28 w-1">
            <div
              className="absolute left-1/2 top-0 -translate-x-1/2"
              style={{
                width: 0,
                height: 0,
                borderLeft: '8px solid transparent',
                borderRight: '8px solid transparent',
                borderBottom: '48px solid #E8BD4B',
                filter: 'drop-shadow(0 3px 8px rgba(232,189,75,0.25))',
              }}
            />
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2"
              style={{
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: '30px solid rgba(232,189,75,0.22)',
              }}
            />
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{
              background: '#E8BD4B',
              boxShadow: '0 0 0 7px rgba(232,189,75,0.08)',
            }}
          >
            <Navigation size={17} style={{ color: '#061812' }} />
          </div>
        </div>

        {live && (
          <div
            className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em]"
            style={{
              color: '#E8BD4B',
              background: 'rgba(232,189,75,0.09)',
              border: '1px solid rgba(232,189,75,0.16)',
            }}
          >
            Live
          </div>
        )}
      </div>
    </div>
  );
}
