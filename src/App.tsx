import { lazy, Suspense, useEffect, useLayoutEffect, type ReactNode } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { ScrollTrigger } from './lib/gsap';
import { LangProvider } from './i18n/lang';
import Home from './pages/Home';
import { CartProvider } from './state/cart';
import { WishlistProvider } from './state/wishlist';

const pages = {
  shop: () => import('./pages/Shop'),
  product: () => import('./pages/Product'),
  bag: () => import('./pages/Bag'),
  wishlist: () => import('./pages/Wishlist'),
  account: () => import('./pages/Account'),
  missing: () => import('./pages/NotFound'),
};
const Shop = lazy(pages.shop);
const ProductPage = lazy(pages.product);
const Bag = lazy(pages.bag);
const Wishlist = lazy(pages.wishlist);
const Account = lazy(pages.account);
const NotFound = lazy(pages.missing);

/** Fetches the other pages while the browser is idle, so the first click never shows a blank loading state. */
function usePreloadPages() {
  useEffect(() => {
    const load = () => Object.values(pages).forEach((p) => void p());
    // Safari has no requestIdleCallback; a timeout after first paint does the same job there.
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(load, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(load, 2500);
    return () => clearTimeout(id);
  }, []);
}

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

/** Each page fades up as it arrives. */
function Page({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  return <div key={pathname} className="page">{children}</div>;
}

export default function App() {
  usePreloadPages();
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <LangProvider>
        <CartProvider>
          <WishlistProvider>
            <RouteChange />
            <Header />
            <main id="main" tabIndex={-1}>
              <Suspense fallback={<div className="page-loading" aria-busy="true" />}>
                <Page>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/shop/:category" element={<Shop />} />
                    <Route path="/product/:slug" element={<ProductPage />} />
                    <Route path="/bag" element={<Bag />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Page>
              </Suspense>
            </main>
            <Footer />
            <CartDrawer />
          </WishlistProvider>
        </CartProvider>
      </LangProvider>
    </BrowserRouter>
  );
}
