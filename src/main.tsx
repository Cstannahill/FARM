import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider'
import { MDXProvider } from '@mdx-js/react'
import CodeBlock from './components/CodeBlock'
import * as Typography from './components/ui/typography'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <MDXProvider
        components={{
          pre: CodeBlock,
          code: Typography.InlineCode,
          a: Typography.A,
          hr: Typography.Hr,
          ...Typography,
        }}
      >
        <App />
      </MDXProvider>
    </ThemeProvider>
  </StrictMode>,
)
