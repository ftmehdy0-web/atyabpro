import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { getProductById } from '../data/catalog';
import type { Product } from '../data/types';
import { readStored, writeStored } from '../lib/storage';

const KEY = 'atyab.cart.v1';
const MAX_QTY = 20;

export interface CartLine {
  id: string;
  /** Size label for products sold in sizes; empty otherwise. */
  size: string;
  qty: number;
}

export interface ResolvedLine extends CartLine {
  key: string;
  product: Product;
  unitPrice: number;
}

type Action =
  | { type: 'add'; id: string; size: string; qty: number }
  | { type: 'set'; id: string; size: string; qty: number }
  | { type: 'remove'; id: string; size: string }
  | { type: 'clear' };

const isLines = (v: unknown): v is CartLine[] =>
  Array.isArray(v) &&
  v.every((l) => l && typeof l.id === 'string' && typeof l.size === 'string' && Number.isInteger(l.qty));

const clamp = (n: number) => Math.max(1, Math.min(MAX_QTY, n));
const same = (l: CartLine, id: string, size: string) => l.id === id && l.size === size;

function reducer(lines: CartLine[], a: Action): CartLine[] {
  switch (a.type) {
    case 'add': {
      const existing = lines.find((l) => same(l, a.id, a.size));
      if (!existing) return [...lines, { id: a.id, size: a.size, qty: clamp(a.qty) }];
      return lines.map((l) => (l === existing ? { ...l, qty: clamp(l.qty + a.qty) } : l));
    }
    case 'set':
      return lines.map((l) => (same(l, a.id, a.size) ? { ...l, qty: clamp(a.qty) } : l));
    case 'remove':
      return lines.filter((l) => !same(l, a.id, a.size));
    case 'clear':
      return [];
  }
}

export interface CartActions {
  add: (id: string, size?: string, qty?: number) => void;
  setQty: (id: string, size: string, qty: number) => void;
  remove: (id: string, size: string) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
}

interface CartState {
  lines: ResolvedLine[];
  count: number;
  subtotal: number;
  drawerOpen: boolean;
}

const StateCtx = createContext<CartState | null>(null);
const ActionsCtx = createContext<CartActions | null>(null);

function resolve(lines: CartLine[]): ResolvedLine[] {
  const out: ResolvedLine[] = [];
  for (const l of lines) {
    const product = getProductById(l.id);
    if (!product) continue; // a product removed from the catalogue drops out of the bag
    const size = product.sizes?.find((s) => s.label === l.size);
    if (product.sizes && !size) continue;
    out.push({ ...l, key: `${l.id}|${l.size}`, product, unitPrice: size ? size.price : product.price });
  }
  return out;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, undefined, () => readStored(KEY, isLines, []));
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => writeStored(KEY, lines), [lines]);

  const actions = useMemo<CartActions>(
    () => ({
      add: (id, size = '', qty = 1) => {
        dispatch({ type: 'add', id, size, qty });
        setDrawerOpen(true);
      },
      setQty: (id, size, qty) => dispatch({ type: 'set', id, size, qty }),
      remove: (id, size) => dispatch({ type: 'remove', id, size }),
      clear: () => dispatch({ type: 'clear' }),
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    }),
    [],
  );

  const state = useMemo<CartState>(() => {
    const resolved = resolve(lines);
    let count = 0;
    let subtotal = 0;
    for (const l of resolved) {
      count += l.qty;
      subtotal += l.qty * l.unitPrice;
    }
    return { lines: resolved, count, subtotal, drawerOpen };
  }, [lines, drawerOpen]);

  return (
    <ActionsCtx.Provider value={actions}>
      <StateCtx.Provider value={state}>{children}</StateCtx.Provider>
    </ActionsCtx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(StateCtx);
  if (!ctx) throw new Error('useCart outside CartProvider');
  return ctx;
}

/** Stable actions; components that only add to the bag do not re-render when it changes. */
export function useCartActions() {
  const ctx = useContext(ActionsCtx);
  if (!ctx) throw new Error('useCartActions outside CartProvider');
  return ctx;
}

export const MAX_LINE_QTY = MAX_QTY;
