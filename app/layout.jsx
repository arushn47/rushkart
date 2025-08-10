import './globals.css';
import Provider from '@/components/Provider'; // NextAuth Provider
import { CartProvider } from '@/components/CartContext'; // Import the new CartProvider

export const metadata = {
  title: 'RushKart',
  description: 'Find Your Next Favorite Thing.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <CartProvider>
            {children}
          </CartProvider>
        </Provider>
      </body>
    </html>
  );
}
