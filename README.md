# Zwicky Box Idea Generator

An AI-powered web application that helps you generate innovative ideas using the Zwicky Box (morphological analysis) method combined with Claude AI.

## Features

- **AI-Powered Attribute Generation**: Automatically generate relevant attributes (dimensions) for your challenge using Claude AI
- **Interactive Zwicky Box Interface**: Full CRUD operations for attributes and items
- **Smart Item Selection**: Select specific items or let the system randomly choose for exploration
- **AI Idea Generation**: Generate creative, actionable ideas based on selected attribute combinations
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
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js (v20.19+ or v22.12+ required by Vite)
- npm or yarn
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

1. Clone the repository:
```bash
cd zwicky-app
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

2. **Generate Attributes**: Click "Generate Columns" to let AI create 3-5 relevant attributes for your challenge, or manually add attributes using the "Add Attribute" button.

3. **Add Items**: For each attribute column, click "+ Add Item" to add specific options. You can add as many items as you need.

4. **Select Items**: Click on items to select them (one per attribute). Selected items will be highlighted.

5. **Generate Ideas**: Click "Generate Idea" to create an AI-powered solution. If you haven't selected items, the system will randomly choose one from each attribute.

6. **Review Ideas**: All generated ideas appear in the "Generated Ideas" section below, showing the idea text and which components were used.

7. **Iterate**: Adjust your selections and generate multiple ideas to explore different solution combinations.

## Features in Detail

### Attribute Management
- **AI Generation**: Automatically generate relevant attributes from your challenge description
- **Manual Addition**: Add custom attributes manually
- **Rename**: Click on attribute names to edit them inline
- **Delete**: Remove attributes you don't need

### Item Management
- **Add Items**: Populate each attribute with specific options
- **Rename**: Double-click items to edit them inline
- **Delete**: Remove items you don't need
- **Select**: Click items to select them for idea generation

### Idea Generation
- **Selected Mode**: Generate ideas using your selected items
- **Random Mode**: Generate ideas with random selections when nothing is selected
- **History**: All ideas are saved to a history list during your session
- **Components Display**: See which attribute items were used for each idea

## API Configuration

The application uses Claude API for AI-powered features:
- **Model**: `claude-sonnet-4-20250514`
- **Max Tokens**: 1000 per request
- **API Version**: `2023-06-01`

Make sure your API key has sufficient credits for the operations you plan to perform.

## Project Structure

```
zwicky-app/
├── src/
│   ├── components/
│   │   └── ui/              # Shadcn/ui components
│   │       ├── button.jsx
│   │       ├── input.jsx
│   │       ├── textarea.jsx
│   │       └── card.jsx
│   ├── lib/
│   │   └── utils.js         # Utility functions (cn helper)
│   ├── App.jsx              # Main application component
│   ├── App.css              # Application styles
│   ├── index.css            # Global styles with Tailwind
│   └── main.jsx             # Application entry point
├── public/                  # Static assets
├── server.js                # Express proxy server
├── .env.example             # Environment variables template
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
├── vite.config.js           # Vite configuration
└── package.json             # Project dependencies
```

## Important Notes

- **No Data Persistence**: All data is stored in-memory and will be lost when you refresh the page
- **Session-Based**: This is a single-session tool with no user accounts or data storage
- **API Costs**: Each attribute generation and idea generation consumes API credits
- **Error Handling**: The app includes error handling for API failures with retry capability

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
- [Lucide Icons](https://lucide.dev/)
