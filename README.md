# JSON UI

A dynamic user interface for creating JSON documents according to a JSON schema.

![JSON UI Screenshot](./screenshot.png)



## TODO

- uniqueItems
- remove array items


## NOT SUPPORTED

- multiple types
- _nested oneOf, anyOf (think of inferring values)_
- _sub-objects within oneOf and anyOf (same reason)_
- null type
- true | false type
- inferring oneOf is a bit flawed if additionalProperties is true

## Paths

- Enum: `Certificate/Analysis/Inspections/0/ValueType`
- Enum Array: ``

## JSON UI decision tree
```
.
├── string
│   ├── file
│   │   └── file upload
│   │       ├── file type
│   │       └── size requirements
│   ├── enum
│   │   ├── dropdown (one of)
│   │   │   └── search functionality
│   │   ├── radio button
│   │   └── autocomplete
│   ├── date
│   │   └── date picker
│   │       ├── min / max date
│   │       └── time input
│   ├── password
│   │   └── password input
│   ├── color
│   │   └── color picker
│   ├── multiline
│   │   ├── textarea
│   │   │   └── min / max length
│   │   └── wysiwyg editor
│   │       └── ...
│   └── one line
│       └── text input
│           ├── min / max length
│           └── format / mask
│               ├── email
│               ├── password
│               ├── phone
│               ├── zip code
│               └── url
├── number
│   ├── enum
│   │   └── dropdown (single select)
│   ├── number picker
│   │   ├── min / max
│   │   ├── steps
│   │   ├── number format
│   │   └── decimal places
│   └── slider
│       ├── min / max
│       └── steps
├── boolean
│   ├── toggle
│   └── checkbox
├── object
│   └── section
│       ├── title
│       ├── level
│       └── collapsable
└── array
    ├── typed set (many of)
    │   ├── checkbox group
    │   └── multi select dropdown
    └── repeatable field group
        ├── min / max item count
        └── optional item type
``````