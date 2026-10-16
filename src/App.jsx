import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Exam1 from "./exam1/Exam1.jsx";
import Exam2 from "./exam2/Exam2.jsx";
import Exam3 from "./exam3/Exam3.jsx";
import Exam4 from "./exam4/Exam4.jsx";
import Exam5 from "./exam5/Exam5.jsx";
import Exam6 from "./exam6/Exam6.jsx";

const TABS = [
  { id: 1, label: "Task Counter", view: <Exam1 /> },
  { id: 2, label: "Live Search", view: <Exam2 /> },
  { id: 3, label: "Form Toolkit", view: <Exam3 /> },
  { id: 4, label: "Preferences", view: <Exam4 /> },
  { id: 5, label: "Products", view: <Exam5 /> },
  { id: 6, label: "Issue Tracker", view: <Exam6 /> },
];

export default function App() {
  const [active, setActive] = useState(1);
  const current = TABS.find((t) => t.id === active);

  return (
    <div className="mx-auto min-h-screen max-w-3xl space-y-4 p-6">
      <h1 className="text-3xl font-bold">React Hooks Practical Exam</h1>
      <nav className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <Button
            key={t.id}
            size="sm"
            variant={t.id === active ? "default" : "outline"}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </Button>
        ))}
      </nav>
      <Card>
        <CardContent
          key={active}
          className="animate-in fade-in slide-in-from-bottom-2 pt-6 duration-300"
        >
          {current.view}
        </CardContent>
      </Card>
    </div>
  );
}
