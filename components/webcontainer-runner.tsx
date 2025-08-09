'use client'

import { useEffect, useRef, useState } from 'react'
import type { DeepPartial } from 'ai'
import type { FragmentSchema } from '@/lib/schema'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Loader2, Play, Square } from 'lucide-react'

export function WebContainerRunner({
  fragment,
}: {
  fragment: DeepPartial<FragmentSchema>
}) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [status, setStatus] = useState<'idle' | 'installing' | 'running' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')
  const [serverUrl, setServerUrl] = useState<string>('')

  async function bootAndRun() {
    setStatus('installing')
    setMessage('Booting WebContainer...')

    try {
      const { WebContainer } = await import('@webcontainer/api')
      const wc = await WebContainer.boot()

      // Write files
      if (!Array.isArray(fragment.code)) {
        setStatus('error')
        setMessage('This project is missing multiple files. Ask to generate a full project with package.json.')
        return
      }

      // Ensure package.json exists
      const hasPkg = fragment.code
        .filter((f): f is NonNullable<typeof f> => Boolean(f))
        .some((f) => f.file_path === 'package.json')
      if (!hasPkg) {
        setStatus('error')
        setMessage('No package.json found. Ask to generate a full Next.js project including package.json.')
        return
      }

      // Write all files
      for (const file of fragment.code.filter((f): f is NonNullable<typeof f> => Boolean(f))) {
        const path = '/' + (file.file_path || '').replace(/^\/+/, '')
        await wc.fs.mkdir(path.split('/').slice(0, -1).join('/'), { recursive: true } as any)
        await wc.fs.writeFile(path, file.file_content || '')
      }

      setMessage('Installing dependencies...')
      const install = await wc.spawn('bash', ['-lc', 'npm install'])
      install.output.pipeTo(
        new WritableStream({
          write(data) {
            // you can capture logs if needed
          },
        }),
      )
      const code = await install.exit
      if (code !== 0) {
        setStatus('error')
        setMessage('npm install failed')
        return
      }

      setMessage('Starting dev server...')
      wc.on('server-ready', (port, url) => {
        setServerUrl(url)
        if (iframeRef.current) iframeRef.current.src = url
        setStatus('running')
      })

      // Start dev server (Next.js default)
      await wc.spawn('bash', ['-lc', 'npm run dev'])
    } catch (e: any) {
      setStatus('error')
      setMessage(String(e?.message || e))
    }
  }

  function stop() {
    // Reload iframe to drop the running process context
    if (iframeRef.current) iframeRef.current.src = 'about:blank'
    setServerUrl('')
    setStatus('idle')
    setMessage('')
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="border-b p-2 flex items-center gap-2">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              {status !== 'running' ? (
                <Button size="sm" onClick={bootAndRun} disabled={status === 'installing'}>
                  {status === 'installing' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              ) : (
                <Button size="sm" variant="secondary" onClick={stop}>
                  <Square className="h-4 w-4" />
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent>{status !== 'running' ? 'Run in browser' : 'Stop'}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="text-xs text-muted-foreground">
          {status === 'idle' && 'Ready'}
          {status === 'installing' && message}
          {status === 'running' && (serverUrl || 'Running...')}
          {status === 'error' && message}
        </span>
      </div>
      <iframe ref={iframeRef} className="h-full w-full" sandbox="allow-forms allow-scripts allow-same-origin" />
    </div>
  )
}