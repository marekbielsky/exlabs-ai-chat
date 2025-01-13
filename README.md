# Exlabs AI Chat

A real-time chat application with OpenAI integration, built with React, NestJS, and WebSockets.

![Exlabs_AI_Chat_PReview](https://github.com/user-attachments/assets/987940ec-66e3-4b8b-b369-259e7c0e9dab)

## Prerequisites

- **Node.js**: v18 or higher
- **npm**: v10.2.4 or higher
- **OpenAI API Key**: Required for AI integration

## Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/marekbielsky/exlabs-ai-chat
   cd exlabs-ai-chat
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:

   - Create a `.env` file in `apps/backend`:
     ```plaintext
     OPENAI_API_KEY=your_openai_api_key_here
     JWT_SECRET=secret
     ```

4. **Start development servers**:

   ```bash
   npm run start:dev
   ```

   - **Frontend**: Runs on [http://localhost:5173](http://localhost:5173)
   - **Backend**: Runs on [http://localhost:3000](http://localhost:3000)

## Features

- Real-time chat interface
- OpenAI integration for AI responses
- WebSocket communication
- Dark theme UI
- Message attribution with logos

## Tech Stack

- **Frontend**:

  - React
  - Vite
  - Socket.io-client
  - TypeScript

- **Backend**:
  - NestJS
  - Socket.io
  - OpenAI API
  - TypeScript

## Development

The project uses Turborepo for monorepo management. Key commands:

- `npm run start:dev` - Start all applications in development mode
- `npm run lint` - Run linting across all applications

## Build

To build all applications, run the following command:

```bash
npm run build
```

**Note**: The build process is currently mocked and will simply output a message. The actual build steps will be implemented in the future.

## License

MIT
