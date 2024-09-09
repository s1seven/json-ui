const selectKeys = ["Enter", " ", "ArrowDown"];

export const ifSelectKey =
  (callback: (event: KeyboardEvent) => any) => (event: KeyboardEvent) =>
    selectKeys.includes(event.key) && (event.preventDefault(), callback(event));
