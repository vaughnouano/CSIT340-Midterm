import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

export default function SessionTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // FIXED: functional update, so the callback never gets stuck on the first value
    const intervalId = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    // cleanup: stop the interval on unmount so no duplicate timer keeps running
    return () => clearInterval(intervalId);
  }, []); // empty array: the interval is created only once

  return <Badge variant="secondary">Session time: {seconds}s</Badge>;
}
