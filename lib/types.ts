import { TemplateId } from './templates'

export type ExecutionResultWeb = {
  template: Exclude<TemplateId, 'code-interpreter-v1'>
  url?: string
}

export type ExecutionResult = ExecutionResultWeb
