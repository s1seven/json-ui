import { JSONSchema7 } from "json-schema";
import { mutable } from "./utils/mutable";

export interface State {
  schema?: JSONSchema7;
  value?: unknown;
}

export const initialState: State = {};

export const state = mutable(initialState);
export const schema = state.select("schema");
export const value = state.select("value");
