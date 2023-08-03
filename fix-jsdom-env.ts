import JSDOMEnvironment from "jest-environment-jsdom";

// https://github.com/jsdom/jsdom/issues/3363#issuecomment-1467894943
export default class extends JSDOMEnvironment {
  constructor(...args: ConstructorParameters<typeof JSDOMEnvironment>) {
    super(...args);
    this.global.structuredClone = structuredClone;
  }
}
