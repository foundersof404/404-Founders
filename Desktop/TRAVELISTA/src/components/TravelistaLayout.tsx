import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import ScrollToTopOnRouteChange from '@/components/ScrollToTopOnRouteChange';

const TravelistaLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading } = useAuth();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isHome = location.pathname === '/';

  if (loading && isAuthPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTopOnRouteChange />
      {/* Header */}
      <Header transparent={isHome} />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      {!isAuthPage && (
        <footer className="bg-secondary py-8 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="mb-6 md:mb-0 md:max-w-xs">
                <div className="flex items-center gap-2 text-xl font-semibold mb-3">
                  <span>Travelista</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your ultimate travel companion for exploring the world's most amazing destinations.
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <div>
                  <h4 className="font-medium mb-3">Company</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="/about" className="hover:text-primary transition-colors">About Us</a></li>
                    <li><a href="/careers" className="hover:text-primary transition-colors">Careers</a></li>
                    <li><a href="/blog" className="hover:text-primary transition-colors">Blog</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Support</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="/help" className="hover:text-primary transition-colors">Help Center</a></li>
                    <li><a href="/contact" className="hover:text-primary transition-colors">Contact Us</a></li>
                    <li><a href="/faq" className="hover:text-primary transition-colors">FAQs</a></li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Legal</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><a href="/terms" className="hover:text-primary transition-colors">Terms</a></li>
                    <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy</a></li>
                    <li><a href="/cookies" className="hover:text-primary transition-colors">Cookies</a></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border/50">
              <p className="text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} Travelista. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      )}
      <ScrollToTopButton />
    </div>
  );
};

export default TravelistaLayout;
