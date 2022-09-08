/**
 * Public Types
 */

import { Sheet2JSONOpts } from "xlsx"
import type { ZodIssue } from "zod"

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
