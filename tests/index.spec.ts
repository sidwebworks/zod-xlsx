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

  const result = await validator.validate(badSchema)

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

  const result = await validator.validate(schema)

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

  const spy = vitest.spyOn(console, "log")

  const validator = createValidator(workbook, {
    onValid: () => {
      console.log("VALID")
    },
  })

  const result = await validator.validate(schema)

  assert.strictEqual(spy.mock.calls.length, result.valid.length)

  spy.mockClear()
})