// Call our API route so OpenAI is requested from the server (avoids CORS — browsers cannot call OpenAI directly).
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
    const response = await fetch('/api/generate-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        template: request.template,
        parameters: request.parameters,
        customPrompt: request.customPrompt
      })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data.error || `Request failed (${response.status})`;
      return { generatedPrompt: '', error: errorMessage };
    }

    return {
      generatedPrompt: (data.generatedPrompt || '').trim()
    };
  } catch (error) {
    console.error('Generate prompt error:', error);
    if (error instanceof TypeError && (error as Error).message.includes('fetch')) {
      return {
        generatedPrompt: '',
        error: 'Network error. Please check your internet connection and try again.'
      };
    }
    return {
      generatedPrompt: '',
      error: error instanceof Error ? error.message : 'Failed to generate prompt. Please try again.'
    };
  }
}; 