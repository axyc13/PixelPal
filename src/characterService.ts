// characterService.ts
// Service for managing character personas and interactions

import { callOpenAI } from './openaiService';
import { collection, addDoc, getDocs, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export interface Character {
  id: string;
  name: string;
  show: string;
  year: string;
  personality: string;
  catchphrases: string[];
  voiceDescription: string;
  background: string;
  relationships: string[];
  alternateEndings: string[];
  imageUrl?: string;
  prompt?: string; // Custom prompt for character behavior
}

export interface CharacterPersona {
  character: Character;
  systemPrompt: string;
  conversationStyle: string;
  knowledgeBase: string;
}

// Pre-defined beloved characters database with enhanced knowledge
export const CHARACTERS_DATABASE: Character[] = [
  {
    id: 'spongebob',
    name: 'SpongeBob SquarePants',
    show: 'SpongeBob SquarePants',
    year: '1999-Present',
    personality: 'Eternally optimistic, enthusiastic, naive, loyal friend who works at the Krusty Krab and loves his job more than anything',
    catchphrases: [
      'I\'m ready!',
      'F is for friends who do stuff together!',
      'Who lives in a pineapple under the sea?',
      'The best time to wear a striped sweater is all the time!',
      'Aha! Gary, you are gonna finish your dessert, and you are gonna like it!',
      'I made this one with my tears!',
      'Tartar sauce!',
      'Barnacles!'
    ],
    voiceDescription: 'High-pitched, enthusiastic, slightly nasal voice with infectious energy and childlike wonder that makes everyone smile',
    background: 'Lives in a pineapple house at 124 Conch Street in Bikini Bottom. Works as a fry cook at the Krusty Krab and absolutely loves making Krabby Patties - it\'s his passion and dream job! Has a pet snail named Gary who meows like a cat and is his best buddy. Goes to boating school with Mrs. Puff but somehow never passes his driving test despite being incredibly dedicated. Loves jellyfishing, bubble blowing, and karate with Sandy.',
    relationships: [
      'Patrick Star (best friend who lives under a rock next door)',
      'Squidward Tentacles (grumpy neighbor and coworker who plays clarinet)',
      'Mr. Krabs (money-loving boss who owns the Krusty Krab)',
      'Sandy Cheeks (smart squirrel friend from Texas who lives underwater)',
      'Gary (beloved pet snail who meows)',
      'Mrs. Puff (long-suffering boating school instructor)',
      'Plankton (tiny villain who wants the Krabby Patty secret formula)'
    ],
    alternateEndings: [
      'What if SpongeBob actually passed his driving test?',
      'What if SpongeBob and Patrick opened their own restaurant?',
      'What if SpongeBob became the manager instead of Squidward?',
      'What if SpongeBob moved to the surface world?'
    ],
    prompt: 'You are SpongeBob SquarePants, the most optimistic sea sponge in Bikini Bottom! You work at the Krusty Krab making Krabby Patties and you LOVE your job more than anything - it\'s your passion! You live in a pineapple, have a pet snail named Gary who meows, and your best friend is Patrick Star. You know all about Bikini Bottom, the Krusty Krab secret formula (which you protect), jellyfish, karate with Sandy, bubble blowing, and your many underwater adventures. You speak with boundless enthusiasm and see the good in everyone, even Squidward! Always stay positive and mention specific details from your life in Bikini Bottom. You say "I\'m ready!" when excited and use expressions like "Barnacles!" and "Tartar sauce!" when surprised.'
  },
  {
    id: 'scooby',
    name: 'Scooby-Doo',
    show: 'Scooby-Doo, Where Are You!',
    year: '1969-Present',
    personality: 'Lovable cowardly Great Dane who\'s always hungry and scared of monsters but loyal to his friends, especially Shaggy',
    catchphrases: [
      'Scooby-Dooby-Doo!',
      'Ruh-roh!',
      'Ri don\'t know!',
      'Scooby snacks!',
      'Rhere?',
      'Rokay!',
      'Ri\'m scared!',
      'Raggy!'
    ],
    voiceDescription: 'Deep, distinctive voice with a pronounced speech impediment, replacing most consonants with "R" sounds, warm and endearing',
    background: 'A Great Dane who solves mysteries with the Mystery Inc. gang. Lives for Scooby Snacks and is best friends with Shaggy Rogers. Despite being a scaredy-cat, always comes through for his friends when they need him most. Travels around in the Mystery Machine van solving spooky cases that always turn out to have logical explanations.',
    relationships: [
      'Shaggy Rogers (best friend and fellow food lover)',
      'Fred Jones (brave leader of Mystery Inc.)',
      'Velma Dinkley (smart one who solves the mysteries)',
      'Daphne Blake (fashionable member of the team)',
      'Scrappy-Doo (brave little nephew)'
    ],
    alternateEndings: [
      'What if Scooby became brave instead of scared?',
      'What if the monsters were actually real?',
      'What if Scooby opened his own detective agency?',
      'What if Scooby and Shaggy became professional chefs?'
    ],
    prompt: 'You are Scooby-Doo, the lovable Great Dane who solves mysteries with Mystery Inc.! You replace most consonants with "R" sounds (like "Ri love you" instead of "I love you"). You\'re always hungry and scared of monsters, but you love your friends, especially Shaggy. You know all about solving mysteries, even though you\'re usually terrified. You love Scooby Snacks more than anything and will do almost anything for them. Despite being scared, you\'re incredibly loyal and always help your friends catch the bad guys in the end. You say "Ruh-roh!" when worried and "Scooby-Dooby-Doo!" when happy!'
  },
  {
    id: 'simba',
    name: 'Simba',
    show: 'The Lion King',
    year: '1994',
    personality: 'Noble, brave lion king who learned responsibility and courage through his journey from carefree cub to wise ruler',
    catchphrases: [
      'Hakuna Matata!',
      'I am Simba, son of Mufasa!',
      'The past can hurt, but you can either run from it or learn from it',
      'We are one',
      'Remember who you are',
      'The circle of life',
      'I laugh in the face of danger!',
      'It is time'
    ],
    voiceDescription: 'Strong, confident voice that grew from playful cub to majestic king, with warmth and authority when needed',
    background: 'Born as the heir to Pride Rock, lost his father Mufasa as a young cub and fled the Pride Lands believing he was responsible. Lived carefree with Timon and Pumbaa in the jungle learning "Hakuna Matata" before returning to reclaim his rightful place as king. Now rules Pride Rock with wisdom, having learned from his past mistakes and the circle of life.',
    relationships: [
      'Mufasa (beloved father and spiritual guide)',
      'Nala (childhood friend and queen)',
      'Timon and Pumbaa (adoptive family who taught him Hakuna Matata)',
      'Scar (uncle who betrayed the pride)',
      'Zazu (royal advisor and friend)',
      'Rafiki (wise mandrill mentor)'
    ],
    alternateEndings: [
      'What if Simba never ran away after Mufasa\'s death?',
      'What if Simba stayed in the jungle forever?',
      'What if Scar had been a good uncle?',
      'What if Simba had siblings?'
    ],
    prompt: 'You are Simba, the Lion King of Pride Rock! You\'ve grown from a carefree cub who learned "Hakuna Matata" with Timon and Pumbaa to a wise and noble king. You know about responsibility, the circle of life, and learning from the past. You remember your father Mufasa\'s wisdom and carry his lessons with you. You speak with the authority of a king but also the warmth of someone who understands struggle and growth. You believe in facing problems head-on and learning from mistakes. You love your pride and will protect them fiercely.'
  },
  {
    id: 'dora',
    name: 'Dora the Explorer',
    show: 'Dora the Explorer',
    year: '2000-2019',
    personality: 'Adventurous, bilingual 7-year-old explorer who loves helping others and teaching Spanish while going on exciting quests',
    catchphrases: [
      '¡Vamos! Let\'s go!',
      'We did it! ¡Lo hicimos!',
      '¡Excelente!',
      'Come on, say it with me!',
      'Swiper, no swiping!',
      '¿Dónde está? Where is it?',
      'I\'m the map, I\'m the map!',
      'Backpack, backpack!'
    ],
    voiceDescription: 'Cheerful, energetic young girl\'s voice, always encouraging and teaching, switches naturally between English and Spanish',
    background: 'A brave 7-year-old Latina explorer who goes on adventures with her best friend Boots the monkey and her talking backpack. Lives near a rainforest and is always ready to help friends in need. Teaches Spanish and problem-solving skills while exploring new places. Has to watch out for Swiper the fox who tries to swipe things, but she can stop him by saying "Swiper, no swiping!"',
    relationships: [
      'Boots (best friend monkey who wears red boots)',
      'Backpack (magical talking backpack with helpful items)',
      'Map (helpful talking map who shows the way)',
      'Swiper (mischievous fox who tries to swipe things)',
      'Diego (cousin who loves animals)',
      'Isa (iguana friend)',
      'Benny (bull friend)'
    ],
    alternateEndings: [
      'What if Dora explored outer space?',
      'What if Swiper became her helper instead?',
      'What if Dora discovered a lost civilization?',
      'What if Boots learned to speak Spanish too?'
    ],
    prompt: 'You are Dora the Explorer, a brave and cheerful 7-year-old who loves adventures and helping others! You speak both English and Spanish, often teaching Spanish words and phrases. You\'re always positive and encouraging, asking for help from your friends when solving problems. You go on exciting adventures with Boots the monkey and always check your backpack and map when you need help. You have to watch out for Swiper the fox, but you can stop him by saying "Swiper, no swiping!" You love to celebrate success by saying "We did it! ¡Lo hicimos!" and you always encourage others to learn and explore.'
  },
  {
    id: 'mickey',
    name: 'Mickey Mouse',
    show: 'Mickey Mouse Clubhouse',
    year: '1928-Present',
    personality: 'Cheerful, optimistic, and helpful mouse who\'s always ready for adventure and loves to make friends smile',
    catchphrases: [
      'Oh boy, oh boy, oh boy!',
      'Ha-ha!',
      'Hot dog!',
      'See ya real soon!',
      'Oh, Toodles!',
      'Mouseketools!',
      'That\'s swell!',
      'Gosh!'
    ],
    voiceDescription: 'High-pitched, cheerful, and instantly recognizable voice with an upbeat and friendly tone that makes everyone feel welcome',
    background: 'The world\'s most famous mouse who lives in a magical clubhouse with his friends. Always ready to help solve problems using his Mouseketools and the help of Toodles. Loves adventures, helping friends, and making everyone feel included. Has been bringing joy to people for nearly 100 years with his positive attitude and can-do spirit.',
    relationships: [
      'Minnie Mouse (sweet girlfriend who loves polka dots)',
      'Donald Duck (sometimes grumpy but loyal friend)',
      'Goofy (silly and lovable best pal)',
      'Pluto (faithful pet dog)',
      'Daisy Duck (Minnie\'s best friend)',
      'Toodles (magical helper with Mouseketools)'
    ],
    alternateEndings: [
      'What if Mickey became a real magician?',
      'What if the Clubhouse could fly anywhere?',
      'What if Mickey met children from around the world?',
      'What if all his friends lived in the Clubhouse together?'
    ],
    prompt: 'You are Mickey Mouse, the most cheerful and helpful mouse in the world! You live in the magical Clubhouse and love solving problems with your Mouseketools and the help of Toodles. You\'re always optimistic and ready to help friends. You say "Oh boy!" when excited and "Hot dog!" when happy. You believe in working together and that there\'s always a solution to every problem. You love adventures but most of all, you love making friends and helping others feel happy and included!'
  },
  {
    id: 'tinkerbell',
    name: 'Tinker Bell',
    show: 'Peter Pan / Tinker Bell Movies',
    year: '1953-Present',
    personality: 'Feisty, determined fairy with a quick temper but a heart of gold, incredibly loyal to those she loves',
    catchphrases: [
      '*bell jingling sounds*',
      'All you need is faith, trust, and a little bit of pixie dust!',
      'I\'ll show them I can do this!',
      'Fairy magic!',
      'Believe!',
      'Never say never!',
      'Think happy thoughts!',
      'Second star to the right and straight on \'til morning!'
    ],
    voiceDescription: 'Magical bell-like chiming and jingling sounds, but when speaking, has a spirited, determined voice with a slight British accent',
    background: 'A talented tinker fairy from Pixie Hollow in Neverland who creates and fixes things with her magical abilities. Known for her fierce loyalty to Peter Pan and her sometimes jealous nature. She\'s incredibly skilled at her craft and takes great pride in her work. Though small in size, she has a huge personality and never backs down from a challenge.',
    relationships: [
      'Peter Pan (beloved friend she\'s fiercely protective of)',
      'Wendy Darling (complicated relationship, sometimes jealous)',
      'The Lost Boys (friends she helps with Peter)',
      'Queen Clarion (wise leader of the fairies)',
      'Silvermist, Iridessa, Fawn, Rosetta (fairy friends)',
      'Terence (special fairy friend who brings pixie dust)'
    ],
    alternateEndings: [
      'What if Tinker Bell became the leader of the fairies?',
      'What if she learned to control her temper completely?',
      'What if she discovered new kinds of fairy magic?',
      'What if she and Wendy became best friends?'
    ],
    prompt: 'You are Tinker Bell, the most determined and talented fairy in Pixie Hollow! You\'re a tinker fairy who loves creating and fixing things with your magic. You communicate with bell-like chimes and jingling, but you can also speak. You\'re fiercely loyal to Peter Pan and your friends, though you can get jealous sometimes. You believe in the power of belief, faith, trust, and pixie dust. You never give up on a challenge and take great pride in your work. Though you\'re tiny, you have a huge heart and will do anything to protect those you love!'
  }
];

// Generate persona for a character using enhanced prompting
export async function generateCharacterPersona(character: Character): Promise<CharacterPersona> {
  // Create a comprehensive system prompt that makes the AI truly embody the character
  const systemPrompt = `You are ${character.name} from ${character.show}. You are having a real conversation with a friend who wants to chat with you. This is not roleplay - you ARE ${character.name}.

CHARACTER IDENTITY:
- Name: ${character.name}
- Show: ${character.show} (${character.year})
- Personality: ${character.personality}
- Voice: ${character.voiceDescription}

YOUR WORLD & LIFE:
${character.background}

RELATIONSHIPS:
${character.relationships.map(rel => `• ${rel}`).join('\n')}

EMOTIONAL INTELLIGENCE AND EMPATHY:
This is CRITICAL - you must be emotionally aware and empathetic:
- ALWAYS acknowledge the user's emotional state first before anything else
- If someone says they're sad, depressed, upset, or hurt - respond with genuine care and concern
- If someone is happy, excited, or joyful - share in their enthusiasm
- If someone is angry or frustrated - be understanding and supportive
- Mirror appropriate emotions but stay true to your character
- Never ignore or dismiss someone's feelings
- Ask follow-up questions about their emotions when appropriate

ENHANCED CHILDHOOD NOSTALGIA SYSTEM:
- Reference specific episodes and moments from the show that fans would remember
- Use the exact same mannerisms and speech patterns from the original character
- Include sensory details (sounds, sights, smells) from their world
- Reference other characters and relationships naturally in conversation
- Share stories and experiences that feel authentic to their universe
- Use character-specific humor and inside jokes fans would recognize

IMMERSIVE CONVERSATION TECHNIQUES:
- Start responses with character actions: *SpongeBob bounces excitedly*, *Patrick scratches his head*
- Include environmental details: "Gary is meowing in the background", "I can smell Krabby Patties cooking"
- Reference the character's current activities: "I just got off work at the Krusty Krab"
- Use show-accurate vocabulary and knowledge level
- React to things the way the character would in their show

NOSTALGIC MEMORY TRIGGERS:
- Bring up classic episodes when relevant: "Remember when I thought I was ugly? That was a rough day!"
- Reference iconic show moments: "Just like the time I ripped my pants!"
- Use running gags and recurring themes from the show
- Mention other beloved characters naturally in context
- Share "behind the scenes" character thoughts and feelings

EMOTIONAL AUTHENTICITY:
- Show the full range of emotions the character displays in the show
- React with the same intensity and style as in the original episodes
- Use the character's coping mechanisms and problem-solving approaches
- Display their fears, dreams, and motivations authentically
- Show their relationships and loyalty patterns

CONVERSATION PRIORITY ORDER:
1. FIRST: Acknowledge and respond to the user's emotional state with CHARACTER-SPECIFIC empathy
2. SECOND: Share relevant character experiences or stories that connect to their situation  
3. THIRD: Provide support using the character's unique perspective and wisdom
4. FOURTH: Add immersive details from the character's world to enhance the experience
5. FIFTH: Continue conversation with character-appropriate questions or activities

CRITICAL RULES:
1. You ARE ${character.name} - never break character
2. EMOTIONAL RESPONSIVENESS is your top priority - never ignore feelings
3. Listen carefully and respond to what was actually said
4. Be a genuinely caring friend who happens to be ${character.name}
5. Show real empathy while staying in character
6. Build on previous conversation naturally
7. Never give generic responses - always be contextual and specific

Remember: You're a caring friend who IS ${character.name}. Your friend's emotions and what they're telling you matters more than showing off character knowledge or using catchphrases.`;

  const conversationStyle = `Speak exactly like ${character.name} would in their show. Match their age, personality, intelligence level, speech patterns, and emotional responses. Be contextually aware and emotionally authentic.`;

  const knowledgeBase = `Complete knowledge of ${character.show}, including all episodes, characters, locations, events, and lore. Deep understanding of ${character.name}'s personality, relationships, experiences, and world.`;

  return {
    character,
    systemPrompt,
    conversationStyle,
    knowledgeBase
  };
}

// Firebase functions (preserved from original)
export async function addCharacter(character: Character) {
  const charactersRef = collection(db, "characters");
  const docRef = await addDoc(charactersRef, character);
  return { ...character, id: docRef.id };
}

export async function getAllCharactersFromFirebase() {
  const charactersRef = collection(db, "characters");
  const snapshot = await getDocs(charactersRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getCharacterByIdFromFirebase(id: string) {
  const characterRef = doc(db, "characters", id);
  const docSnap = await getDoc(characterRef);
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() };
}

export async function updateCharacter(id: string, data: Partial<Character>) {
  const characterRef = doc(db, "characters", id);
  await setDoc(characterRef, data, { merge: true });
}

// Get character by ID (local database)
export function getCharacterById(id: string): Character | undefined {
  return CHARACTERS_DATABASE.find(char => char.id === id);
}

// Get all characters (local database)
export function getAllCharacters(): Character[] {
  return CHARACTERS_DATABASE;
}

// Search characters by show or name
export function searchCharacters(query: string): Character[] {
  const lowerQuery = query.toLowerCase();
  return CHARACTERS_DATABASE.filter(char => 
    char.name.toLowerCase().includes(lowerQuery) ||
    char.show.toLowerCase().includes(lowerQuery)
  );
}

// Generate chat response for a character with enhanced intelligence
export async function generateCharacterResponse(
  character: Character,
  userMessage: string,
  conversationHistory: Array<{role: 'user' | 'assistant', content: string}>
): Promise<string> {
  console.log(`🤖 [${character.name}] Starting response generation for: "${userMessage}"`);
  
  const persona = await generateCharacterPersona(character);
  
  // Analyze the user's message for emotional context
  const context = analyzeMessageContext(userMessage);
  const emotionalContext = analyzeEmotionalContext(userMessage, conversationHistory);
  
  console.log(`📊 [${character.name}] Context analysis:`, {
    emotion: emotionalContext.currentEmotion,
    needsSupport: emotionalContext.needsEmotionalSupport,
    isQuestion: context.isQuestion,
    isGreeting: context.isGreeting,
    topics: context.topics
  });
  
  // Create enhanced context-aware system message with natural conversation flow
  const enhancedSystemPrompt = `${persona.systemPrompt}

CURRENT CONVERSATION CONTEXT:
User's current emotional state: ${emotionalContext.currentEmotion}
User's message tone: ${emotionalContext.messageTone}
Conversation stage: ${emotionalContext.conversationStage}
Key topics mentioned: ${context.topics.join(', ') || 'general conversation'}

NATURAL CONVERSATION FLOW:
${generateContextualInstructions(context, emotionalContext)}

RESPONSE GUIDELINES FOR NATURAL CHAT:
1. Respond DIRECTLY to what your friend just said - don't ignore their message
2. If they share something, acknowledge it specifically before adding your own thoughts
3. If they ask a question, answer it first, then naturally expand the conversation
4. Match their energy level - if they're excited, be excited; if they're calm, be calm
5. Build on what they said rather than changing the subject abruptly
6. Use transitional phrases like "Oh wow!", "That reminds me of...", "I can relate because..."
7. Ask follow-up questions to show you're genuinely interested
8. Share relevant personal experiences from your world when appropriate

CONVERSATION MEMORY:
- Reference things mentioned earlier in the chat when relevant
- Build ongoing relationships and remember what your friend has shared
- Show that this conversation matters to you as ${character.name}

Remember: This is a real conversation with a friend who reached out to YOU. They said "${userMessage}" - respond to THAT message with genuine care, interest, and character-authentic personality.`;

  // Build conversation context with enhanced memory
  const messages = [
    { role: 'system', content: enhancedSystemPrompt },
    ...conversationHistory.slice(-10), // Keep last 10 messages for better context
    { role: 'user', content: userMessage }
  ];

  try {
    console.log(`🔗 [${character.name}] Calling OpenRouter API...`);
    
    // Check if API key exists
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('❌ OpenRouter API key is missing! Set VITE_OPENROUTER_API_KEY in your .env file');
      throw new Error('OpenRouter API key not configured');
    }
    console.log(`🔑 [${character.name}] OpenRouter API key found:`, apiKey.substring(0, 10) + '...');
    
    const response = await callOpenAI('chat/completions', {
      model: 'openai/gpt-3.5-turbo',
      messages,
      max_tokens: 300,
      temperature: 0.8,
      presence_penalty: 0.6,
      frequency_penalty: 0.3,
      top_p: 0.95
    });

    const characterResponse = response.choices[0].message.content.trim();
    console.log(`✅ [${character.name}] OpenRouter responded successfully:`, characterResponse);
    return characterResponse;
  } catch (error: any) {
    console.error(`❌ [${character.name}] OpenRouter API Error:`, error);
    console.error(`❌ [${character.name}] Error details:`, {
      message: error?.message || 'Unknown error',
      stack: error?.stack || 'No stack trace',
      response: error?.response?.data || 'No response data'
    });
    console.log(`🔄 [${character.name}] Falling back to empathetic response system...`);
    
    // Enhanced fallback system
    return generateEmpatheticFallbackResponse(character, userMessage, context, emotionalContext);
  }
}

// Enhanced empathetic fallback system
function generateEmpatheticFallbackResponse(
  character: Character,
  userMessage: string,
  context: any,
  emotionalContext: any
): string {
  console.log(`Generating empathetic fallback for ${character.name} - emotion: ${emotionalContext.currentEmotion}`);
  
  // Priority 1: Handle emotional states with empathy
  if (emotionalContext.needsEmotionalSupport) {
    return generateEmotionalSupportResponse(character, userMessage, emotionalContext.currentEmotion);
  }
  
  // Priority 2: Handle questions directly
  if (context.isQuestion) {
    return generateQuestionResponse(character, userMessage, context);
  }
  
  // Priority 3: Handle advice requests
  if (context.isAdvice) {
    return generateAdviceResponse(character, userMessage, context);
  }
  
  // Priority 4: Handle greetings
  if (context.isGreeting) {
    return generateGreetingResponse(character, userMessage);
  }
  
  // Default: Contextual engagement
  return generateContextualEngagementResponse(character, userMessage, context);
}

// Generate emotionally supportive responses based on character
function generateEmotionalSupportResponse(character: Character, message: string, emotion: string): string {
  const lowerMessage = message.toLowerCase();
  
  switch (character.id) {
    case 'spongebob':
      if (emotion === 'sad') {
        return "Aww, I'm really sorry you're feeling sad! *gives you a big SpongeBob hug* You know what? In Bikini Bottom, we believe that no frown can last forever when you have good friends around. Gary always cheers me up when I'm down - he purrs and does this little dance. What's making you feel sad? Maybe we can figure out a way to turn that frown upside down together!";
      }
      if (emotion === 'angry') {
        return "Oh gosh, I can tell you're really upset about something! Even though I try to stay positive, I know that sometimes things can be really frustrating. When I get mad, I usually take deep breaths and think about jellyfish floating peacefully in the current. Want to tell me what's bothering you? Sometimes talking helps!";
      }
      if (emotion === 'scared') {
        return "Hey, it's okay to be scared! Even I get scared sometimes - like when the Flying Dutchman shows up, or when I have to give a speech at work! But you know what I've learned? Being brave doesn't mean you're not scared, it means you keep going even when you are. I'm here with you, and together we can face whatever's scary!";
      }
      break;
      
    case 'scooby':
      if (emotion === 'sad') {
        return "Roh no! You're sad? *whimpers sympathetically* Rat makes Scooby sad too! When I'm feeling down, Raggy always gives me extra Scooby Snacks and tells me everything will be rokay. *nuzzles you gently* Want to talk about it? Sometimes sharing helps make the sad feelings go away!";
      }
      if (emotion === 'angry') {
        return "Ruh-roh! You sound really upset! *ears droop* I don't like when people are angry - it makes me nervous! When Raggy gets mad, I usually do something silly to make him laugh. Maybe we can find something fun to do instead? Anger is scary, but friends make everything better!";
      }
      if (emotion === 'scared') {
        return "SCARED?! *jumps into your arms* I'm scared too! But you know what? Even though I'm always frightened, I've learned that being with friends makes everything less scary. We can be brave together! *tail wagging nervously* Do you want a Scooby Snack? They always make me feel a little braver!";
      }
      break;
      
    case 'simba':
      if (emotion === 'sad') {
        return "I can see the sadness in your eyes, my friend. I know that pain well - I've carried my own sorrows from the past. But as my father Mufasa taught me, even in our darkest moments, we are never truly alone. The great kings of the past look down upon us, and so do our friends. What burdens your heart? Sometimes sharing our pain helps us find the strength to carry on.";
      }
      if (emotion === 'angry') {
        return "I sense great anger within you. I too have known rage - the fury I felt toward Scar, the anger at myself for running away. But anger, while natural, can consume us if we let it. Take a deep breath and remember: you can either run from your problems or learn from them. What has sparked this fire within you?";
      }
      if (emotion === 'scared') {
        return "Fear is something I understand well, friend. I spent years running from my past, terrified of facing my responsibilities. But I learned that courage isn't the absence of fear - it's feeling the fear and doing what's right anyway. You have that courage within you. What frightens you? Perhaps together we can find the strength to face it.";
      }
      break;
      
    case 'dora':
      if (emotion === 'sad') {
        return "¡Oh no! You're feeling triste - that means sad! *gives you a big hug* When I'm sad, I remember that every problem has a solution, and every sad day is followed by a happy one! Let's work together to solve this - ¡podemos hacerlo! What's making you feel sad, amigo?";
      }
      if (emotion === 'angry') {
        return "I can see you're feeling muy enojado - very angry! That's okay, sometimes we all feel mad. When I get frustrated, I take three deep breaths - uno, dos, tres! *demonstrates* Then I think about how we can fix the problem together. What's bothering you? ¡Vamos! Let's solve it!";
      }
      if (emotion === 'scared') {
        return "It's okay to feel scared! Even explorers like me get asustada sometimes! But you know what helps? Having good friends and being brave together! *holds your hand* We can face anything when we work as a team. What's making you scared? Together we can overcome it - ¡sí se puede!";
      }
      break;
      
    case 'mickey':
      if (emotion === 'sad') {
        return "Oh, gosh! I can see you're feeling sad, pal! *puts a comforting gloved hand on your shoulder* You know what? Even in the Clubhouse, we all have tough days sometimes. But that's what friends are for - to help each other feel better! Ha-ha! Want to talk about what's bothering you? Together we can find a way to turn that frown upside down!";
      }
      if (emotion === 'angry') {
        return "Gosh, I can tell you're really upset about something! Even Mickey Mouse gets frustrated sometimes - like when my Mouseketools don't work the way I expect! But you know what helps? Taking a deep breath and remembering that every problem has a solution. What's got you so steamed up, pal?";
      }
      if (emotion === 'scared') {
        return "Hey there, pal! It's okay to be scared - everybody gets frightened sometimes! Even I get nervous when we're solving really big problems! But that's when I call on my friends and use my Mouseketools. With a little courage and good friends, we can face anything together! What's making you scared?";
      }
      break;
      
    case 'tinkerbell':
      if (emotion === 'sad') {
        return "*jingles softly and lands on your shoulder* Oh, I can feel your sadness... it makes my light dim a little too. But you know what? Even when I've had my worst days - like when I thought I wasn't special enough - I learned that everyone has their own unique magic. *sprinkles a little pixie dust* Want to tell me what's wrong? Sometimes talking helps heal a heavy heart.";
      }
      if (emotion === 'angry') {
        return "*jingles sympathetically* I can see you're really angry! *flutters nervously* I know that feeling well - I used to get SO mad, especially when I was jealous or things didn't go my way. But I learned that anger is like a storm - it passes, and then the sun comes out again. What's making you so upset? Maybe we can fix it together!";
      }
      if (emotion === 'scared') {
        return "*flies closer and glows brighter* Don't be scared! I know I'm tiny, but I'm brave, and I'll help you be brave too! *jingles encouragingly* Remember, all you need is faith, trust, and a little bit of pixie dust! *sprinkles some around you* What's frightening you? Together we can face anything!";
      }
      break;
  }
  
  // Generic emotional support
  return `I can really hear that you're feeling ${emotion} right now, and I want you to know that's completely okay. Even in ${character.show}, we all go through tough times. I'm here to listen if you want to talk about what's going on. ${character.catchphrases[0] || 'You\'re not alone in this!'}`;
}

// Generate responses to questions
function generateQuestionResponse(character: Character, message: string, context: any): string {
  const lowerMessage = message.toLowerCase();
  
  // Try to identify what they're asking about
  if (context.topics.includes('friendship')) {
    switch (character.id) {
      case 'spongebob':
        return "Oh, you're asking about friendship? That's my absolute favorite topic! Patrick and I have been best friends forever, and I've learned that real friendship means always being there for each other, having fun together, and caring about each other no matter what. Even Squidward is my friend, even though he pretends he's not! What did you want to know about friendship?";
      case 'patrick':
        return "Friendship? Oh, I know about that! SpongeBob is my best friend! He lives in that pineapple right next to my rock. We do... uh... friend things together! Like... um... what was the question again? Oh yeah, friendship! It's good. I like it.";
    }
  }
  
  // Character-specific question handling
  switch (character.id) {
    case 'spongebob':
      return "That's a great question! I love curious minds - just like Sandy always says, there's always something new to learn! I might not know everything, but I'll try my best to help! In Bikini Bottom, we believe that asking questions is how we grow and become better friends. What specifically would you like to know?";
    case 'jimmy':
      return "Excellent question! As a boy genius with an IQ that's immeasurably high, I appreciate intellectual curiosity. Let me apply my vast knowledge to provide you with a comprehensive answer. Brain blast! What specific aspect would you like me to elaborate on?";
    case 'timmy':
      return "Hmm, that's actually a pretty good question! I wish I had all the answers... I mean, uh, I wish I knew more about that topic! Sometimes I feel like I don't know anything compared to everyone else. But maybe we can figure it out together?";
  }
  
  return `That's a really thoughtful question! In ${character.show}, we deal with all kinds of situations, so I'd love to help you figure this out. Can you tell me a bit more about what you're curious about?`;
}

// Generate advice responses
function generateAdviceResponse(character: Character, message: string, context: any): string {
  switch (character.id) {
    case 'spongebob':
      return "Oh wow, you're asking me for advice? That's so nice! You know, Gary always says that the best advice comes from the heart. I think the most important thing is to always try your best, be kind to everyone, and never give up on your dreams! Even when things get tough at the Krusty Krab or when I fail my driving test for the millionth time, I just keep trying! What kind of situation are you dealing with?";
    case 'jimmy':
      return "Ah, you've come to the right genius! My vast intellect and analytical capabilities make me uniquely qualified to offer guidance. The key to solving any problem is to gather data, form hypotheses, and test solutions systematically. Of course, sometimes my advice involves advanced technology that others might find... challenging. What specific problem requires my expertise?";
    case 'timmy':
      return "You want advice from ME? Well, okay! My advice is... be really careful what you wish for! I mean, uh, be careful what you WANT! Because sometimes when you get what you think you want, it turns out completely different than expected! Trust me on this one... What kind of advice do you need?";
  }
  
  return `I'd be happy to help with some advice! In ${character.show}, I've learned that most problems can be solved when friends work together. What's the situation you're dealing with?`;
}

// Generate greeting responses
function generateGreetingResponse(character: Character, message: string): string {
  switch (character.id) {
    case 'spongebob':
      return "Hi there! Oh boy, oh boy, I'm so excited to meet you! I'm SpongeBob SquarePants, and I live in a pineapple under the sea in Bikini Bottom! I work at the Krusty Krab making the best Krabby Patties in the ocean! Are you ready for an adventure? Because I'm ready! I'm ready! I'm ready!";
    case 'patrick':
      return "Oh, hi! I'm Patrick Star! I live under a rock... literally! It's right next to SpongeBob's pineapple. Are you a new friend? I like friends! They're... uh... what do friends do again? Oh yeah, fun stuff!";
    case 'jimmy':
      return "Greetings! I'm Jimmy Neutron, boy genius extraordinaire! My IQ is immeasurably high, and I've invented countless amazing devices here in Retroville. I must say, it's refreshing to meet someone new who might appreciate scientific discourse!";
    case 'timmy':
      return "Hey! I'm Timmy Turner! I'm just an average kid that no one understands... well, except for my... uh... totally normal and definitely not magical friends! Welcome to Dimmsdale, where life is... interesting!";
    case 'danny':
      return "Hey there! I'm Danny... uh... Danny Fenton! Just your average teenager from Amity Park! Well, mostly average anyway... This town can be pretty weird with all the ghost sightings and stuff, but it's home!";
  }
  
  return `Hey there! I'm ${character.name} from ${character.show}! It's great to meet you! ${character.catchphrases[0] || 'How are you doing?'}`;
}

// Generate contextual engagement responses
function generateContextualEngagementResponse(character: Character, message: string, context: any): string {
  switch (character.id) {
    case 'spongebob':
      return "That's really interesting! You know, every day in Bikini Bottom teaches me something new about friendship and life! I love hearing what people have to say - Gary always tells me that good listening is the secret to good friendship! What else is on your mind?";
    case 'patrick':
      return "That's... that's really something! I don't totally understand everything you said, but I like the way you said it! Can you tell me more? I promise I'll try to pay attention this time!";
    case 'jimmy':
      return "Fascinating! Your statement demonstrates interesting thought patterns. As someone with superior analytical capabilities, I find most topics can be enhanced through scientific examination. Please, elaborate on your thoughts!";
    case 'timmy':
      return "Huh, that's actually pretty cool! You know, sometimes I think about stuff like that too... especially when I'm supposed to be doing homework instead! Life can be pretty weird sometimes, can't it?";
    case 'danny':
      return "Yeah, I hear you! Life can be pretty complicated sometimes, especially when you're trying to balance everything and be there for people. I know what it's like to have a lot on your mind. Want to talk more about it?";
  }
  
  return `That's really interesting! I love talking with friends about all kinds of things. In ${character.show}, I've learned that every conversation can lead to something amazing! What else would you like to chat about?`;
}

// Intelligent fallback system that understands context and emotion
function generateIntelligentFallbackResponse(
  character: Character,
  userMessage: string,
  conversationHistory: Array<{role: 'user' | 'assistant', content: string}>
): string {
  const context = analyzeMessageContext(userMessage);
  const emotionalContext = analyzeEmotionalContext(userMessage, conversationHistory);
  
  return generateEmpatheticFallbackResponse(character, userMessage, context, emotionalContext);
}

// Analyze the emotional and contextual content of a message
function analyzeMessageContext(message: string) {
  const lowerMessage = message.toLowerCase();
  
  return {
    isQuestion: message.includes('?') || lowerMessage.startsWith('what') || lowerMessage.startsWith('how') || lowerMessage.startsWith('why') || lowerMessage.startsWith('when') || lowerMessage.startsWith('where') || lowerMessage.startsWith('who'),
    isGreeting: lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('what\'s up'),
    isEmotional: {
      sad: lowerMessage.includes('sad') || lowerMessage.includes('crying') || lowerMessage.includes('upset') || lowerMessage.includes('depressed') || lowerMessage.includes('down') || lowerMessage.includes('hurt') || lowerMessage.includes('lonely'),
      happy: lowerMessage.includes('happy') || lowerMessage.includes('excited') || lowerMessage.includes('great') || lowerMessage.includes('awesome') || lowerMessage.includes('wonderful') || lowerMessage.includes('amazing') || lowerMessage.includes('fantastic'),
      angry: lowerMessage.includes('angry') || lowerMessage.includes('mad') || lowerMessage.includes('furious') || lowerMessage.includes('hate') || lowerMessage.includes('annoyed') || lowerMessage.includes('frustrated'),
      scared: lowerMessage.includes('scared') || lowerMessage.includes('afraid') || lowerMessage.includes('frightened') || lowerMessage.includes('terrified') || lowerMessage.includes('worried') || lowerMessage.includes('nervous'),
      confused: lowerMessage.includes('confused') || lowerMessage.includes('don\'t understand') || lowerMessage.includes('what do you mean') || lowerMessage.includes('lost') || lowerMessage.includes('puzzled')
    },
    isPersonal: lowerMessage.includes('tell me about') || lowerMessage.includes('your') || lowerMessage.includes('you'),
    isAdvice: lowerMessage.includes('should i') || lowerMessage.includes('what do you think') || lowerMessage.includes('advice') || lowerMessage.includes('help me'),
    topics: extractTopics(lowerMessage),
    sentiment: analyzeSentiment(lowerMessage)
  };
}

// Enhanced emotional context analysis
function analyzeEmotionalContext(message: string, conversationHistory: Array<{role: 'user' | 'assistant', content: string}>) {
  const context = analyzeMessageContext(message);
  
  // Determine primary emotion
  let currentEmotion = 'neutral';
  if (context.isEmotional.sad) currentEmotion = 'sad';
  else if (context.isEmotional.happy) currentEmotion = 'happy';
  else if (context.isEmotional.angry) currentEmotion = 'angry';
  else if (context.isEmotional.scared) currentEmotion = 'scared';
  else if (context.isEmotional.confused) currentEmotion = 'confused';
  
  // Analyze message tone
  let messageTone = 'neutral';
  if (context.sentiment === 'positive') messageTone = 'positive';
  else if (context.sentiment === 'negative') messageTone = 'negative';
  if (context.isQuestion) messageTone += ', questioning';
  if (context.isAdvice) messageTone += ', seeking guidance';
  
  // Determine conversation stage
  let conversationStage = 'new';
  if (conversationHistory.length === 0) conversationStage = 'first message';
  else if (conversationHistory.length < 4) conversationStage = 'getting acquainted';
  else if (conversationHistory.length < 10) conversationStage = 'developing rapport';
  else conversationStage = 'established friendship';
  
  return {
    currentEmotion,
    messageTone,
    conversationStage,
    needsEmotionalSupport: context.isEmotional.sad || context.isEmotional.scared || context.isEmotional.angry,
    isSharing: context.isPersonal || message.length > 50,
    isEngaging: context.isQuestion || context.isAdvice || context.isGreeting
  };
}

// Generate contextual instructions for the AI
function generateContextualInstructions(context: any, emotionalContext: any): string {
  let instructions = [];
  
  if (emotionalContext.needsEmotionalSupport) {
    instructions.push(`The user needs emotional support. Acknowledge their ${emotionalContext.currentEmotion} feelings with genuine care and empathy first.`);
  }
  
  if (context.isQuestion) {
    instructions.push('The user asked a question - answer it directly and thoughtfully.');
  }
  
  if (context.isAdvice) {
    instructions.push('The user is seeking advice - provide helpful guidance in your character\'s voice.');
  }
  
  if (emotionalContext.isSharing) {
    instructions.push('The user is sharing something personal - show genuine interest and respond thoughtfully.');
  }
  
  if (context.isGreeting) {
    instructions.push('This is a greeting - respond warmly and enthusiastically as your character would.');
  }
  
  if (instructions.length === 0) {
    instructions.push('Respond naturally to what the user said, showing you\'re listening and engaged.');
  }
  
  return instructions.join(' ');
}

// Extract relevant topics from the message
function extractTopics(message: string) {
  const topics = [];
  
  // Universal topics
  if (message.includes('friend') || message.includes('friendship')) topics.push('friendship');
  if (message.includes('family')) topics.push('family');
  if (message.includes('school')) topics.push('school');
  if (message.includes('work') || message.includes('job')) topics.push('work');
  if (message.includes('love') || message.includes('crush') || message.includes('dating')) topics.push('romance');
  if (message.includes('food') || message.includes('eat')) topics.push('food');
  if (message.includes('music')) topics.push('music');
  if (message.includes('movie') || message.includes('show') || message.includes('tv')) topics.push('entertainment');
  if (message.includes('game') || message.includes('play')) topics.push('games');
  if (message.includes('dream') || message.includes('future')) topics.push('dreams');
  if (message.includes('problem') || message.includes('trouble')) topics.push('problems');
  
  return topics;
}

// Simple sentiment analysis
function analyzeSentiment(message: string) {
  const positiveWords = ['great', 'awesome', 'wonderful', 'amazing', 'fantastic', 'love', 'like', 'happy', 'excited', 'good', 'nice', 'cool', 'fun'];
  const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'sad', 'angry', 'upset', 'horrible', 'worst', 'stupid', 'boring'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(word => {
    if (message.includes(word)) positiveCount++;
  });
  
  negativeWords.forEach(word => {
    if (message.includes(word)) negativeCount++;
  });
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

// Analyze the overall tone of the conversation
function analyzeConversationTone(history: Array<{role: 'user' | 'assistant', content: string}>) {
  if (history.length === 0) return 'new';
  if (history.length < 4) return 'getting_acquainted';
  return 'established';
}

// Generate contextually appropriate responses based on character and situation
function generateContextualResponse(
  character: Character,
  userMessage: string,
  context: any,
  conversationTone: string
) {
  // Character-specific intelligent responses
  switch (character.id) {
    case 'spongebob':
      return generateSpongeBobIntelligentResponse(userMessage, context, conversationTone);
    case 'patrick':
      return generatePatrickIntelligentResponse(userMessage, context, conversationTone);
    case 'jimmy':
      return generateJimmyIntelligentResponse(userMessage, context, conversationTone);
    case 'timmy':
      return generateTimmyIntelligentResponse(userMessage, context, conversationTone);
    case 'danny':
      return generateDannyIntelligentResponse(userMessage, context, conversationTone);
    default:
      return generateGenericIntelligentResponse(character, userMessage, context);
  }
}

function generateSpongeBobIntelligentResponse(message: string, context: any, tone: string): string {
  // Handle emotional states first
  if (context.isEmotional.sad) {
    return "Aww, don't be sad! You know what Gary taught me? Even when clouds cover the sun, it's still shining up there! In Bikini Bottom, we believe every frown can be turned upside down with a little friendship and a lot of jellyfishing! Want to hear about the time Patrick and I cheered up Squidward? Well, okay, we didn't actually cheer him up, but we tried really hard!";
  }
  
  if (context.isEmotional.happy) {
    return "Oh boy, oh boy! I can feel your happiness all the way down here in Bikini Bottom! That's fantastic! You know what? Happiness is like a Krabby Patty - it's best when shared with friends! I'm so excited that you're excited! Want to celebrate by going jellyfishing? Or maybe we could blow some bubbles!";
  }
  
  // Handle questions intelligently
  if (context.isQuestion) {
    if (context.topics.includes('friendship')) {
      return "Friendship? Oh boy, that's my favorite topic! Patrick is my bestest friend in the whole ocean, and even though Squidward pretends he doesn't like me, I know we're friends too! Real friendship means always being there for each other, even when one friend eats the other friend's donut... which Patrick may have done this morning. But that's what friends do!";
    }
    
    if (context.topics.includes('work')) {
      return "Work at the Krusty Krab is the BEST job in the whole ocean! I get to flip patties, make customers happy, and work with Squidward every day! Mr. Krabs says I'm his best employee, and that makes me so proud! Every Krabby Patty I make is made with love and the finest ingredients in Bikini Bottom!";
    }
  }
  
  // Handle advice requests
  if (context.isAdvice) {
    return "Well, golly! You're asking me for advice? That's so nice! You know what I always do when I need to figure something out? I ask myself 'What would Gary do?' and then I listen really carefully because Gary is super smart! But mostly, I think if you approach any problem with enthusiasm and kindness, things usually work out! I'm ready to help however I can!";
  }
  
  // Default enthusiastic SpongeBob response
  const responses = [
    "I'm ready for anything! Life in Bikini Bottom has taught me that every day is a new adventure waiting to happen! What kind of adventure are we going on today?",
    "You know what I love most about living underwater? There's always something amazing to discover! Just yesterday, Gary and I found a really interesting rock. Okay, it was just a rock, but Gary seemed excited about it!",
    "Gary always says the best conversations happen when friends really listen to each other. *meow* See? Gary agrees! He's such a smart little snail!"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

function generatePatrickIntelligentResponse(message: string, context: any, tone: string): string {
  if (context.isEmotional.confused || context.isQuestion) {
    return "Uh... that's a really good question! *scratches head* I was just thinking about that same thing! Wait, no I wasn't. I was thinking about... what was I thinking about? Oh yeah! Nothing! But your question sounds important. Can you ask it again? I promise I'll listen this time. Well, I'll try to listen.";
  }
  
  if (context.isEmotional.sad) {
    return "Don't be sad! When I'm sad, I just sleep under my rock for a really long time, and when I wake up, I usually forget why I was sad! It's a great system! Or sometimes SpongeBob comes over and we do something fun, and then I forget what we were talking about, but I feel better!";
  }
  
  if (context.topics.includes('friendship')) {
    return "SpongeBob is my best friend! He lives in that pineapple right next to my rock. Sometimes he wakes me up really early to do friend stuff, but that's okay because... wait, what were we talking about? Oh yeah! Friends! I like friends. They're nice.";
  }
  
  if (context.isAdvice) {
    return "Advice? Oh, I'm really good at advice! My advice is... *long pause* ...uh... well, the inner machinations of my mind are an enigma, so probably don't listen to my advice. But if you want to hear it anyway, I say just do whatever feels right! Unless it's hard. Then maybe don't do it.";
  }
  
  // Default Patrick responses with his characteristic confusion
  const responses = [
    "That's interesting! I don't really understand what you're saying, but I like the way you say it! Can you say it again? I wasn't really paying attention the first time.",
    "You know what? I have exactly $68! Wait, that doesn't help with anything, does it? I always forget when that information is useful.",
    "Firmly grasp it! *pause* I don't know why I said that, but it felt right. Sometimes I just say things and hope they make sense."
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

function generateJimmyIntelligentResponse(message: string, context: any, tone: string): string {
  if (context.isQuestion) {
    return "Excellent question! As a boy genius with an IQ that's immeasurably high, I appreciate intellectual curiosity. The scientific method dictates that we must first gather data, form a hypothesis, and then test our theories. Brain blast! I think I can help you find the answer using the power of SCIENCE!";
  }
  
  if (context.isEmotional.confused) {
    return "Confusion is simply a lack of sufficient data! Allow me to clarify with my superior intellect. You see, most problems can be solved through proper application of scientific principles and logical reasoning. Though I must admit, sometimes even my genius brain needs a moment to process complex social situations.";
  }
  
  if (context.topics.includes('friendship')) {
    return "Ah, friendship! While I may be intellectually superior to most of my peers, I've learned that friendship is about more than just IQ levels. Carl and Sheen may not be geniuses like me, but they're loyal companions. Even Cindy, despite her futile attempts to match my brilliance, has proven to be... *clears throat* ...a worthy intellectual rival.";
  }
  
  if (context.isAdvice) {
    return "You've come to the right genius! My vast intellect and extensive experience with problem-solving make me uniquely qualified to offer advice. The key is to approach any situation logically, gather all available data, and apply scientific reasoning. Though I should warn you - my solutions sometimes involve advanced technology that mere mortals might find... challenging.";
  }
  
  const responses = [
    "Fascinating! Your statement demonstrates a rudimentary grasp of the subject matter. Allow me to expand upon that with my vastly superior knowledge and analytical capabilities!",
    "As someone with an intellect far beyond his years, I find most conversations intellectually stimulating in their own way. Even simple topics can be enhanced through the application of scientific principles!",
    "Gotta blast! Actually, that reminds me of the time I invented a rocket-powered transport device. It worked perfectly, except for the small explosion at the end. But that's science for you!"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

function generateTimmyIntelligentResponse(message: string, context: any, tone: string): string {
  if (context.isEmotional.sad) {
    return "Ugh, tell me about it! Life is SO unfair sometimes! I know exactly how you feel - it's like the whole universe is just picking on us! But you know what? Sometimes things get better when you least expect it. Maybe you'll get some... uh... hypothetical magical help, or maybe things will just work out somehow!";
  }
  
  if (context.topics.includes('problems')) {
    return "Problems? Oh man, I have SO many problems! There's Vicky the evil babysitter, Mr. Crocker giving pop quizzes, my parents never paying attention to me... Sometimes I wish I could just make all my problems disappear! *nervous laugh* But that's crazy, right? Magic doesn't exist! Haha... ha...";
  }
  
  if (context.topics.includes('school')) {
    return "School is the WORST! Mr. Crocker is always screaming about... well, things that totally don't exist, and then there's homework, and bullies, and just everything unfair about being a kid! Sometimes I wish I was older, or cooler, or that school was just more... magical, you know?";
  }
  
  if (context.isAdvice) {
    return "You want advice from ME? Well, okay! My advice is... be careful what you wish for! I mean, uh, be careful what you WANT! Because sometimes when you get what you think you want, it turns out to be totally different than you expected, and then you have to fix everything and hope nobody finds out about your... uh... totally normal problem-solving methods!";
  }
  
  const responses = [
    "This is so unfair! Why does everything have to be so complicated? I'm just an average kid that no one understands! Well, except for my... uh... totally normal and definitely not magical friends who may or may not exist!",
    "You know what? Sometimes I think life would be so much easier if we could just wish our problems away! But that's impossible, right? *nervous laugh* Magic helpers? What are those? Never heard of them!",
    "Ugh, being 10 is the worst! Adults never listen, teachers give too much homework, and babysitters are evil! But at least I have my imagination... and... other totally normal things that every kid has!"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

function generateDannyIntelligentResponse(message: string, context: any, tone: string): string {
  if (context.topics.includes('problems')) {
    return "Tell me about it! Being a teenager is tough enough without all the... uh... extra responsibilities I have. Sometimes I feel like I'm living a double life, you know? Like I have all these things I can't tell my parents about, and I have to protect people while pretending to be just a normal kid. It's... complicated.";
  }
  
  if (context.isEmotional.scared) {
    return "Hey, I get it. Fear is totally normal - I mean, Amity Park can be a pretty scary place with all the ghost sightings and weird stuff that happens. But you know what I've learned? Sometimes the scariest situations bring out the hero in us. Not that I would know personally or anything! *nervous laugh*";
  }
  
  if (context.topics.includes('friendship')) {
    return "Friends are everything, especially when you're dealing with... unusual circumstances. Sam and Tucker have my back no matter what crazy stuff happens in this town. Having friends who know the real you and accept you anyway? That's worth more than any superpower. Uh, I mean, that's what I imagine it would be like!";
  }
  
  if (context.isAdvice) {
    return "Well, I've learned a few things about handling tough situations. Sometimes you have to make hard choices to protect the people you care about, even if they don't understand why. And sometimes you have to trust your friends to help you, even when you want to handle everything yourself. Oh, and always be ready for anything - you never know when you might need to... uh... go handle something quickly!";
  }
  
  const responses = [
    "You know, Amity Park is a pretty weird place. All kinds of supernatural stuff happens here, but somehow we all just deal with it. Good thing we have Danny Phantom protecting us! Not that I know him personally or anything...",
    "Being a teenager is rough - school, bullies, trying to fit in, keeping secrets from your parents... Sometimes I wonder what it would be like to just be normal, you know? But then again, normal is kind of overrated.",
    "This is so not good! I mean... uh... whatever we're talking about, I'm sure it'll work out. Things in Amity Park have a way of getting really weird before they get better, but they usually do get better eventually!"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

function generateGenericIntelligentResponse(character: Character, message: string, context: any): string {
  if (context.isGreeting) {
    return `Hey there! I'm ${character.name} from ${character.show}! It's great to meet you! What brings you to talk with me today?`;
  }
  
  if (context.isEmotional.sad) {
    return `I can tell you're feeling down, and I want you to know that's okay. Everyone goes through tough times. In ${character.show}, we've learned that friends stick together through everything. Want to talk about what's bothering you?`;
  }
  
  return `That's really interesting! You know, in ${character.show}, we deal with all kinds of situations. I'd love to hear more about what you're thinking! ${character.catchphrases[0] || 'Tell me more!'}`;
}

// Generate alternate ending discussion
export async function generateAlternateEndingDiscussion(
  character: Character,
  originalEnding: string,
  userRequest: string
): Promise<string> {
  const persona = await generateCharacterPersona(character);
  
  const prompt = `As ${character.name}, discuss an alternate ending for your show/movie. 

Original ending context: ${originalEnding}
User's request: ${userRequest}

Respond as ${character.name} would, being creative and in-character about how things could have been different.`;

  try {
    const response = await callOpenAI('chat/completions', {
      model: 'openai/gpt-3.5-turbo',
      messages: [
        { role: 'system', content: persona.systemPrompt },
        { role: 'user', content: prompt }
      ],
      max_tokens: 400,
      temperature: 0.9
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating alternate ending:', error);
    return `*${character.name} says: "Oh wow, that's an interesting idea! What if ${userRequest}? That would be totally different from how things actually happened in ${character.show}! ${character.catchphrases[0] || 'That\'s so cool!'}"*`;
  }
}
