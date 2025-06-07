# Configuration

Project settings live in `farm.config.ts`. This file controls database options, AI providers and build settings.

Example:

```ts
export default defineConfig({
  database: 'mongodb',
  aiProvider: 'ollama',
})
```
