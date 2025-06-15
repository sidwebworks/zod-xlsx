/**
 * Public Types
 */

import { Sheet2JSONOpts } from "xlsx"
import * as z3 from "zod/v3"
import * as z4 from "zod/v4/core"

export type ZodSchema = z3.ZodTypeAny | z4.$ZodType
export type ZodIssue = z3.ZodIssue | z4.$ZodIssue
export const ZodError = z3.ZodError || z4.$ZodError

export type Resource = {
  issues: ZodIssue[]
  isValid: boolean
  data: Record<string, any>
}

export type Result = {
  valid: Resource[]
  invalid: Resource[]
}

export interface ValidatorOptions {
  header?: Sheet2JSONOpts["header"]
  sheetName?: string
  blankrows?: Sheet2JSONOpts["blankrows"]
  skipHidden?: Sheet2JSONOpts["skipHidden"]
  onValid?: (data: any) => void
  onInvalid?: (data: any) => void
}

/**
 * Custom Type guards
 */
export const isPath = (source: any): source is string => {
  return typeof source === "string"
}
