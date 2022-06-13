/**
 * Public Types
 */

import { Sheet2JSONOpts } from "xlsx"

export type Result = {}

export interface ValidatorOptions {
  header?: Sheet2JSONOpts["header"]
  sheetName?: string
  blankrows?: Sheet2JSONOpts["blankrows"]
  skipHidden?: Sheet2JSONOpts["skipHidden"]
}

/**
 * Custom Type guards
 */
export const isPath = (source: any): source is string => {
  return typeof source === "string"
}
