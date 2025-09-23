import React, { useState, useRef, useEffect } from 'react';
import './WordCloudGenerator.css';

interface WordData {
  text: string;
  size: number;
  color: string;
  x: number;
  y: number;
}

interface WordCloudGeneratorProps {}

const DEFAULT_COLORS = ['#1a73e8', '#34a853', '#fbbc04', '#ea4335', '#9aa0a6'];

const WordCloudGenerator: React.FC<WordCloudGeneratorProps> = () => {
  const [inputText, setInputText] = useState('React\nTypeScript\nJavaScript\nWeb Development\nFrontend\nBackend\nAPI\nDatabase\nCloud\nAI\nMachine Learning\nData Science');
  const [colors, setColors] = useState<string[]>(DEFAULT_COLORS);
  const [wordCloudData, setWordCloudData] = useState<WordData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newColor, setNewColor] = useState('#000000');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // LinkedIn banner dimensions
  const CANVAS_WIDTH = 1200;
  const CANVAS_HEIGHT = 400;

  const generateWordCloud = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8787/api/generate-wordcloud', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: inputText,
          colors: colors,
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setWordCloudData(result.data);
      } else {
        console.error('Failed to generate word cloud');
      }
    } catch (error) {
      console.error('Error generating word cloud:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const shuffleWordCloud = () => {
    generateWordCloud();
  };

  const addColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor]);
    }
  };

  const removeColor = (colorToRemove: string) => {
    if (colors.length > 1) {
      setColors(colors.filter(color => color !== colorToRemove));
    }
  };

  const drawWordCloud = () => {
    const canvas = canvasRef.current;
    if (!canvas || wordCloudData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw words
    wordCloudData.forEach(word => {
      ctx.fillStyle = word.color;
      ctx.font = `bold ${word.size}px Arial`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(word.text, word.x, word.y);
    });
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'linkedin-wordcloud.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  // Draw word cloud when data changes
  useEffect(() => {
    drawWordCloud();
  }, [wordCloudData]); // eslint-disable-line react-hooks/exhaustive-deps

  // Generate initial word cloud
  useEffect(() => {
    generateWordCloud();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="word-cloud-generator">
      <header className="header">
        <h1>LinkedIn Word Cloud Generator</h1>
        <p>Create high-quality word clouds for your LinkedIn profile banner</p>
      </header>

      <div className="controls-section">
        <div className="input-section">
          <h3>Words (one per line)</h3>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter words, one per line..."
            rows={10}
            cols={40}
          />
        </div>

        <div className="colors-section">
          <h3>Colors</h3>
          <div className="color-list">
            {colors.map((color, index) => (
              <div key={index} className="color-item">
                <div 
                  className="color-preview" 
                  style={{ backgroundColor: color }}
                ></div>
                <span>{color}</span>
                <button 
                  onClick={() => removeColor(color)}
                  disabled={colors.length <= 1}
                  className="remove-color-btn"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          
          <div className="add-color">
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
            />
            <button onClick={addColor}>Add Color</button>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            onClick={generateWordCloud} 
            disabled={isLoading}
            className="generate-btn"
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
          <button 
            onClick={shuffleWordCloud} 
            disabled={isLoading}
            className="shuffle-btn"
          >
            🔀 Shuffle
          </button>
        </div>
      </div>

      <div className="canvas-section">
        <h3>Preview (LinkedIn Banner Size: 1200×400px)</h3>
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="word-cloud-canvas"
          />
        </div>
        <button onClick={downloadImage} className="download-btn">
          📥 Download PNG
        </button>
      </div>
    </div>
  );
};

export default WordCloudGenerator;