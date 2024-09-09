import Ajv from "ajv";
import { AJV_ALLOWED_KEYWORDS } from "../constants";
import addFormats from "ajv-formats";

export const ajv = new Ajv();

export const ajvFactory = () => {
  const ajv = new Ajv();
  addFormats(ajv);
  AJV_ALLOWED_KEYWORDS.forEach((keyword) => {
    ajv.addKeyword(keyword);
  });
  return ajv;
}

addFormats(ajv);

AJV_ALLOWED_KEYWORDS.forEach((keyword) => {
  ajv.addKeyword(keyword);
});
