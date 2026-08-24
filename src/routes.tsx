import { useEffect } from 'react';
import { createBrowserRouter, Outlet, useLocation } from 'react-router';

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
import StoryDetail from './pages/StoryDetail';
import Blog from './pages/Blog';
import SunnahHabits from './pages/SunnahHabits';

// Agat aapke paas ye components hain to import kar lein:
// import About from './pages/About';
// import Privacy from './pages/Privacy';
// import Terms from './pages/Terms';
// import Contact from './pages/Contact';

function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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

// Temporary Placeholder Component (jab tak real pages na bane hon)
function InfoPage({ title }: { title: string }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-noor-muted">This page is under construction. Check back soon!</p>
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
      { path: '/stories/:slug', element: <StoryDetail /> },
      { path: '/blog', element: <Blog /> },
      { path: '/sunnah-habits', element: <SunnahHabits /> },
      { path: '/sunnah-habits/:slug', element: <SunnahHabits /> },

      /* Legal & Support Routes (Added to fix 404 Error) */
      { path: '/about', element: <InfoPage title="About Us" /> },
      { path: '/privacy', element: <InfoPage title="Privacy Policy" /> },
      { path: '/terms', element: <InfoPage title="Terms & Conditions" /> },
      { path: '/contact', element: <InfoPage title="Contact Support" /> },
    ],
  },
]);
