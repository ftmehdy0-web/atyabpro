import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getProductById } from '../data/catalog';
import { readStored, writeStored } from '../lib/storage';

const KEY = 'atyab.wishlist.v1';
const isIds = (v: unknown): v is string[] => Array.isArray(v) && v.every((x) => typeof x === 'string');

interface Wishlist {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
}

const Ctx = createContext<Wishlist | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState(() => readStored(KEY, isIds, []).filter((id) => getProductById(id)));

  useEffect(() => writeStored(KEY, ids), [ids]);

  const toggle = useCallback(
    (id: string) => setIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])),
    [],
  );
  const value = useMemo(() => {
    const set = new Set(ids);
    return { ids, has: (id: string) => set.has(id), toggle };
  }, [ids, toggle]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWishlist() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useWishlist outside WishlistProvider');
  return ctx;
}
