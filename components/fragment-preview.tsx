'use client'

import { FragmentWeb } from './fragment-web'
import { PyodideInterpreter } from './pyodide-interpreter'
import { ExecutionResult } from '@/lib/types'
import { FragmentSchema } from '@/lib/schema'
import { DeepPartial } from 'ai'

export function FragmentPreview({
  fragment,
  result,
}: {
  fragment: DeepPartial<FragmentSchema>
  result: ExecutionResult | undefined
}) {
  if (fragment?.template === 'code-interpreter-v1') {
    return <PyodideInterpreter fragment={fragment} />
  }

  if (!result) return null
  return <FragmentWeb result={result} />
}
