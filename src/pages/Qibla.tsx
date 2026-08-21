import { useEffect, useState } from 'react';
import { Compass, MapPin, Navigation, RotateCcw } from 'lucide-react';

const KAABA = { lat: 21.4225, lon: 39.8262 };
const DEFAULT_LOCATION = { lat: 32.5739, lon: 74.0796, name: 'Gujrat, Pakistan' };

type PermissionState = 'idle' | 'granted' | 'denied';

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function toDegrees(value: number) {
  return (value * 180) / Math.PI;
}

function getBearing(lat: number, lon: number) {
  const φ1 = toRadians(lat);
  const φ2 = toRadians(KAABA.lat);
  const Δλ = toRadians(KAABA.lon - lon);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
}

function getDistanceKm(lat: number, lon: number) {
  const R = 6371;
  const φ1 = toRadians(lat);
  const φ2 = toRadians(KAABA.lat);
  const Δφ = toRadians(KAABA.lat - lat);
  const Δλ = toRadians(KAABA.lon - lon);
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Qibla() {
  const [permissionState, setPermissionState] = useState<PermissionState>('idle');
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [qiblaBearing, setQiblaBearing] = useState(() => getBearing(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon));
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [orientationSupported, setOrientationSupported] = useState(false);

  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setPermissionState('denied');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLocation({ lat, lon, name: 'Current location' });
        setQiblaBearing(getBearing(lat, lon));
        setPermissionState('granted');
      },
      () => setPermissionState('denied'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 },
    );
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) return;
    setOrientationSupported(true);

    const onOrientation = (event: DeviceOrientationEvent) => {
      let heading: number | null = null;
      const absoluteEvent = event as DeviceOrientationEvent & { webkitCompassHeading?: number };
      if (typeof absoluteEvent.webkitCompassHeading === 'number') {
        heading = absoluteEvent.webkitCompassHeading;
      } else if (event.absolute && typeof event.alpha === 'number') {
        heading = (360 - event.alpha) % 360;
      } else if (typeof event.alpha === 'number') {
        heading = (360 - event.alpha) % 360;
      }
      if (heading !== null && Number.isFinite(heading)) setDeviceHeading(heading);
    };

    window.addEventListener('deviceorientationabsolute', onOrientation as EventListener);
    window.addEventListener('deviceorientation', onOrientation as EventListener);
    return () => {
      window.removeEventListener('deviceorientationabsolute', onOrientation as EventListener);
      window.removeEventListener('deviceorientation', onOrientation as EventListener);
    };
  }, []);

  const requestCompass = async () => {
    const DeviceOrientation = (window as typeof window & {
      DeviceOrientationEvent?: { requestPermission?: () => Promise<string> };
    }).DeviceOrientationEvent;
    if (DeviceOrientation?.requestPermission) {
      try {
        const result = await DeviceOrientation.requestPermission();
        if (result !== 'granted') setDeviceHeading(null);
      } catch {
        setDeviceHeading(null);
      }
    }
  };

  const compassAngle = deviceHeading === null
    ? qiblaBearing
    : (qiblaBearing - deviceHeading + 360) % 360;

  const distance = getDistanceKm(location.lat, location.lon);

  return (
    <div className="min-h-screen pt-20 pb-24 lg:pb-8" style={{ background: '#061812' }}>
      <div className="py-12 mb-8 text-center relative overflow-hidden" style={{ background: '#0B2820', borderBottom: '1px solid rgba(26,64,53,0.5)' }}>
        <div className="islamic-pattern absolute inset-0 opacity-50 pointer-events-none" />
        <div className="relative px-4">
          <p className="font-arabic text-noor-gold text-xl mb-2">القبلة</p>
          <h1 className="font-display text-noor-ivory text-4xl font-semibold mb-2">Qibla Finder</h1>
          <p className="text-noor-muted text-sm">Find the direction of the Kaaba from your location</p>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4">
        {permissionState === 'idle' && (
          <div className="rounded-2xl p-8 text-center" style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.6)' }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: 'rgba(232,189,75,0.1)', border: '2px solid rgba(232,189,75,0.25)' }}>
              <Compass size={36} className="text-noor-gold" />
            </div>
            <h2 className="font-display text-noor-ivory text-2xl font-semibold mb-2">Find Your Qibla</h2>
            <p className="text-noor-muted text-sm mb-6 leading-relaxed">
              Allow location access to calculate the Qibla direction accurately. On supported phones, Noor can also use your device compass.
            </p>
            <button onClick={requestLocation} className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium" style={{ background: '#E8BD4B', color: '#061812' }}>
              <MapPin size={15} /> Use My Location
            </button>
          </div>
        )}

        {permissionState === 'denied' && (
          <div className="rounded-2xl p-6 text-center" style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.6)' }}>
            <p className="text-noor-muted text-sm mb-4">Location access was denied. Showing the default Gujrat, Pakistan calculation.</p>
            <CompassVisual angle={qiblaBearing} />
          </div>
        )}

        {(permissionState === 'granted' || permissionState === 'denied') && (
          <div className="space-y-5">
            <div className="rounded-2xl p-5" style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.6)' }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <p className="text-noor-muted text-xs">Qibla direction</p>
                  <p className="font-display text-noor-gold text-3xl font-bold">{Math.round(qiblaBearing)}°</p>
                </div>
                {orientationSupported && (
                  <button onClick={requestCompass} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs border border-noor-gold/30 text-noor-gold">
                    <RotateCcw size={13} /> Enable Compass
                  </button>
                )}
              </div>
              <CompassVisual angle={compassAngle} live={deviceHeading !== null} />
              <p className="text-center text-noor-muted text-xs mt-3">
                {deviceHeading !== null
                  ? 'Rotate your phone until the gold needle points straight ahead.'
                  : 'North-based Qibla bearing. Enable the compass on a supported mobile device for live guidance.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl p-4" style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.6)' }}>
                <p className="text-noor-muted text-xs mb-1">Distance to Kaaba</p>
                <p className="font-display text-noor-gold text-2xl font-bold">{Math.round(distance).toLocaleString()}</p>
                <p className="text-noor-muted text-xs">kilometers</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: '#103329', border: '1px solid rgba(26,64,53,0.6)' }}>
                <p className="text-noor-muted text-xs mb-1">Location</p>
                <p className="text-noor-ivory text-sm font-medium mt-2 truncate">{location.name}</p>
                <p className="text-noor-muted text-[10px]">{location.lat.toFixed(4)}° N · {location.lon.toFixed(4)}° E</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CompassVisual({ angle, live }: { angle: number; live?: boolean }) {
  return (
    <div className="flex justify-center">
      <div className="relative w-56 h-56">
        <div className="absolute inset-0 rounded-full" style={{ background: '#103329', border: '2px solid rgba(232,189,75,0.25)' }} />
        {['N', 'E', 'S', 'W'].map((dir, i) => {
          const a = i * 90;
          const rad = (a - 90) * (Math.PI / 180);
          const r = 96;
          return (
            <span key={dir} className="absolute text-xs font-bold" style={{
              left: 112 + r * Math.cos(rad),
              top: 112 + r * Math.sin(rad),
              transform: 'translate(-50%, -50%)',
              color: dir === 'N' ? '#E8BD4B' : '#A9B8B1',
            }}>{dir}</span>
          );
        })}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 224 224" aria-hidden="true">
          {Array.from({ length: 36 }, (_, i) => {
            const a = (i * 10 - 90) * (Math.PI / 180);
            const major = i % 9 === 0;
            const r1 = major ? 76 : 79;
            const r2 = 82;
            return <line key={i} x1={112 + r1 * Math.cos(a)} y1={112 + r1 * Math.sin(a)} x2={112 + r2 * Math.cos(a)} y2={112 + r2 * Math.sin(a)} stroke={major ? 'rgba(232,189,75,0.4)' : 'rgba(26,64,53,0.6)'} strokeWidth={major ? 1.5 : 0.8} />;
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center transition-transform duration-200" style={{ transform: `rotate(${angle}deg)` }}>
          <div className="relative h-20 w-0.5">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0" style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderBottom: '32px solid #E8BD4B' }} />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0" style={{ borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '20px solid rgba(232,189,75,0.3)' }} />
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#E8BD4B' }}>
            <Navigation size={13} style={{ color: '#061812' }} />
          </div>
        </div>
        {live && <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-widest text-noor-accent">Live</div>}
      </div>
    </div>
  );
}
