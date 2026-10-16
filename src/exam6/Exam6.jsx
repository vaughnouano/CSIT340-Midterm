import { useState } from "react";
import { initialState, issueReducer } from "./issueReducer.js";
import usePersistentReducer from "./usePersistentReducer.js";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function Exam6() {
  const [state, dispatch] = usePersistentReducer(
    issueReducer,
    initialState,
    "issue-tracker",
  );
  const [title, setTitle] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    // payload shape matches what the reducer reads: action.payload.title
    dispatch({ type: "ADD_ISSUE", payload: { title } });
    setTitle("");
  };

  const openCount = state.issues.filter((i) => !i.done).length;
  const doneCount = state.issues.length - openCount;

  const visible = state.issues.filter((i) => {
    if (state.filter === "open") return !i.done;
    if (state.filter === "done") return i.done;
    return true;
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Issue Tracker</h2>

      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          placeholder="New issue title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button type="submit">Add</Button>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        {["all", "open", "done"].map((f) => (
          <Button
            key={f}
            size="sm"
            variant={state.filter === f ? "default" : "outline"}
            onClick={() =>
              dispatch({ type: "SET_FILTER", payload: { filter: f } })
            }
          >
            {f}
          </Button>
        ))}
        <Button
          size="sm"
          variant="destructive"
          onClick={() => dispatch({ type: "CLEAR_DONE" })}
        >
          Clear done
        </Button>
      </div>

      <div className="flex gap-2">
        <Badge variant="secondary">All: {state.issues.length}</Badge>
        <Badge variant="outline">Open: {openCount}</Badge>
        <Badge>Done: {doneCount}</Badge>
      </div>

      <ul className="divide-y rounded-md border">
        {visible.length === 0 && (
          <li className="px-3 py-2 text-sm text-muted-foreground">
            No issues here.
          </li>
        )}
        {visible.map((issue) => (
          <li
            key={issue.id}
            className="flex items-center gap-3 px-3 py-2 text-sm"
          >
            <input
              type="checkbox"
              className="size-4 accent-primary"
              checked={issue.done}
              onChange={() =>
                dispatch({ type: "TOGGLE_ISSUE", payload: { id: issue.id } })
              }
            />
            <span
              className={`flex-1 ${issue.done ? "text-muted-foreground line-through" : ""}`}
            >
              #{issue.id} {issue.title}
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() =>
                dispatch({ type: "DELETE_ISSUE", payload: { id: issue.id } })
              }
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
