import { PrayerTimes, Coordinates, CalculationMethod, Madhab } from 'adhan';

export interface PrayerTimesResult {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

// Global Prayer Times Calculation Function
export function getPrayerTimes(latitude?: number, longitude?: number): PrayerTimesResult {
  // Default coordinates (Islamabad, Pakistan ya koi bhi default location)
  const lat = latitude ?? 33.6844;
  const lng = longitude ?? 73.0479;

  const coordinates = new Coordinates(lat, lng);
  const date = new Date();

  // Calculation parameters (Muslim World League + Hanafi Madhab for Pakistan)
  const params = CalculationMethod.MuslimWorldLeague();
  params.madhab = Madhab.Hanafi;

  const prayerTimes = new PrayerTimes(coordinates, date, params);

  return {
    fajr: formatTime(prayerTimes.fajr),
    sunrise: formatTime(prayerTimes.sunrise),
    dhuhr: formatTime(prayerTimes.dhuhr),
    asr: formatTime(prayerTimes.asr),
    maghrib: formatTime(prayerTimes.maghrib),
    isha: formatTime(prayerTimes.isha),
  };
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

// Notification Permission aur Alarm Trigger karne ka function
export async function setupPrayerNotifications(times: PrayerTimesResult) {
  if (!("Notification" in window)) return;

  if (Notification.permission !== "granted") {
    await Notification.requestPermission();
  }
}

export function playAzanAudio() {
  const audio = new Audio("https://islamicfinder.org/audio/adhan.mp3");
  audio.play().catch(err => console.log("Audio play blocked:", err));
}
