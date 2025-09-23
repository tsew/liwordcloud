export interface Env {
  // Define environment variables here if needed
}

interface WordCloudRequest {
  words: string[];
  colors: string[];
  width?: number;
  height?: number;
}

interface WordData {
  text: string;
  size: number;
  color: string;
  x: number;
  y: number;
}

function parseLineDelimitedInput(input: string): string[] {
  return input
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
}

function generateWordCloud(words: string[], colors: string[], width = 1200, height = 400): WordData[] {
  const wordData: WordData[] = [];
  const usedPositions: { x: number; y: number; width: number; height: number }[] = [];
  
  // Sort words by length to place longer words first
  const sortedWords = [...words].sort((a, b) => b.length - a.length);
  
  sortedWords.forEach((word, index) => {
    // Calculate font size based on word importance (position in sorted array)
    const maxSize = 60;
    const minSize = 20;
    const size = Math.max(minSize, maxSize - (index * 3));
    
    // Choose random color from provided colors
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Simple placement algorithm - find non-overlapping position
    let placed = false;
    let attempts = 0;
    let x = 0;
    let y = 0;
    
    while (!placed && attempts < 100) {
      x = Math.random() * (width - word.length * size * 0.6);
      y = Math.random() * (height - size) + size;
      
      const wordWidth = word.length * size * 0.6;
      const wordHeight = size;
      
      // Check for overlaps
      const overlaps = usedPositions.some(pos => 
        x < pos.x + pos.width &&
        x + wordWidth > pos.x &&
        y - wordHeight < pos.y &&
        y > pos.y - pos.height
      );
      
      if (!overlaps) {
        placed = true;
        usedPositions.push({ x, y: y - wordHeight, width: wordWidth, height: wordHeight });
      }
      
      attempts++;
    }
    
    wordData.push({
      text: word,
      size,
      color,
      x,
      y
    });
  });
  
  return wordData;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);
    
    if (url.pathname === '/api/generate-wordcloud' && request.method === 'POST') {
      try {
        const body = await request.json() as any;
        
        let words: string[];
        if (typeof body.input === 'string') {
          words = parseLineDelimitedInput(body.input);
        } else if (Array.isArray(body.words)) {
          words = body.words;
        } else {
          return new Response(JSON.stringify({ error: 'Invalid input format' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        const colors = body.colors || ['#1a73e8', '#34a853', '#fbbc04', '#ea4335', '#9aa0a6'];
        const width = body.width || 1200;
        const height = body.height || 400;
        
        if (words.length === 0) {
          return new Response(JSON.stringify({ error: 'No words provided' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        const wordCloudData = generateWordCloud(words, colors, width, height);
        
        return new Response(JSON.stringify({ 
          success: true, 
          data: wordCloudData,
          width,
          height 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }
    
    return new Response('Not found', { 
      status: 404,
      headers: corsHeaders,
    });
  },
};