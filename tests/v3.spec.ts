import path from "path"
import { assert, it, vitest } from "vitest"
import { readFile } from "xlsx"
import z from "zod"
import { createValidator } from "../src"

it("creates a new validator", () => {
  const workbook = readFile(path.join(__dirname, "./mocks/demo.xls"))

  const validator = createValidator(workbook)

  assert.isArray(validator.header, "should return an array of sheet headers")

  assert.isArray(validator.rows, "Validator should return the sheet data rows")

  assert.isFunction(
    validator.validate,
    "Validator should return a validate function",
  )
})

it("returns an array of invalid items", async () => {
  const workbook = readFile(path.join(__dirname, "./mocks/demo.xls"))

  const badSchema = z.object({
    "First Name": z.number(),
    "Last Name": z.string(),
    Gender: z.enum(["Male", "Female"]),
    Country: z.number(),
    Age: z.number().max(26),
    Date: z.string(),
    Id: z.number(),
  })

  const validator = createValidator(workbook)

  const result = validator.validate(badSchema)

  assert.isNotEmpty(result.invalid)
  assert.isEmpty(result.valid)
})

it("returns an array of valid items", async () => {
  const workbook = readFile(path.join(__dirname, "./mocks/demo.xls"))

  const schema = z.object({
    "First Name": z.string(),
    "Last Name": z.string(),
    Gender: z.enum(["Male", "Female"]),
    Country: z.string(),
    Age: z.number(),
    Date: z.string(),
    Id: z.number(),
  })

  const validator = createValidator(workbook)

  const result = validator.validate(schema)

  assert.isNotEmpty(result.valid)
  assert.isEmpty(result.invalid)
})

it("calls the onValid hook when an item is valid", async () => {
  const workbook = readFile(path.join(__dirname, "./mocks/demo.xls"))

  const schema = z.object({
    "First Name": z.string(),
    "Last Name": z.string(),
    Gender: z.enum(["Male", "Female"]),
    Country: z.string(),
    Age: z.number(),
    Date: z.string(),
    Id: z.number(),
  })

  const fn = vitest.fn(() => {})

  const validator = createValidator(workbook, {
    onValid: fn,
  })

  const result = validator.validate(schema)

  assert.strictEqual(fn.mock.calls.length, result.valid.length)

  fn.mockClear()
})

it("processes batches asynchronously", async () => {
  const workbook = readFile(path.join(__dirname, "./mocks/demo.xls"))

  const schema = z.object({
    "First Name": z.string(),
    "Last Name": z.string(),
    Gender: z.enum(["Male", "Female"]),
    Country: z.string(),
    Age: z.number(),
    Date: z.string(),
    Id: z.number(),
  })

  const validator = createValidator(workbook)

  const result = await validator.validateAsync(schema, { batchSize: 250 })

  assert.isNotEmpty(result.valid)
  assert.isEmpty(result.invalid)
})

it("returns array of valid and transformed items", async () => {
  const workbook = readFile(path.join(__dirname, "./mocks/demo.xls"))

  const schema = z.object({
    "First Name": z.string(),
    "Last Name": z.string(),
    Gender: z.enum(["Male", "Female"]),
    Country: z.string(),
    Age: z.number(),
    Date: z
      .preprocess((val) => String(val).replace(/\//g, "-"), z.string())
      .transform((val) => new Date(val)),
    Id: z.number(),
  })

  const validator = createValidator(workbook)

  const result = await validator.validate(schema)

  assert.isEmpty(result.invalid)
  assert.isNotEmpty(result.valid)

  assert.instanceOf(result.valid[0].data.Date, Date)
})

it("process and transforms batches asynchronously", async () => {
  const workbook = readFile(path.join(__dirname, "./mocks/demo.xls"))

  const schema = z.object({
    "First Name": z.string(),
    "Last Name": z.string(),
    Gender: z.enum(["Male", "Female"]),
    Country: z.string(),
    Age: z.number(),
    Date: z
      .preprocess((val) => String(val).replace(/\//g, "-"), z.string())
      .transform((val) => new Date(val)),
    Id: z.number(),
  })

  const validator = createValidator(workbook)

  const result = await validator.validateAsync(schema, { batchSize: 250 })

  assert.isNotEmpty(result.valid)
  assert.isEmpty(result.invalid)
  assert.instanceOf(result.valid[0].data.Date, Date)
})
