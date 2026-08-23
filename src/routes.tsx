import { createBrowserRouter, Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

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

function Layout() {
  return (
    <div className="min-h-screen bg-[#061812] text-noor-ivory">
      <Navbar />

      <main className="min-h-screen">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
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
      { path: '/sunnah-habits', element: <SunnahHabits /> },
    ],
  },
]);
