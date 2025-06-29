# Perplexity Clone 🫠

A modern AI-powered search interface built with Next.js, TypeScript, and Tailwind CSS. This application mimics the Perplexity AI search experience, providing intelligent answers to user queries with source citations and related questions.

## ✨ Features

- **🔍 AI-Powered Search**: Get intelligent answers to your questions using OpenAI's API
- **📚 Source Citations**: View the sources used to generate answers with toggle interface
- **🔗 Related Questions**: Discover 5 AI-generated similar questions for deeper exploration
- **🎨 Modern UI**: Clean, Perplexity-inspired interface with grainy gradients and smooth animations
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **⚡ Real-time Search**: Instant results as you type and press Enter
- **🌙 Dark Mode Support**: Seamless dark/light theme integration
- **🔧 Multiple Search Modes**: Toggle between Search, Research, and Labs modes
- **💬 Follow-up Questions**: Continue conversations with contextual follow-up queries
- **🎯 Interactive Icons**: Hover tooltips and click actions for enhanced UX

## 🚀 Tech Stack

- **Frontend**: Next.js 15.3.4, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **AI Integration**: OpenAI API for response generation
- **Search API**: SerpAPI for web search results
- **Icons**: Lucide React
- **Package Manager**: PNPM

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- PNPM
- OpenAI API key
- SerpAPI key

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd typescript-app
```

2. **Install dependencies**:
```bash
pnpm install
```

3. **Set up environment variables**:
Create a `.env.local` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
SERP_API_KEY=your_serp_api_key_here
```

4. **Run the development server**:
```bash
pnpm dev
```

5. **Open your browser**:
Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate/          # AI response generation endpoint
│   │   └── search/            # Search results endpoint
│   ├── globals.css            # Global styles and Tailwind configuration
│   ├── layout.tsx             # Root layout component
│   └── page.tsx               # Main page component
├── components/
│   ├── SearchInterface.tsx    # Main search interface component
│   └── ui/                    # shadcn/ui components
└── lib/
    └── utils.ts               # Utility functions
```

## 🎯 Key Components

### SearchInterface
The main component that handles:
- User input and search functionality
- State management for questions, answers, and UI states
- API calls to search and generation endpoints
- Toggle between Answer and Sources views
- Related questions display and interaction
- Follow-up question handling

### API Routes
- `/api/search` - Fetches search results using SerpAPI
- `/api/generate` - Generates AI responses and related questions using OpenAI

## 📖 Usage

1. **Initial Search**: Enter your question in the search box and press Enter
2. **View Results**: Toggle between "Answer" and "Sources" to see AI-generated responses or search sources
3. **Explore Related**: Click on any related question to dive deeper into the topic
4. **Follow-up**: Use the bottom chat box to ask follow-up questions
5. **Search Modes**: Switch between Search, Research, and Labs modes using the left toggle menu
6. **Voice & Tools**: Access additional features via the right-side icon menu

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key for generating responses | Yes |
| `SERP_API_KEY` | Your SerpAPI key for web search results | Yes |

## 🗺️ Roadmap

### 📋 Upcoming Features

- [ ] **Enhanced Markdown Formatting**: Implement proper markdown rendering for AI responses with support for:
  - Headers and subheaders
  - Bold and italic text
  - Code blocks and inline code
  - Lists and bullet points
  - Links and advanced formatting

- [ ] **Source Reference Links**: Add clickable `[X]` reference numbers in answers that:
  - Link directly to corresponding sources
  - Highlight the relevant source when clicked
  - Provide seamless navigation between answer and sources
  - Show preview on hover

- [ ] **Advanced Search Features**:
  - Source filtering and search refinement options
  - Search history and bookmarking
  - Export functionality for answers and sources
  - Voice input with speech-to-text integration

- [ ] **Enhanced User Experience**:
  - Collaborative features for sharing searches
  - Real-time typing indicators
  - Auto-save draft questions
  - Keyboard shortcuts and navigation

### 🔧 Technical Improvements

- [ ] **Performance Optimization**: 
  - Request caching and optimization
  - Lazy loading for better performance
  - Background prefetching of related content

- [ ] **Quality & Reliability**:
  - Enhanced error handling and retry mechanisms
  - Comprehensive testing suite
  - Performance monitoring and analytics

- [ ] **Accessibility & Mobile**:
  - Full WCAG compliance
  - Enhanced mobile interface and touch interactions
  - Improved keyboard navigation

## 💻 Development

### Available Scripts

```bash
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Development Features

- **Hot Reload**: Instant updates during development
- **TypeScript**: Full type safety and IntelliSense
- **ESLint**: Code quality and consistency
- **Modern Architecture**: Uses Next.js App Router and React Server Components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Perplexity AI](https://perplexity.ai) for the inspiration and design patterns
- [OpenAI](https://openai.com) for the powerful AI capabilities
- [shadcn/ui](https://ui.shadcn.com) for the beautiful component library
- [Tailwind CSS](https://tailwindcss.com) for the utility-first styling system
- [Lucide](https://lucide.dev) for the clean, consistent icons
