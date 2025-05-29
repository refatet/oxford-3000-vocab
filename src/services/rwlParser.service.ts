export class RWLParserService {
  private static instance: RWLParserService;

  private constructor() {}

  static getInstance(): RWLParserService {
    if (!RWLParserService.instance) {
      RWLParserService.instance = new RWLParserService();
    }
    return RWLParserService.instance;
  }

  /**
   * Parse RWL (Read While Listening) content
   * @param rawContent Raw RWL content
   */
  parseContent(rawContent: string): RWLContent {
    const lines = rawContent.trim().split('\n');
    const title = lines[0].trim();
    const segments: RWLSegment[] = [];
    
    let currentSegment: RWLSegment | null = null;
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('[') && line.includes(']')) {
        // This is a timestamp line
        const timestampMatch = line.match(/\[(\d+):(\d+):(\d+)\]/);
        
        if (timestampMatch) {
          if (currentSegment) {
            segments.push(currentSegment);
          }
          
          const hours = parseInt(timestampMatch[1], 10);
          const minutes = parseInt(timestampMatch[2], 10);
          const seconds = parseInt(timestampMatch[3], 10);
          const timestamp = hours * 3600 + minutes * 60 + seconds;
          
          const text = line.substring(line.indexOf(']') + 1).trim();
          
          currentSegment = {
            id: `segment-${segments.length + 1}`,
            timestamp,
            text,
            duration: 0, // Will be calculated later
          };
        }
      } else if (line && currentSegment) {
        // This is continuation of the current segment
        currentSegment.text += ' ' + line;
      }
    }
    
    // Add the last segment
    if (currentSegment) {
      segments.push(currentSegment);
    }
    
    // Calculate durations
    for (let i = 0; i < segments.length - 1; i++) {
      segments[i].duration = segments[i + 1].timestamp - segments[i].timestamp;
    }
    
    // Set duration for the last segment (assume 5 seconds if not known)
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      lastSegment.duration = lastSegment.duration || 5;
    }
    
    return {
      title,
      segments,
      totalDuration: segments.length > 0 ? 
        segments[segments.length - 1].timestamp + segments[segments.length - 1].duration : 0,
    };
  }

  /**
   * Create sample RWL content for demo purposes
   */
  createSampleContent(): RWLContent {
    const sampleRaw = `The Apple Tree
[00:00:00] Once upon a time, there was a big apple tree.
[00:00:05] A little boy loved to come and play around it every day.
[00:00:10] He climbed to the tree top, ate the apples, and took a nap under the shadow.
[00:00:15] The boy loved the tree and the tree loved to play with him.
[00:00:20] Time went by, and the boy grew older.
[00:00:25] Now he no longer played around the tree every day.
[00:00:30] One day, the boy came back to the tree and looked sad.
[00:00:35] "Come and play with me," the tree asked.
[00:00:40] "I am no longer a kid, I don't play around trees anymore," the boy replied.
[00:00:45] "I want toys. I need money to buy them."
[00:00:50] "Sorry, but I don't have money," said the tree.
[00:00:55] "But you can pick all my apples and sell them. So, you will have money."
[00:01:00] The boy was so excited. He grabbed all the apples and left happily.`;
    
    return this.parseContent(sampleRaw);
  }
}

export interface RWLSegment {
  id: string;
  timestamp: number; // in seconds
  text: string;
  duration: number; // in seconds
}

export interface RWLContent {
  title: string;
  segments: RWLSegment[];
  totalDuration: number; // in seconds
}
