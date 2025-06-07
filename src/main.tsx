import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/theme-provider'
import { MDXProvider } from '@mdx-js/react'
import CodeBlock from './components/CodeBlock'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <MDXProvider components={{ pre: CodeBlock }}>
        <App />
      </MDXProvider>
    </ThemeProvider>
  </StrictMode>,
)
