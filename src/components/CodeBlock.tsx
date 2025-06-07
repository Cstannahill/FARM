import { Clipboard } from 'lucide-react'
import { useState } from 'react'

export default function CodeBlock({ className = '', children }: { className?: string; children: string }) {
  const [copied, setCopied] = useState(false)
  const code = String(children).trim()
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <pre className={`relative my-4 rounded border p-4 overflow-auto ${className}`}>
      <button onClick={handleCopy} className="absolute right-2 top-2 text-xs flex items-center gap-1">
        <Clipboard className="w-3 h-3" /> {copied ? 'Copied' : 'Copy'}
      </button>
      <code>{children}</code>
    </pre>
  )
}
