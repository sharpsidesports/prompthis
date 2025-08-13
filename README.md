# WriteMyGPT

A modern, user-friendly website that helps people create better ChatGPT prompts. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Smart Templates**: Pre-built prompt templates for different use cases (Content Writing, Programming, Creative Writing, Business Analysis, Education, Problem Solving)
- **Customizable Parameters**: Dynamic parameter replacement for personalized prompts
- **Custom Prompt Input**: Write your own prompts from scratch
- **Copy & Download**: Easy export of generated prompts
- **Beautiful UI**: Modern glass-morphism design with smooth animations
- **Responsive Design**: Works perfectly on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd writemygpt
```

2. Install dependencies:
```bash
npm install
```

3. Set up your OpenAI API key:
   - Copy `env.example` to `.env`
   - Replace `your_openai_api_key_here` with your actual OpenAI API key
   - Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

1. **Choose a Template**: Select from one of the pre-built prompt templates
2. **Customize Parameters**: Fill in the dynamic parameters for your specific needs
3. **Or Write Custom**: Use the custom prompt input to write your own prompt
4. **Generate with AI**: Click the "Generate Prompt with AI" button to create an enhanced prompt using OpenAI
5. **Export**: Copy to clipboard or download the generated prompt

## OpenAI Integration

This application uses OpenAI's GPT-3.5-turbo model to enhance and improve your prompts. The AI will:

- **Enhance template-based prompts** with additional context and details
- **Improve custom prompts** by making them more specific and actionable
- **Add professional language** and clear instructions
- **Ensure completeness** and effectiveness for ChatGPT

## Available Templates

- **Content Writer**: Create engaging blog posts and articles
- **Code Assistant**: Get help with programming and debugging
- **Creative Storyteller**: Generate creative stories and narratives
- **Business Analyst**: Analyze business problems and provide insights
- **Learning Tutor**: Get educational explanations and tutorials
- **Problem Solver**: Break down complex problems into solutions

## Technologies Used

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icons
- **Create React App**: Zero-configuration build tool

## Project Structure

```
src/
├── App.tsx          # Main application component
├── index.tsx        # React entry point
└── index.css        # Global styles and Tailwind imports

public/
└── index.html       # HTML template

tailwind.config.js   # Tailwind CSS configuration
tsconfig.json        # TypeScript configuration
package.json         # Dependencies and scripts
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with modern web technologies for optimal user experience
- Inspired by the need for better ChatGPT prompt creation tools
- Icons provided by Lucide React 