import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import Home from './pages/Home';
import Quran from './pages/Quran';
import Hadith from './pages/Hadith';
import Duas from './pages/Duas';
import Qibla from './pages/Qibla';
import Calendar from './pages/Calendar';
import Zakat from './pages/Zakat';
import Stories from './pages/Stories';
import Blog from './pages/Blog';
import InfoPage from './pages/InfoPage';
import StoryDetail from './pages/StoryDetail';
import Donate from './pages/Donate';
import Journey from './pages/Journey';
import Tasbeeh from './pages/Tasbeeh';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: 'quran', Component: Quran },
      { path: 'hadith', Component: Hadith },
      { path: 'duas', Component: Duas },
      { path: 'qibla', Component: Qibla },
      { path: 'calendar', Component: Calendar },
      { path: 'zakat', Component: Zakat },
      { path: 'stories', Component: Stories },
      { path: 'stories/:slug', Component: StoryDetail },
      { path: 'blog', Component: Blog },
      { path: 'donate', Component: Donate },
      { path: 'journey', Component: Journey },
      { path: 'tasbeeh', Component: Tasbeeh },
      { path: 'privacy', Component: InfoPage },
      { path: 'terms', Component: InfoPage },
      { path: 'contact', Component: InfoPage },
      { path: 'about', Component: InfoPage },
    ],
  },
]);
