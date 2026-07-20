import { AIProvider } from './provider';
import { GeneratePostInput, GeneratePostResult, GeneratedPost } from './types';
import { loadPromptTemplate } from './prompt-loader';

/**
 * Strips formatting fences and parses raw response text into a JSON value.
 */
export function cleanAndParseJSON(rawText: string): unknown {
  let cleaned = rawText.trim();
  
  // Remove markdown code fence if present
  if (cleaned.startsWith('```')) {
    const match = cleaned.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    if (match) {
      cleaned = match[1].trim();
    }
  }
  
  return JSON.parse(cleaned);
}

export interface GeminiJSONResponse {
  headline: string;
  body: string;
  cta: string;
  telegramPost: string;
}

/**
 * Validates that the parsed response has the required fields and types.
 */
export function validateGeminiResponse(parsed: unknown): GeminiJSONResponse {
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Response is not a JSON object.');
  }

  const record = parsed as Record<string, unknown>;
  const { headline, body, cta, telegramPost } = record;

  if (typeof headline !== 'string') {
    throw new Error('Field "headline" is missing or not a string.');
  }
  if (typeof body !== 'string') {
    throw new Error('Field "body" is missing or not a string.');
  }
  if (typeof cta !== 'string') {
    throw new Error('Field "cta" is missing or not a string.');
  }
  if (typeof telegramPost !== 'string' || telegramPost.trim() === '') {
    throw new Error('Field "telegramPost" is missing, empty, or not a string.');
  }

  return {
    headline: headline.trim(),
    body: body.trim(),
    cta: cta.trim(),
    telegramPost: telegramPost.trim(),
  };
}

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

    const systemPrompt = loadPromptTemplate('gemini-system-prompt.md');
    const templatePrompt = loadPromptTemplate('telegram-post-template.md');

    const product = input.product;
    const productData = {
      title: product.title,
      price: `${product.price.amount} ${product.price.currency}`,
      originalPrice: product.originalPrice ? `${product.originalPrice.amount} ${product.originalPrice.currency}` : undefined,
      discount: product.discountPercent ? `${product.discountPercent}%` : undefined,
      rating: product.rating !== undefined ? String(product.rating) : undefined,
      sales: product.salesCount !== undefined ? String(product.salesCount) : undefined,
      imageUrl: product.imageUrl,
      productUrl: product.productUrl,
      affiliateUrl: product.affiliateUrl,
      description: product.description,
    };

    // Filter out missing/empty values to keep JSON payload minimal
    const cleanedProductData = Object.fromEntries(
      Object.entries(productData).filter(([, v]) => v !== undefined && v !== null && v !== '')
    );

    const productJsonString = JSON.stringify(cleanedProductData, null, 2);

    // Concatenate according to required order: System Prompt + Telegram Template + Product JSON
    const userPrompt = `${systemPrompt}\n\n${templatePrompt}\n\nInput Product JSON:\n${productJsonString}`;

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
            headline: { type: 'STRING', description: 'Headline of the post' },
            body: { type: 'STRING', description: 'Body content of the post' },
            cta: { type: 'STRING', description: 'Call to action text' },
            telegramPost: { type: 'STRING', description: 'The complete generated Telegram post exactly as it should be published' }
          },
          required: ['headline', 'body', 'cta', 'telegramPost']
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

    let parsed: unknown;
    try {
      parsed = cleanAndParseJSON(candidateText);
    } catch (parseError: unknown) {
      console.error('Raw Gemini Response:', candidateText);
      const parseMessage = parseError instanceof Error ? parseError.message : String(parseError);
      throw new Error(`Failed to parse Gemini response as JSON: ${parseMessage}`);
    }

    try {
      const validated = validateGeminiResponse(parsed);
      
      const post: GeneratedPost = {
        headline: validated.headline,
        body: validated.body,
        cta: validated.cta,
        telegramPost: validated.telegramPost,
        affiliateUrl: product.affiliateUrl,
        fullText: validated.telegramPost, // Maintain backward compatibility (holds telegramPost)
        title: validated.headline, // Optional backward compatibility
        hashtags: [], // Optional backward compatibility
      };

      return {
        post,
        generatedAt: new Date(),
      };
    } catch (validationError: unknown) {
      console.error('Raw Gemini Response:', candidateText);
      const valMessage = validationError instanceof Error ? validationError.message : String(validationError);
      throw new Error(`Invalid Gemini response format: ${valMessage}`);
    }
  }
}
