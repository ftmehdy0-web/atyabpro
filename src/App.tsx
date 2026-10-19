import { lazy, Suspense, useLayoutEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ScrollTrigger } from './lib/gsap';
import Home from './pages/Home';
import { CartProvider } from './state/cart';
import { WishlistProvider } from './state/wishlist';

const Shop = lazy(() => import('./pages/Shop'));
const ProductPage = lazy(() => import('./pages/Product'));
const Bag = lazy(() => import('./pages/Bag'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const NotFound = lazy(() => import('./pages/NotFound'));

/** New pages start at the top; returning with the back button keeps the browser's own position. */
function RouteChange() {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    // Let pages that just mounted measure their triggers against the new layout.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <CartProvider>
        <WishlistProvider>
          <RouteChange />
          <Header />
          <main id="main" tabIndex={-1}>
            <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:category" element={<Shop />} />
                <Route path="/product/:slug" element={<ProductPage />} />
                <Route path="/bag" element={<Bag />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <CartDrawer />
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
