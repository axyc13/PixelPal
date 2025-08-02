// openaiService.ts
// Utility for interacting with OpenRouter API (OpenAI-compatible)

const openrouterApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

export async function callOpenAI(endpoint: string, payload: any) {
  console.log('🔗 OpenRouter Service: Making API call to', endpoint);
  
  if (!openrouterApiKey) {
    console.error('❌ OpenRouter API key is missing!');
    console.error('Please add VITE_OPENROUTER_API_KEY to your .env file');
    throw new Error('OpenRouter API key not configured. Please set VITE_OPENROUTER_API_KEY in your .env file.');
  }
  
  console.log('🔑 OpenRouter API key found:', openrouterApiKey.substring(0, 10) + '...');
  console.log('📤 OpenRouter Payload:', JSON.stringify(payload, null, 2));
  
  try {
    const response = await fetch(`https://openrouter.ai/api/v1/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openrouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'AI Cartoon Friend Chat'
      },
      body: JSON.stringify(payload),
    });
    
    console.log('📡 OpenRouter Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenRouter API Error Response:', errorText);
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ OpenRouter Response received:', data);
    return data;
  } catch (error) {
    console.error('❌ OpenRouter Service Error:', error);
    throw error;
  }
}
