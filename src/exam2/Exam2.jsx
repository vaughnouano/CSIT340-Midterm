import { useState } from 'react';
import { Button } from '@/components/ui/button';
import UserSearch from './UserSearch.jsx';
import SessionTimer from './SessionTimer.jsx';

// the toggle lets us mount/unmount the timer to test the cleanup
export default function Exam2() {
  const [showTimer, setShowTimer] = useState(true);
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Live Search and Timer</h2>
      <Button variant="outline" onClick={() => setShowTimer((s) => !s)}>
        {showTimer ? 'Unmount timer' : 'Mount timer'}
      </Button>
      {showTimer && <SessionTimer />}
      <UserSearch />
    </div>
  );
}
