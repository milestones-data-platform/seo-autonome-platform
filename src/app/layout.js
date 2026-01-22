import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthenticatedLayout from '@/components/layout/AuthenticatedLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SEO Autonome Platform',
  description: 'Plateforme de SEO autonome avec architecture en boucle fermée',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>
          <AuthenticatedLayout>
            {children}
          </AuthenticatedLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
