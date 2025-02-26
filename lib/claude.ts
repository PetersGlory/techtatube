import Anthropic from '@anthropic-ai/sdk';

const claude = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY!,
});

export default claude; 