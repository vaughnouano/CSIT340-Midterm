import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Exam 1 - Smart Task Counter (useState)
export default function Exam1() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(5);

  // status is derived from state, so there is NO separate status state
  const reachedTarget = count >= target;
  let status = "In progress";
  if (count === 0) status = "Not started";
  else if (reachedTarget) status = "Target reached";

  const increment = () => setCount((c) => Math.min(c + 1, target));
  const decrement = () => setCount((c) => Math.max(c - 1, 0)); // never negative
  const reset = () => setCount(0);

  // FIXED: two queued functional updates, each one gets the latest value
  const addTwo = () => {
    setCount((c) => Math.min(c + 1, target));
    setCount((c) => Math.min(c + 1, target));
  };

  const changeTarget = (e) => {
    const value = Number(e.target.value);
    setTarget(value < 1 ? 1 : value);
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-xl">Smart Task Counter</CardTitle>
        <CardDescription>
          Track the tasks you finish in a study session.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Label htmlFor="target">Target tasks</Label>
          <Input
            id="target"
            type="number"
            min="1"
            value={target}
            onChange={changeTarget}
            className="w-24"
          />
        </div>
        <p className="text-5xl font-bold">
          {count} / {target}
        </p>
        <Badge variant={reachedTarget ? "default" : "secondary"}>
          {status}
        </Badge>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={decrement} disabled={count === 0}>
          Decrement
        </Button>
        <Button onClick={increment} disabled={reachedTarget}>
          Increment
        </Button>
        <Button onClick={addTwo} disabled={reachedTarget}>
          +2
        </Button>
        <Button variant="destructive" onClick={reset}>
          Reset
        </Button>
      </CardFooter>
    </Card>
  );
}
