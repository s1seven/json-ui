import { JSONSchema7 } from "json-schema";
import { mutable } from "./utils/mutable";

export interface State {
  schema?: JSONSchema7;
  value?: unknown;
  path?: string;
}

export const initialState: State = { path: "", value: {} };

export const state = mutable(initialState);
export const schema = state.select("schema");
export const value = state.select("value");
export const path = state.select("path");
