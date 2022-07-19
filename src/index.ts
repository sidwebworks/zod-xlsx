import { utils, WorkBook } from "xlsx"
import { ZodError, ZodSchema } from "zod"
import type { Result, ValidatorOptions } from "./types"
import { defaultsOptions, toObject } from "./utils"

function createValidator(workbook: WorkBook, opts?: ValidatorOptions) {
  const options = {
    ...defaultsOptions,
    ...opts,
  }

  const sheetName = options.sheetName || workbook.SheetNames.flat()[0]

  const sheet = workbook.Sheets[sheetName]

  if (!sheet) {
    throw Error(
      `No sheets were found in the workbook by name ${options.sheetName}`,
    )
  }

  const [header, ...rows] = utils.sheet_to_json(sheet, {
    blankrows: options.blankrows,
    skipHidden: options.skipHidden,
    header: options.header,
  })

  const parse = (row: any, schema: ZodSchema) => {
    const data = toObject(row, header)
    try {
      schema.parse(data)
      options.onValid && options.onValid(data)
      return { issues: [], isValid: true, data }
    } catch (error) {
      if (error instanceof ZodError) {
        options.onInvalid && options.onInvalid(data)
        return { issues: error.issues, isValid: false, data }
      }
      throw error
    }
  }

  const validate = (schema: ZodSchema): Result => {
    const result = rows.map((row) => parse(row, schema))

    return {
      valid: result.filter((r) => r.isValid),
      invalid: result.filter((r) => !r.isValid),
    }
  }

  return { validate, rows, header }
}

export { createValidator }
