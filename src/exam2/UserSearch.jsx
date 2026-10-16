import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const USERS = [
  { id: 1, name: 'Ana Cruz', role: 'Developer' },
  { id: 2, name: 'Ben Lim', role: 'Designer' },
  { id: 3, name: 'Cara Yu', role: 'Tester' },
  { id: 4, name: 'Dan Go', role: 'Developer' },
];

export default function UserSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(USERS);
  const [loading, setLoading] = useState(false);

  // search effect: runs only when query changes
  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => {
      const q = query.toLowerCase();
      setResults(
        USERS.filter((u) => u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q))
      );
      setLoading(false);
    }, 500);

    // cleanup: cancel the previous delayed search so old results never show
    return () => clearTimeout(timeoutId);
  }, [query]);

  // sync the document title with the number of visible results
  useEffect(() => {
    document.title = `${results.length} result(s)`;
  }, [results.length]);

  return (
    <div className="space-y-3">
      <Input placeholder="Search name or role" value={query} onChange={(e) => setQuery(e.target.value)} />
      {loading && <p className="text-sm text-muted-foreground">Searching...</p>}
      {!loading && results.length === 0 && <p className="text-sm text-muted-foreground">No users found.</p>}
      <ul className="divide-y rounded-md border">
        {results.map((u) => (
          <li key={u.id} className="flex items-center justify-between px-3 py-2 text-sm">
            {u.name}
            <Badge variant="outline">{u.role}</Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}
