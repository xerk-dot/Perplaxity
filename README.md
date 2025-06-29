# Perplexity Clone

A simple clone of Perplexity built with Next.js, TypeScript, and shadcn/ui components. This application allows users to submit queries and receive AI-powered responses based on search results with proper citations.

## Features

- 🔍 Search functionality using SerpAPI
- 🤖 AI-powered responses using OpenAI GPT-3.5-turbo
- 📚 Citation system with numbered references
- 🎨 Modern UI with shadcn/ui components
- 📱 Responsive design
- ⚡ Built with Next.js 15 and TypeScript

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   - Update `.env.local` with your API keys:
   - `OPENAI_API_KEY`: Your OpenAI API key (already configured)
   - `SERPAPI_KEY`: Your SerpAPI key (get one from https://serpapi.com/)

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`

## API Keys Required

- **OpenAI API Key**: Used for generating AI responses
- **SerpAPI Key**: Used for search functionality (get from https://serpapi.com/)

## Usage

1. Enter your question in the search box
2. Click "Search" or press Enter
3. View the AI-generated response with citations
4. Browse the source results below

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- OpenAI API
- SerpAPI
- Axios for HTTP requests

## Build

```bash
npm run build
```

## Deployment

The application can be deployed to Vercel, Netlify, or any other platform that supports Next.js applications.

Make sure to set the environment variables in your deployment platform.
