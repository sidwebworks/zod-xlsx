import { ZodSchema } from "./types"
import * as z3 from "zod/v3"
import * as z4 from "zod/v4/core"

export const toObject = <T = any>(cols: T[], keys: string[]) => {
  return keys.reduce((acc, curr, index) => {
    acc[curr] = cols[index]
    return acc
  }, {} as Record<string, T>)
}

export const defaultsOptions = { blankrows: false, header: 1, skipHidden: true }

export function parseSchema<T extends ZodSchema>(schema: T, data: any) {
  if ("_zod" in schema) {
    return z4.parse(schema, data) // Zod 4 schema
  } else {
    return schema.parse(data) // Zod 3 schema
  }
}

export function isZodError(error: any): error is z3.ZodError | z4.$ZodError {
  return error instanceof z3.ZodError || error instanceof z4.$ZodError
}
