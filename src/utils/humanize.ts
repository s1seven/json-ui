export const humanizeKey = (key: string) =>
  key
    .split(/(?<=[a-z])(?=[A-Z])/)
    .map((word) =>
      word === word.toUpperCase()
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
