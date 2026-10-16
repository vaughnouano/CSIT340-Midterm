# React Hooks Practical Exam

One Vite + React app with all six exams as tabs. Only React Hooks are used (no state library).

## Run
```
npm install
npm run dev
npm test      # Exam 6 reducer tests
```

## Completed requirements
| Exam | Hooks | Status |
|------|-------|--------|
| 1 Smart Task Counter | useState | Done: count/target, +/-/reset, +2 with two functional updates, derived status, disabled at target |
| 2 Live Search and Timer | useEffect, useState | Done: delayed search with cancel, 1s timer with cleanup, title shows result count |
| 3 Accessible Form Toolkit | useRef, useState | Done: controlled inputs, 3 refs, validation, focus first invalid, previous email in a ref |
| 4 Application Preferences | useContext, useState | Done: one context, provider, theme + font size (14/16/18), usePreferences throws outside provider |
| 5 Product Explorer | useMemo, useCallback | Done: 600 products, search/category/sort, memo(ProductList), stable callback, counter test |
| 6 Issue Tracker | useReducer, custom hook | Done: 5 actions, pure reducer, usePersistentReducer (localStorage), All/Open/Done, 3 tests |

## Debugging explanations
**Exam 1** - `setCount(count + 1)` twice reads the same `count` captured by that render, so both calls queue "set to 1" and the result is one. `setCount(c => c + 1)` gets the latest queued value, so the click adds two.

**Exam 2** - An effect that updates a state it depends on reruns forever, so the search effect depends only on `query`. The timer was stuck at one because the callback captured the first `seconds`; the fix is `setSeconds(s => s + 1)` with `[]` dependencies. Cleanups: `clearTimeout` cancels the old delayed search when the query changes, and `clearInterval` stops the timer on unmount.

**Exam 3** - Changing `ref.current` does not schedule a render, because React only rerenders on state updates. Data shown on screen must be state. The previous email is read and written only in the submit handler.

**Exam 4** - Without a provider, `useContext` returns the default value (`null` here, so the hook throws a clear error). Provider and consumers must import the same context object from one file. Context removes prop drilling because any child reads the value directly, so Dashboard and Toolbar do not forward preference props.

**Exam 5** - `query` was added to the `useMemo` dependencies to fix stale results. The callback uses a functional update, so it needs no stale `selectedId`. The analytics call moved from `useMemo` to `useEffect` because it is a side effect.

**Exam 6** - The reducer returns new objects with spread/map/filter and never mutates. Dispatch sends `payload: { title }` to match `action.payload`. The `default` branch returns `state`, not `undefined`.

## Memoization not needed (Exam 5)
Memoizing a cheap calculation, such as adding two numbers or filtering a 5-item list, costs more (dependency checks and memory) than it saves. It is only worth it for expensive work or for props passed to memoized children.

## Known limitations
- Exam 5 only displays the first 50 matches (all 600 are filtered) to keep the page fast.
- Exam 4 uses `Exam4` as the top of the tree instead of a separate `App` per exam.
- No automated tests for Exams 1 to 5; use the manual steps below.

## Test steps
1. **Exam 1**: target 5 and count 0 shows "Not started". Count 4 then +2 goes to 5 and "Target reached", with Increment and +2 disabled. Decrement at 0 stays 0. Reset after the target returns to 0.
2. **Exam 2**: type fast and only the last query shows. The timer goes up once per second. Click "Unmount timer" and then mount again; it restarts from 0 with no double speed. The tab title shows the result count.
3. **Exam 3**: submit empty and focus goes to Name. Fix name and focus goes to Email, then Password. Submit twice with valid data and the second success shows the first email as the previous one.
4. **Exam 4**: toggle the theme and the font size; Dashboard and the preview change together.
5. **Exam 5**: open the console. Click the counter and only the counter changes, with no "Filtering" or "ProductList rendered" logs. Typing in search logs both.
6. **Exam 6**: add, toggle, delete and filter issues, then refresh the page and the data stays. Run `npm test`.
