// openaiService.ts
// Utility for interacting with the OpenAI API

const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

export async function callOpenAI(endpoint: string, payload: any) {
  const response = await fetch(`https://api.openai.com/v1/${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }
  return response.json();
}
