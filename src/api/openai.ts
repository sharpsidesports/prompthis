// OpenAI API integration using fetch instead of the SDK for better browser compatibility
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || '';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface PromptRequest {
  template: string;
  parameters: Record<string, string>;
  customPrompt?: string;
}

export interface PromptResponse {
  generatedPrompt: string;
  error?: string;
}

export const generatePromptWithAI = async (request: PromptRequest): Promise<PromptResponse> => {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not found. Please check your environment variables.');
    }

    // Build the prompt for the AI
    let systemPrompt = `You are an expert at creating effective ChatGPT prompts. 
    Your task is to take a template and parameters, then generate a high-quality, detailed prompt that will get the best results from ChatGPT.
    
    Guidelines:
    - Make the prompt specific and detailed
    - Include clear instructions and context
    - Use professional, clear language
    - Ensure the prompt is actionable and complete
    - Add relevant details that will help ChatGPT understand the task better`;

    let userPrompt = '';
    
    if (request.customPrompt) {
      userPrompt = `Please enhance and improve this custom prompt to make it more effective for ChatGPT:
      
      "${request.customPrompt}"
      
      Make it more detailed, specific, and actionable while maintaining the original intent.`;
    } else {
      // Build prompt from template and parameters
      let filledTemplate = request.template;
      Object.entries(request.parameters).forEach(([key, value]) => {
        if (value.trim()) {
          filledTemplate = filledTemplate.replace(`[${key}]`, value);
        }
      });
      
      userPrompt = `Please enhance this prompt template with the provided parameters to create a detailed, effective ChatGPT prompt:
      
      Template: "${request.template}"
      Parameters: ${JSON.stringify(request.parameters, null, 2)}
      Filled Template: "${filledTemplate}"
      
      Generate a comprehensive, detailed prompt that will get the best results from ChatGPT.`;
    }

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const generatedPrompt = data.choices?.[0]?.message?.content || '';
    
    return {
      generatedPrompt: generatedPrompt.trim()
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return {
      generatedPrompt: '',
      error: error instanceof Error ? error.message : 'Failed to generate prompt'
    };
  }
}; 