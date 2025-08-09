import { CodeView } from './code-view'
import { Button } from './ui/button'
import { CopyButton } from './ui/copy-button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Download, FileText, Package } from 'lucide-react'
import { useState } from 'react'

export function FragmentCode({
  files,
}: {
  files: { name: string; content: string }[]
}) {
  const [currentFile, setCurrentFile] = useState(files[0].name)
  const currentFileContent = files.find(
    (file) => file.name === currentFile,
  )?.content

  function download(filename: string, content: string) {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  async function ensureJSZip(): Promise<any> {
    // If JSZip is already loaded on window, reuse it
    if ((window as any).JSZip) return (window as any).JSZip
    // Inject script tag
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js'
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => reject(new Error('Failed to load JSZip'))
      document.body.appendChild(script)
    })
    return (window as any).JSZip
  }

  async function downloadZip() {
    const JSZip = await ensureJSZip()
    const zip = new JSZip()
    for (const f of files) {
      zip.file(f.name, f.content)
    }
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = 'fragment-project.zip'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center px-2 pt-1 gap-2">
        <div className="flex flex-1 gap-2 overflow-x-auto">
          {files.map((file) => (
            <div
              key={file.name}
              className={`flex gap-2 select-none cursor-pointer items-center text-sm text-muted-foreground px-2 py-1 rounded-md hover:bg-muted border ${
                file.name === currentFile ? 'bg-muted border-muted' : ''
              }`}
              onClick={() => setCurrentFile(file.name)}
            >
              <FileText className="h-4 w-4" />
              {file.name}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <CopyButton
                  content={currentFileContent || ''}
                  className="text-muted-foreground"
                />
              </TooltipTrigger>
              <TooltipContent side="bottom">Copy</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground"
                  onClick={() => download(currentFile, currentFileContent || '')}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Download</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {files.length > 1 && (
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground"
                    onClick={downloadZip}
                  >
                    <Package className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Export .zip</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      <div className="flex flex-col flex-1 overflow-x-auto">
        <CodeView
          code={currentFileContent || ''}
          lang={currentFile.split('.').pop() || ''}
        />
      </div>
    </div>
  )
}
