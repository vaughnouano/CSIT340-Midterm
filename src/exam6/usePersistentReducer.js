import { useEffect, useReducer } from "react";

// custom hook: useReducer + localStorage
export default function usePersistentReducer(
  reducer,
  initialState,
  storageKey,
) {
  // third argument runs only once, so the state loads once
  const [state, dispatch] = useReducer(reducer, initialState, (initial) => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial; // corrupted or blocked storage
    }
  });

  // save after every state change
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state, storageKey]);

  return [state, dispatch];
}
