import { mutable } from "./mutable";

type GlobalState = {
  value: {
    user: {
      name: string;
    };
  };
  foo: string | { bar: string };
};

describe("mutable state management", () => {
  it("should set a value", () => {
    const state: GlobalState = {
      value: { user: { name: "Alice" } },
      foo: "bar",
    };
    const m = mutable(state);
    m.set({ value: { user: { name: "Bob" } }, foo: "baz" });
    expect(state.foo).toBe("baz");
  });

  it("should set a value at a subpath", () => {
    const state: GlobalState = {
      value: { user: { name: "Alice" } },
      foo: { bar: "baz" },
    };
    const m = mutable(state, "foo");
    m.set({ bar: "qux" });
    expect(state.foo).toEqual({ bar: "qux" });
  });

  it("should select a subpath and change nested value", () => {
    const state: GlobalState = {
      value: { user: { name: "Alice" } },
      foo: "bar",
    };
    const m = mutable(state);
    const subM = m.select("value.user");
    subM.set({ name: "Bob" });
    expect(state.value.user.name).toBe("Bob");
  });

  it("should call listener when value changes", () => {
    const state: GlobalState = {
      value: { user: { name: "Alice" } },
      foo: "bar",
    };
    const m = mutable(state);
    const listener = jest.fn();
    m.on(listener);
    m.set({ value: { user: { name: "Bob" } }, foo: "baz" });
    expect(listener).toHaveBeenCalledWith({
      value: { user: { name: "Bob" } },
      foo: "baz",
    });
  });

  it("should call listener when value is set even if not changed and nosy is false", () => {
    const state: GlobalState = {
      value: { user: { name: "Alice" } },
      foo: "bar",
    };
    const m = mutable(state);
    const listener = jest.fn();
    m.on(listener);
    m.set({ value: { user: { name: "Alice" } }, foo: "bar" });
    expect(listener).toHaveBeenCalledWith({
      value: { user: { name: "Alice" } },
      foo: "bar",
    });
  });
});
