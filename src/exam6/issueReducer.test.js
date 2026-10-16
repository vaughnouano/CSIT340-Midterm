import test from "node:test";
import assert from "node:assert/strict";
import { issueReducer, initialState } from "./issueReducer.js";

test("ADD_ISSUE adds an open issue and increases nextId", () => {
  const next = issueReducer(initialState, {
    type: "ADD_ISSUE",
    payload: { title: "Fix bug" },
  });
  assert.deepEqual(next.issues, [{ id: 1, title: "Fix bug", done: false }]);
  assert.equal(next.nextId, 2);
  assert.equal(initialState.issues.length, 0); // original not mutated
});

test("TOGGLE_ISSUE flips done without mutating the old issue", () => {
  const start = {
    issues: [{ id: 1, title: "A", done: false }],
    filter: "all",
    nextId: 2,
  };
  const next = issueReducer(start, {
    type: "TOGGLE_ISSUE",
    payload: { id: 1 },
  });
  assert.equal(next.issues[0].done, true);
  assert.equal(start.issues[0].done, false);
});

test("CLEAR_DONE removes only completed issues", () => {
  const start = {
    issues: [
      { id: 1, title: "A", done: true },
      { id: 2, title: "B", done: false },
    ],
    filter: "all",
    nextId: 3,
  };
  const next = issueReducer(start, { type: "CLEAR_DONE" });
  assert.deepEqual(
    next.issues.map((i) => i.id),
    [2],
  );
});
