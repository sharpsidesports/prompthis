// Proxy OpenAI requests from the server to avoid CORS (browser cannot call OpenAI API directly)
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

function buildPrompts(body) {
  const { template = '', parameters = {}, customPrompt } = body;
  const systemPrompt = `You are an expert at creating effective ChatGPT prompts. 
    Your task is to take a template and parameters, then generate a high-quality, detailed prompt that will get the best results from ChatGPT.
    
    Guidelines:
    - Make the prompt specific and detailed
    - Include clear instructions and context
    - Use professional, clear language
    - Ensure the prompt is actionable and complete
    - Add relevant details that will help ChatGPT understand the task better`;

  let userPrompt;
  if (customPrompt) {
    userPrompt = `Please enhance and improve this custom prompt to make it more effective for ChatGPT:
      
      "${customPrompt}"
      
      Make it more detailed, specific, and actionable while maintaining the original intent.`;
  } else {
    let filledTemplate = template;
    Object.entries(parameters).forEach(([key, value]) => {
      if (value && value.trim()) {
        filledTemplate = filledTemplate.replace(`[${key}]`, value);
      }
    });
    userPrompt = `Please enhance this prompt template with the provided parameters to create a detailed, effective ChatGPT prompt:
      
      Template: "${template}"
      Parameters: ${JSON.stringify(parameters, null, 2)}
      Filled Template: "${filledTemplate}"
      
      Generate a comprehensive, detailed prompt that will get the best results from ChatGPT.`;
  }
  return { systemPrompt, userPrompt };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  if (!apiKey || apiKey.length < 20) {
    return res.status(500).json({
      error: 'OpenAI API key not configured. Please set REACT_APP_OPENAI_API_KEY in Vercel.'
    });
  }

  try {
    const { systemPrompt, userPrompt } = buildPrompts(req.body);

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
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
      const msg = errorData.error?.message || `HTTP ${response.status}`;
      if (response.status === 401) {
        return res.status(500).json({ error: 'Invalid OpenAI API key. Check Vercel environment variables.' });
      }
      if (response.status === 429) {
        return res.status(429).json({ error: 'Rate limit exceeded. Please try again in a moment.' });
      }
      if (response.status === 500) {
        return res.status(502).json({ error: 'OpenAI server error. Please try again later.' });
      }
      return res.status(response.status).json({ error: msg });
    }

    const data = await response.json();
    const generatedPrompt = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
    return res.status(200).json({ generatedPrompt: generatedPrompt.trim() });
  } catch (err) {
    console.error('Generate prompt API error:', err);
    return res.status(500).json({
      error: err.message && err.message.includes('fetch') ? 'Network error. Please try again.' : 'Failed to generate prompt. Please try again.'
    });
  }
};
