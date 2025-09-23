# LinkedIn Word Cloud Generator

An online app for generating high-quality word clouds perfectly sized for LinkedIn profile banners (1200×400px).

![LinkedIn Word Cloud Generator](https://github.com/user-attachments/assets/c03cbc42-8cb9-4496-8b30-cd44db1a58be)

## Features

- 🎨 **Custom Color Palettes**: Choose your own colors for the word cloud
- 🔀 **Shuffle Functionality**: Generate new layouts with the same words
- 📝 **Line-Delimited Input**: Enter one word per line for easy organization
- 📏 **LinkedIn Banner Size**: Perfectly sized at 1200×400px for LinkedIn profiles
- 💾 **Download PNG**: Save your word cloud as a high-quality PNG image
- 🎯 **Professional Design**: Clean, modern interface with LinkedIn branding

## Live Demo Screenshots

### Initial Word Cloud
![Initial Word Cloud](https://github.com/user-attachments/assets/c03cbc42-8cb9-4496-8b30-cd44db1a58be)

### After Shuffle
![Shuffled Word Cloud](https://github.com/user-attachments/assets/d47284e8-a535-49aa-b59d-8beb03234840)

### Custom Professional Terms
![Custom Words](https://github.com/user-attachments/assets/ffc2d679-f0ae-4a3a-bcef-37a584f8e0ba)

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: CloudFlare Workers
- **Styling**: Modern CSS with responsive design
- **Canvas**: HTML5 Canvas for word cloud rendering

## Project Structure

```
liwordcloud/
├── frontend/          # React TypeScript application
│   ├── src/
│   │   ├── components/
│   │   │   ├── WordCloudGenerator.tsx
│   │   │   └── WordCloudGenerator.css
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── package.json
├── backend/           # CloudFlare Workers API
│   ├── src/
│   │   └── index.ts
│   ├── wrangler.toml
│   └── package.json
└── package.json       # Root package.json with scripts
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tsew/liwordcloud.git
cd liwordcloud
```

2. Install all dependencies:
```bash
npm run install:all
```

### Development

Start both frontend and backend in development mode:

```bash
# Terminal 1: Start the backend (CloudFlare Workers)
npm run dev:backend

# Terminal 2: Start the frontend (React)
npm run dev:frontend
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8787

### Building for Production

```bash
# Build frontend
npm run build:frontend

# Build backend
npm run build:backend
```

## API Endpoints

### POST `/api/generate-wordcloud`

Generates a word cloud from input text.

**Request Body:**
```json
{
  "input": "React\nTypeScript\nJavaScript\nWeb Development",
  "colors": ["#1a73e8", "#34a853", "#fbbc04", "#ea4335"],
  "width": 1200,
  "height": 400
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "text": "React",
      "size": 54,
      "color": "#1a73e8",
      "x": 429.7,
      "y": 396.5
    }
  ],
  "width": 1200,
  "height": 400
}
```

## Usage

1. **Enter Words**: Type your skills, technologies, or keywords (one per line) in the text area
2. **Choose Colors**: Use the default colors or add your own using the color picker
3. **Generate**: Click "Generate" to create your word cloud
4. **Shuffle**: Click "🔀 Shuffle" to create a new layout with the same words
5. **Download**: Click "📥 Download PNG" to save your word cloud

## Deployment

### CloudFlare Workers Deployment

1. Configure your CloudFlare account with Wrangler:
```bash
cd backend
npx wrangler login
```

2. Deploy the backend:
```bash
npm run deploy
```

### Frontend Deployment

The frontend can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the `frontend/build` folder
- **GitHub Pages**: Use the built files from `frontend/build`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Designed specifically for LinkedIn profile banners
- Built with modern web technologies for optimal performance
- Responsive design for all device types
