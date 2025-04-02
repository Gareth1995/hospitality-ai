import './globals.css'
import { ReactNode } from 'react';  // Import ReactNode for typing
import { Inter } from 'next/font/google'
import { ThemeProvider } from './context/theme-context';
import {HeroProvider} from "./context/hero-provider";
import { HotelIDProvider } from './context/authContext';
import 'leaflet/dist/leaflet.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

interface RootLayoutProps {
  children: ReactNode; // Specify the type of children
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <HotelIDProvider>
          <HeroProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </HeroProvider>
        </HotelIDProvider>
      </body>
    </html>
  );
}

