# Zwicky Box Idea Generator

An AI-powered web application that helps you generate innovative ideas using the Zwicky Box (morphological analysis) method combined with Claude AI.

## Features

- **AI-Powered Attribute Generation**: Automatically generate relevant attributes (dimensions) with guiding questions for your challenge using Claude AI
- **Interactive Zwicky Box Interface**: Full CRUD operations for attributes, questions, and items
- **Editable Guiding Questions**: Each attribute includes an editable question to help users think of relevant items
- **Smart Item Selection**: Select specific items or let the system randomly choose for exploration
- **AI Idea Generation**: Generate creative, actionable ideas based on selected attribute combinations
- **Progressive Idea Expansion**: Ideas are generated as concise summaries first (2-4 sentences), saving tokens and time. Expand promising ideas on-demand to get full execution details
- **AI-Powered Idea Variations**: Generate improved, more realistic variations of any idea using a specialist critique AI agent
- **Multi-language Support**: AI responds in the same language as your input
- **Markdown Formatting**: Ideas are rendered with proper markdown formatting for better readability
- **Import/Export**: Save and load your Zwicky Box configurations as JSON files
- **Idea History**: Track and review all generated ideas with their components
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Single-Session Tool**: No login required, start using immediately

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool and dev server
- **Express** - Backend proxy server
- **Tailwind CSS** - Styling
- **Shadcn/ui** - UI component library
- **Claude API (Anthropic)** - AI-powered attribute and idea generation
- **React Markdown** - Markdown rendering for ideas
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js (v20.19+ or v22.12+ required by Vite)
- npm or yarn
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jpfaraco/zwicky.git
cd zwicky
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and add your Anthropic API key:
```
VITE_ANTHROPIC_API_KEY=your_actual_api_key_here
```

### Running the Application

The application requires two servers to run:

1. **Start the proxy server** (in one terminal):
```bash
npm run server
```
This starts the Express backend proxy on `http://localhost:3001` that handles API requests to Anthropic.

2. **Start the development server** (in another terminal):
```bash
npm run dev
```
This starts the Vite dev server at `http://localhost:5173`

The frontend (Vite) will proxy API calls to the backend server, which securely handles your API key.

### Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## How to Use

1. **Enter Your Challenge**: Describe the problem or opportunity you want to explore in the challenge input field.

2. **Generate Attributes**: Click "Generate Attributes" to let AI create 3-5 relevant attributes with guiding questions for your challenge, or manually add attributes using the "Add Attribute" button.

3. **Review Guiding Questions**: Each attribute includes a question to help you think of relevant items. Click on any question to edit it.

4. **Add Items**: For each attribute column, click "+ Add Item" to add specific options. Press Enter to quickly add multiple items in sequence.

5. **Select Items**: Click on items to select them (one per attribute). Selected items will be highlighted. If you select items from some but not all columns, ideas will only use your selections.

6. **Generate Ideas**: Click "Generate Idea" to create an AI-powered solution. If you haven't selected any items, the system will randomly choose one from each attribute. Ideas are initially generated as concise 2-4 sentence summaries.

7. **Review Ideas**: All generated ideas appear in the "Generated Ideas" section below, showing the idea title, description, and which components were used (if applicable).

8. **Expand Ideas**: Click the "Expand" button on any idea to generate full execution details including:
   - Step-by-step execution plan (3-5 steps)
   - Quick test methodology (hypothesis, experiment, success metrics)
   - Risks & compliance considerations with mitigations
   - Required resources (people, tools, budget)

9. **Generate Variations**: Click "Generate variation" on any idea to create an improved, more realistic version using a specialist critique AI agent. Variations maintain the core intent but address weaknesses and unrealistic assumptions.

10. **Import/Export**: Use the Import/Export buttons to save your Zwicky Box configuration as JSON or load a previously saved configuration.

11. **Iterate**: Adjust your selections and generate multiple ideas to explore different solution combinations.

## Features in Detail

### Attribute Management
- **AI Generation**: Automatically generate relevant attributes with guiding questions from your challenge description
- **Manual Addition**: Add custom attributes manually
- **Edit Names**: Click on attribute names to edit them inline
- **Edit Questions**: Click on guiding questions to edit them inline
- **Delete**: Hover over an attribute and click the X button to remove it

### Item Management
- **Add Items**: Populate each attribute with specific options
- **Quick Entry**: Press Enter while editing an item to create a new item below
- **Edit Items**: Double-click items to edit them inline
- **Auto-cleanup**: Empty items are automatically deleted when you click away
- **Delete**: Hover over an item to reveal the X button
- **Select**: Click items to select them for idea generation (only one per column)

### Idea Generation & Management
- **Selective Mode**: If any items are selected, ideas will only use those selections
- **Random Mode**: If no items are selected, the system randomly chooses one from each attribute
- **Progressive Generation**: Initial ideas are concise summaries (2-4 sentences) to save time and API tokens
- **On-Demand Expansion**: Click "Expand" to generate full execution details for promising ideas
- **AI Critique & Variations**: Generate improved variations of any idea using a specialist critique AI that identifies weaknesses and suggests more realistic alternatives
- **Multi-language**: Ideas are generated in the same language as your input
- **Markdown Rendering**: Ideas support markdown formatting with proper hierarchy and spacing
- **History**: All ideas and variations are saved to a history list during your session
- **Components Display**: See which attribute items were used for each idea (hidden for variations that don't use components)

### Import/Export
- **Export**: Download your Zwicky Box as a JSON file (challenge, attributes, questions, and items)
- **Import**: Load a previously saved JSON file to restore your work
- **Validation**: Import automatically validates file structure and shows errors for invalid files
- **Auto-clear**: Ideas are cleared when importing to avoid confusion

## API Configuration

The application uses Claude API for AI-powered features:
- **Model**: `claude-sonnet-4-20250514`
- **Max Tokens**:
  - Attribute generation: 1500 tokens
  - Initial idea summary: 300 tokens
  - Idea expansion: 1200 tokens
  - Idea variation: 350 tokens
- **API Version**: `2023-06-01`

The progressive generation approach (summary first, expand on demand) significantly reduces API costs by only generating full details for promising ideas.

Make sure your API key has sufficient credits for the operations you plan to perform.

## Deployment

The app is deployed on Vercel and uses serverless functions for API proxying. The production deployment automatically:
- Uses Vercel serverless functions in `/api` directory for secure API key handling
- Serves the static frontend from the build output
- Requires `VITE_ANTHROPIC_API_KEY` environment variable to be set in Vercel project settings

## Project Structure

```
zwicky-app/
├── api/
│   └── anthropic/v1/
│       └── messages.js      # Vercel serverless function for API proxy
├── src/
│   ├── components/
│   │   ├── ui/              # Shadcn/ui components
│   │   │   ├── button.jsx
│   │   │   ├── input.jsx
│   │   │   ├── textarea.jsx
│   │   │   └── card.jsx
│   │   ├── ChallengeInput.jsx    # Challenge input component
│   │   ├── ZwickyBox.jsx         # Zwicky Box grid component
│   │   └── IdeasList.jsx         # Generated ideas display
│   ├── services/
│   │   └── anthropicService.js   # API service functions
│   ├── utils/
│   │   └── zwickyBoxExport.js    # Import/Export utilities
│   ├── lib/
│   │   └── utils.js         # Utility functions (cn helper)
│   ├── App.jsx              # Main application component
│   ├── App.css              # Application styles
│   ├── index.css            # Global styles with Tailwind
│   └── main.jsx             # Application entry point
├── public/                  # Static assets
├── server.js                # Express proxy server (local dev)
├── vercel.json              # Vercel configuration
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules (includes .env)
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── vite.config.js           # Vite configuration
└── package.json             # Project dependencies
```

## Important Notes

- **No Data Persistence**: All data is stored in-memory and will be lost when you refresh the page
- **Export for Persistence**: Use the Export feature to save your work as JSON files
- **Session-Based**: This is a single-session tool with no user accounts or data storage
- **API Costs**: Each AI operation (attribute generation, idea generation, expansion, variation) consumes API credits. The progressive generation approach helps minimize costs by only generating full details when needed
- **Token Optimization**: Ideas are generated progressively (summary first, details on demand) to reduce API costs and improve response times
- **Error Handling**: The app includes error handling for API failures and invalid imports
- **Security**: API keys are never exposed to the browser (handled by backend/serverless functions)

## Troubleshooting

### API Key Not Working
- Make sure your `.env` file is in the `zwicky-app` directory
- Verify the API key is correctly copied (no extra spaces)
- Restart **both** the proxy server and development server after adding the API key
- Check that the proxy server is running on port 3001

### CORS or Network Errors
- Ensure both servers are running (proxy server on 3001, Vite on 5173)
- Check that no other applications are using ports 3001 or 5173
- Verify the proxy server logs show incoming requests

### Tailwind Styles Not Applying
- Clear your browser cache
- Restart the development server
- Check that `tailwind.config.js` and `postcss.config.js` are in the project root

### Build Errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Make sure you're using Node.js v20.19+ or v22.12+ (required by Vite 7)

## Future Enhancements

See the PRD document for potential future features including:
- Data persistence and user accounts
- Export functionality (PDF, CSV)
- Collaborative editing
- Template library
- Advanced AI features (batch generation, idea refinement)
- Analytics and insights

## License

MIT

## Credits

Built with:
- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Claude API by Anthropic](https://www.anthropic.com/)
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [Lucide Icons](https://lucide.dev/)
