

## Remove 5-suggestion limit in GuessInput

**Problem**: The autocomplete dropdown in `GuessInput.tsx` currently caps filtered suggestions at 5 results (`.slice(0, 5)` on line 26). Typing "THE" should show all matching show names.

**Change**: In `src/components/GuessInput.tsx`, remove the `.slice(0, 5)` call so all matching suggestions appear. The dropdown already has `max-h-48 overflow-y-auto` for scrolling, so longer lists will be scrollable.

**Single edit**: Line 26, change:
```ts
).slice(0, 5);
```
to:
```ts
);
```

