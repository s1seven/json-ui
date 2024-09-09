import Ajv2019 from "ajv/dist/2019";
import draft7MetaSchema from "ajv/dist/refs/json-schema-draft-07.json";
import { AJV_ALLOWED_KEYWORDS } from "../constants";
import addFormats from "ajv-formats";

export const ajv = new Ajv2019();

export const ajvFactory = () => {
	const ajv = new Ajv2019();
	ajv.addMetaSchema(draft7MetaSchema);
	addFormats(ajv);
	AJV_ALLOWED_KEYWORDS.forEach((keyword) => {
		ajv.addKeyword(keyword);
	});
	return ajv;
};

addFormats(ajv);
ajv.addMetaSchema(draft7MetaSchema);

AJV_ALLOWED_KEYWORDS.forEach((keyword) => {
	ajv.addKeyword(keyword);
});
