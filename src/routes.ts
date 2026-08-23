import { createBrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Quran from './pages/Quran';
import Hadith from './pages/Hadith';
import Duas from './pages/Duas';
import Qibla from './pages/Qibla';
import Calendar from './pages/Calendar';
import Zakat from './pages/Zakat';
import Tasbeeh from './pages/Tasbeeh';
import Stories from './pages/Stories';
import Blog from './pages/Blog';
import SunnahHabits from './pages/SunnahHabits';

export const routes = [
  { path: '/', component: Home },
  { path: '/quran', component: Quran },
  { path: '/hadith', component: Hadith },
  { path: '/duas', component: Duas },
  { path: '/qibla', component: Qibla },
  { path: '/calendar', component: Calendar },
  { path: '/zakat', component: Zakat },
  { path: '/tasbeeh', component: Tasbeeh },
  { path: '/stories', component: Stories },
  { path: '/blog', component: Blog },
  { path: '/sunnah-habits', component: SunnahHabits }
];

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/quran', element: <Quran /> },
  { path: '/hadith', element: <Hadith /> },
  { path: '/duas', element: <Duas /> },
  { path: '/qibla', element: <Qibla /> },
  { path: '/calendar', element: <Calendar /> },
  { path: '/zakat', element: <Zakat /> },
  { path: '/tasbeeh', element: <Tasbeeh /> },
  { path: '/stories', element: <Stories /> },
  { path: '/blog', element: <Blog /> },
  { path: '/sunnah-habits', element: <SunnahHabits /> }
]);
