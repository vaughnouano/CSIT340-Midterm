import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';

const CATEGORIES = ['Books', 'Games', 'Tools', 'Toys', 'Food'];

// 600 generated products, made once outside the component
const PRODUCTS = Array.from({ length: 600 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  category: CATEGORIES[i % CATEGORIES.length],
  price: ((i * 37) % 500) + 10,
}));

// memo: only rerenders when its props change
const ProductList = memo(function ProductList({ products, selectedId, onSelect }) {
  console.log('ProductList rendered');
  return (
    <ul className="divide-y rounded-md border">
      {products.slice(0, 50).map((p) => (
        <li
          key={p.id}
          className={`flex items-center justify-between gap-2 px-3 py-2 text-sm ${p.id === selectedId ? 'bg-accent' : ''}`}
        >
          <span>{p.name} <Badge variant="outline">{p.category}</Badge></span>
          <span className="flex items-center gap-3">
            ${p.price}
            <Button size="sm" variant={p.id === selectedId ? 'default' : 'outline'} onClick={() => onSelect(p.id)}>
              {p.id === selectedId ? 'Selected' : 'Select'}
            </Button>
          </span>
        </li>
      ))}
    </ul>
  );
});

export default function Exam5() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedId, setSelectedId] = useState(null);
  const [counter, setCounter] = useState(0); // unrelated state for testing

  // useMemo: recalculates ONLY when one of these 3 inputs changes
  const visibleProducts = useMemo(() => {
    console.log('Filtering and sorting...');
    const q = query.toLowerCase();
    const filtered = PRODUCTS.filter(
      (p) => p.name.toLowerCase().includes(q) && (category === 'All' || p.category === category)
    );
    return filtered.sort((a, b) => (sortOrder === 'asc' ? a.price - b.price : b.price - a.price));
  }, [query, category, sortOrder]); // query is included so results are never stale

  // useCallback: same function between renders (functional update, so no deps needed)
  const handleSelect = useCallback((id) => {
    setSelectedId((current) => (current === id ? null : id));
  }, []);

  // analytics belongs in useEffect, not inside useMemo (side effect)
  useEffect(() => {
    console.log('analytics: search used ->', query);
  }, [query]);

  const selected = PRODUCTS.find((p) => p.id === selectedId);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Product Explorer</h2>
      <div className="flex flex-wrap gap-2">
        <Input className="w-48" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
        <NativeSelect value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>All</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </NativeSelect>
        <NativeSelect value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="asc">Price low to high</option>
          <option value="desc">Price high to low</option>
        </NativeSelect>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <Button variant="secondary" size="sm" onClick={() => setCounter(counter + 1)}>
          Unrelated counter: {counter}
        </Button>
        <span>Selected: {selected ? selected.name : 'none'}</span>
      </div>
      <p className="text-sm text-muted-foreground">
        {visibleProducts.length} products found (showing first 50). Open the console to see renders.
      </p>

      <ProductList products={visibleProducts} selectedId={selectedId} onSelect={handleSelect} />
    </div>
  );
}
