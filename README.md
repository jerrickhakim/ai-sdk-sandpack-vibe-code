# AI SDK Sandpack Vibe Code

A simple AI-powered code editor starter built with Next.js, AI SDK, and Sandpack. This project combines the power of AI assistance with an interactive code environment, allowing you to chat with an AI that can directly edit and run your code in real-time.

Message from author: As of now, this is the bare minimum of an AI Vibe coding app. Over the last 4 months I've been working on building a "vibe code app" and had a lot of fun. My experience with that made me want to share it with others. This is a lightweight fork of the larger app I've been working on. I wanted to create a starting point that is easy to understand for others to build upon.

## 🚀 Features

- **AI-Powered Code Assistant**: Chat with an AI that can view, edit, create, and delete files in your project
- **Live Code Preview**: Real-time code execution and preview using Sandpack
- **Interactive File Management**: AI can manipulate your project files directly through the chat interface
- **Responsive Design**: Clean, modern UI with resizable panels
- **Multiple AI Models**: Support for various AI models through Vercel AI gateway (currently configured for Moonshot AI's Kimi)
- **File Operations**: Full CRUD operations on project files through AI commands

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **AI Integration**: AI SDK, AI SDK React
- **Code Editor**: Sandpack React
- **UI Components**: HeroUI, Framer Motion
- **State Management**: Nanostores, Zustand
- **Styling**: Tailwind CSS v4
- **Package Manager**: Bun

## 📦 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ai-sdk-sandpack-vibe-code
```

2. Install dependencies:

```bash
bun install
```

3. Set up your environment variables:
   Create a `.env.local` file in the root directory and add:

   ```
   AI_GATEWAY_API_KEY=your_vercel_ai_gateway_api_key_here
   ```

4. Run the development server:

```bash
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎯 How It Works

### AI Tools Integration

The app includes custom AI tools that allow the AI to interact with your code:

- **`textEditor`**: Full-featured text editing helper with commands:
  - `view`: View file contents or directory listings
  - `str_replace`: Replace text in files
  - `create`: Create new files
  - `insert`: Insert text at specific line numbers
  - `delete`: Delete files

### Chat Interface

The chat interface allows you to:

- Ask the AI to help with coding tasks
- Request file modifications
- Get explanations about your code
- Have the AI write new features

### Code Preview

The preview panel shows:

- Live code execution using Sandpack
- File explorer
- Console output
- Toggle between preview and code editor views

## 🏗️ Project Structure

```
├── ai/
│   └── tools/           # AI tool definitions
├── app/
│   ├── api/chat/        # Chat API endpoint
│   └── ...              # Next.js app directory
├── components/
│   ├── App.tsx          # Main app component
│   ├── Chat.tsx         # Chat interface
│   ├── Preview.tsx      # Sandpack preview
│   └── Sidebar.tsx      # Sidebar component
├── stores/
│   ├── appStore.ts      # App state management
│   └── projectsStore.ts # Projects state
└── ...
```

## ⚙️ Configuration

### AI Model Configuration

The app uses the Vercel AI gateway to test multiple models. It's currently configured to use Moonshot AI's Kimi model. You can modify the model in `/app/api/chat/route.tsx`:

```typescript
model: "moonshotai/kimi-k2",
// model: "google/gemini-2.5-flash",
// model: "anthropic/claude-sonnet-4",
```

### Available AI Models

The app supports various AI models through the Vercel AI gateway and AI SDK:

- Moonshot AI (Kimi)
- Google Gemini
- Anthropic Claude
- And more...

## 🚧 Development Status

**⚠️ This project is still being actively developed and may have incomplete features or bugs.**

Current development areas:

- Enhanced AI tool capabilities
- Improved UI/UX
- Better error handling
- Additional AI model support
- Performance optimizations

## 🤝 Contributing

This is a starter template that's still being worked on. Feel free to:

- Report issues
- Suggest improvements
- Submit pull requests
- Fork and customize for your needs

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [AI SDK](https://sdk.vercel.ai/) for AI integration
- [Sandpack](https://sandpack.codesandbox.io/) for the code editor
- [Next.js](https://nextjs.org/) for the framework
- [HeroUI](https://heroui.com/) for UI components

---

**Note**: This is a work-in-progress project. Some features may not be fully implemented or may change as development continues.
