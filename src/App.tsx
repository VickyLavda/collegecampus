import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Clean from './pages/Clean';
import Health from './pages/Health';
import LifeHacks from './pages/LifeHacks';
import Supermarket from './pages/Supermarket';
import SOS from './pages/SOS';
import NotFound from './pages/NotFound';
import './i18n/config';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Set the theme color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name=theme-color]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#0D1B2A');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = '#0D1B2A';
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/home" element={<Layout><Home /></Layout>} />
            <Route path="/recipes" element={<Layout><Recipes /></Layout>} />
            <Route path="/recipes/:id" element={<Layout><RecipeDetail /></Layout>} />
            <Route path="/clean" element={<Layout><Clean /></Layout>} />
            <Route path="/health" element={<Layout><Health /></Layout>} />
            <Route path="/hacks" element={<Layout><LifeHacks /></Layout>} />
            <Route path="/supermarket" element={<Layout><Supermarket /></Layout>} />
            <Route path="/sos" element={<Layout><SOS /></Layout>} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
