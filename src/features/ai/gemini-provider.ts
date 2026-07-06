import { AIProvider } from './provider';
import { GeneratePostInput, GeneratePostResult, GeneratedPost } from './types';
import { loadPromptTemplate, fillPromptTemplate } from './prompt-loader';

export class GeminiProvider implements AIProvider {
  readonly name = 'gemini';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
  }

  async generateTelegramPost(input: GeneratePostInput): Promise<GeneratePostResult> {
    if (!this.apiKey) {
      throw new Error(
        'Gemini API key is not defined. Ensure GEMINI_API_KEY is configured in your environment.'
      );
    }

    const template = loadPromptTemplate('gemini-telegram-post.md');
    const promptText = fillPromptTemplate(template, input.product);

    // Prompt instructing structured JSON output matching schema
    const userPrompt = `${promptText}\n\n` +
      `Additional Instructions: ${input.additionalInstructions || 'None'}\n\n` +
      `Generate the output as a JSON object with the following fields: 'title', 'body', 'hashtags' (array of strings), and 'cta'. Do not return any other text than the JSON object.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${this.apiKey}`;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: userPrompt
            }
          ]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            title: { type: 'STRING', description: 'A short, engaging title/headline in Hebrew with relevant emojis' },
            body: { type: 'STRING', description: 'The main promotional body text in Hebrew highlighting benefits, specs, original price, discount, and sale price' },
            hashtags: {
              type: 'ARRAY',
              items: { type: 'STRING' },
              description: 'A list of relevant hashtags (e.g., ["סמארטפון", "דיל"])'
            },
            cta: { type: 'STRING', description: 'A strong call-to-action in Hebrew, encouraging purchase' }
          },
          required: ['title', 'body', 'hashtags', 'cta']
        }
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const apiErrorMessage = errorData?.error?.message || response.statusText;
      throw new Error(`Gemini API HTTP error: ${response.status} - ${apiErrorMessage}`);
    }

    const responseData = await response.json();
    const candidateText = responseData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error('Gemini API did not return any content.');
    }

    try {
      const parsed = JSON.parse(candidateText.trim());
      
      const title = String(parsed.title || '').trim();
      const body = String(parsed.body || '').trim();
      const rawHashtags = Array.isArray(parsed.hashtags) ? parsed.hashtags : [];
      const hashtags = rawHashtags.map((tag: any) => {
        const strTag = String(tag).trim();
        return strTag.startsWith('#') ? strTag : `#${strTag}`;
      });
      const cta = String(parsed.cta || '').trim();
      const affiliateUrl = input.product.affiliateUrl;

      // Construct a clean fullText post
      const fullText = `${title}\n\n${body}\n\n${cta}\n\n${hashtags.join(' ')}\n\n${affiliateUrl}`;

      const post: GeneratedPost = {
        title,
        body,
        hashtags,
        cta,
        affiliateUrl,
        fullText,
      };

      return {
        post,
        generatedAt: new Date(),
      };
    } catch (parseError) {
      throw new Error(`Failed to parse structured JSON response from Gemini: ${parseError instanceof Error ? parseError.message : String(parseError)}. Raw text: ${candidateText}`);
    }
  }
}
