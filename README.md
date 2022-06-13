

# ZOD-XLSX

[![npm version](https://badgen.net/npm/v/zod-xlsx)](https://www.npmjs.com/package/zod-xlsx)
![npm downloads](https://badgen.net/npm/dt/zod-xlsx)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)


> A xlsx based resource validator using Zod schemas

**Supports both ESM and CJS**

## Installation
> Note: 
> This package requires [Zod](https://www.npmjs.com/package/zod) and [xlsx](https://www.npmjs.com/package/xlsx) as peer dependencies

```bash
# With npm
npm install zod-xlsx xlsx zod

# With yarn
yarn add zod-xlsx xlsx zod

# With pnpm
pnpm add zod-xlsx xlsx zod
```

## Usage

The library exports a single function called `createValidator` which takes in a xlsx workbook and creates a validator object. 

Please make sure your sheet (xlsx or xls) file contains only header content for the columns as it's required for the library to function properly.

```ts
import { createValidator } from "zod-xlsx"
import xlsx from "xlsx"

const workbook = xlsx.readFile(/*path to your file*/)

const validator = createValidator(workbook);

const schema = z.object({
  'First Name': z.string(),
  'Last Name': z.string(),
  Gender: z.enum(['Male', 'Female']),
  Country: z.string(),
  Age: z.number(),
  Date: z.string(),
  Id: z.number(),
});

const result = await validator.validate(schema);
```

**OUTPUT**
```js
 {
   valid: [
    { issues: [], isValid: true, data: [Object] },
    { issues: [], isValid: true, data: [Object] },
    { issues: [], isValid: true, data: [Object] },
    { issues: [], isValid: true, data: [Object] },
   ]
    invalid: [
    { issues: [Object], isValid: false, data: [Object] },
    { issues: [Object], isValid: false, data: [Object] },
    { issues: [Object], isValid: false, data: [Object] },
    ]
  }
```



## API Reference

### **createValidator**
Function to create a new validator object with the given workbook.
It takes an options object as the second arguement.

```ts
export interface ValidatorOptions {
  // Comes from xlsx
  header?: Sheet2JSONOpts["header"]
  blankrows?: Sheet2JSONOpts["blankrows"]
  skipHidden?: Sheet2JSONOpts["skipHidden"]

  // Zod-xlsx options
  sheetName?: string
  onValid?: (data: any) => void
  onInvalid?: (data: any) => void
}
```

- **sheetName**: name of the sheet to use, defaults to the first sheet in the document.

- **onValid**: hook which gets called after every valid item is processed.

- **onValid**: hook which gets called after every invalid item is processed.

> For details on what each of the xlsx option does can be found: [Here](https://docs.sheetjs.com/docs/api/utilities#json)



## License

MIT &copy; [sidwebworks](https://github.com/sidwebworks)
