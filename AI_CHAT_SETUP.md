# AI Chat Setup Guide

## 🔧 Local Development Setup

### 1. Environment Variables

Create a `.env.local` file in your project root:

```bash
# OpenAI API Key for AI Chat Assistant
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. Get OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Navigate to "API Keys" section
4. Click "Create new secret key"
5. Copy the key and add it to your `.env.local` file

### 3. Test the Integration

1. Start your development server: `npm run dev`
2. Open the documentation site
3. Click the "Ask AI Assistant" button
4. Try asking:
   - "What is FARM Framework?"
   - "How do I get started?"
   - "Explain Type-Sync features"

## 🚀 Vercel Deployment Setup

### 1. Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add a new variable:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key
   - **Environment**: Production (and Preview if needed)

### 2. Deploy

```bash
# Deploy to Vercel
vercel --prod
```

## 🔍 Troubleshooting

### Common Issues:

**"OpenAI API key not set" error:**

- Check that `OPENAI_API_KEY` is set in `.env.local`
- Restart your development server after adding the env var
- For Vercel: Ensure the env var is set in project settings

**"Method not allowed" error:**

- The API route expects POST requests only
- Check that the fetch call is using POST method

**"Failed to fetch from OpenAI" error:**

- Verify your OpenAI API key is valid
- Check your OpenAI account has available credits
- Ensure you have proper internet connectivity

### API Rate Limits:

- OpenAI has rate limits based on your plan
- Free tier: Limited requests per minute
- Paid tier: Higher limits based on usage tier

## 🎯 Features Included

✅ **Real OpenAI Integration** - Uses o4-mini model
✅ **FARM Framework Expertise** - Specialized system prompt
✅ **Markdown Rendering** - Beautiful formatting with syntax highlighting
✅ **Error Handling** - User-friendly error messages
✅ **Conversation History** - Maintains context across messages
✅ **Responsive Design** - Works on mobile and desktop
✅ **Type Safety** - Full TypeScript integration

## 📝 API Configuration

The chat uses these OpenAI settings:

- **Model**: `o4-mini-2025-04-16` (cost-effective and fast)
- **Max Tokens**: 512 (moderate response length)
- **Temperature**: 0.6 (balanced creativity/accuracy)

You can modify these in `api/chat.ts` if needed.
