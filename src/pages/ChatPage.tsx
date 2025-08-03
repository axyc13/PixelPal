import { CHARACTERS_DATABASE } from '../characterService';
// PNG images for sidebar reveal
import TinkerbellImg from '../images/Tinker_Bell_(Disney_character).png';
import SpongeBobImg from '../images/SpongeBob_SquarePants_character.png';
import MickeyMouseImg from '../images/MickeyMouse.webp';
import ScoobyDooImg from '../images/a1b3db49a235f7991f0ce3525d39253a.png';
import SimbaaImg from '../images/Simba-PNG-Image-Background.png';
import DoraImg from '../images/Dora_photo1.webp';

const characterImageMap: Record<string, string> = {
  tinkerbell: TinkerbellImg,
  spongebob: SpongeBobImg,
  mickey: MickeyMouseImg,
  scooby: ScoobyDooImg,
  simba: SimbaaImg,
  dora: DoraImg,
};
// Avatar imports for sidebar
import Tinkerbell from "../avatars/Tinkerbell";
import SpongeBob from "../avatars/SpongeBob";
import MickeyMouse from "../avatars/MickeyMouse";
import ScoobyDoo from "../avatars/ScoobyDoo";
import Simbaa from "../avatars/Simbaa";
import DoraAvatar from "../avatars/DoraAvatar";
// Map character id to avatar component
const avatarMap: Record<string, React.FC> = {
  tinkerbell: Tinkerbell,
  spongebob: SpongeBob,
  mickey: MickeyMouse,
  scooby: ScoobyDoo,
  simba: Simbaa,
  dora: DoraAvatar,
};
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import type { Character } from '../characterService';
import { generateCharacterResponse } from '../characterService';
import { chatService } from '../chatService';
import type { ChatSession } from '../chatService';
import exit from '../assets/exit.png';
import minimise from '../assets/minimise.png';
import full from '../assets/full.png';

// Enhanced character typing behavior functions
function getCharacterThinkingMessage(character: Character): string {
  switch (character.id) {
    case 'spongebob':
      return "*SpongeBob is thinking really hard, his brain coral is working!* 🧠";
    case 'scooby':
      return "*Scooby scratches behind his ear with his back paw, thinking* 🐕";
    case 'simba':
      return "*Simba gazes thoughtfully across the Pride Lands* 🦁";
    case 'dora':
      return "*Dora taps her finger on her chin, thinking of the best way to help* 🤔";
    case 'mickey':
      return "*Mickey's ears perk up as he thinks of the perfect solution* 🐭";
    case 'tinkerbell':
      return "*Tinker Bell hovers in the air, tiny gears turning in her head* ✨";
    default:
      return `*${character.name} is thinking...*`;
  }
}

function getCharacterTypingMessage(character: Character): string {
  switch (character.id) {
    case 'spongebob':
      return "*SpongeBob is typing excitedly with his spatula hands!* ⌨️";
    case 'scooby':
      return "*Scooby is carefully typing with one paw* 🐾";
    case 'simba':
      return "*Simba is thoughtfully composing his royal response* 👑";
    case 'dora':
      return "*Dora is typing in both English and Spanish!* 📝";
    case 'mickey':
      return "*Mickey is typing with his white gloves, humming happily* 🎵";
    case 'tinkerbell':
      return "*Tinker Bell is sprinkling pixie dust on her tiny keyboard* ✨";
    default:
      return `*${character.name} is typing...*`;
  }
}

function getCharacterTypingDelay(character: Character): number {
  switch (character.id) {
    case 'spongebob':
      return 500; // Fast, energetic typist
    case 'scooby':
      return 1500; // Careful, thoughtful typing
    case 'simba':
      return 1200; // Regal, measured responses
    case 'dora':
      return 800; // Quick and helpful
    case 'mickey':
      return 1000; // Cheerful, steady pace
    case 'tinkerbell':
      return 700; // Quick and magical
    default:
      return 1000; // Normal typing speed
  }
}

// Character-specific message styling
function getCharacterMessageStyle(character: Character): string {
  switch (character.id) {
    case 'spongebob':
      return 'bg-yellow-100 border-yellow-400 text-yellow-900';
    case 'scooby':
      return 'bg-amber-100 border-amber-400 text-amber-900';
    case 'simba':
      return 'bg-orange-100 border-orange-400 text-orange-900';
    case 'dora':
      return 'bg-pink-100 border-pink-400 text-pink-900';
    case 'mickey':
      return 'bg-red-100 border-red-400 text-red-900';
    case 'tinkerbell':
      return 'bg-green-100 border-green-400 text-green-900';
    default:
      return 'bg-purple-100 border-purple-400 text-purple-800';
  }
}

// Character emojis for visual appeal
function getCharacterEmoji(character: Character): string {
  switch (character.id) {
    case 'spongebob':
      return '🧽';
    case 'scooby':
      return '🐕';
    case 'simba':
      return '🦁';
    case 'dora':
      return '🎒';
    case 'mickey':
      return '🐭';
    case 'tinkerbell':
      return '🧚‍♀️';
    default:
      return '🎭';
  }
}

// Enhanced message formatting with character-specific touches
function formatCharacterMessage(text: string, character: Character): string {
  // Add subtle character-specific formatting
  let formattedText = text;
  
  // Highlight action text (text between asterisks)
  formattedText = formattedText.replace(/\*(.*?)\*/g, '<em class="text-gray-600 font-medium">$1</em>');
  
  // Make sound effects more prominent based on character
  switch (character.id) {
    case 'spongebob':
      formattedText = formattedText.replace(/\b(bubble|splash|meow|purr|whoosh|pop|ding|barnacles|tartar sauce)\b/gi, '<strong class="text-yellow-600">$1</strong>');
      break;
    case 'scooby':
      formattedText = formattedText.replace(/\b(roh|rello|raggy|rhere|ruh-roh|scooby-dooby-doo|woof|arf)\b/gi, '<strong class="text-amber-600">$1</strong>');
      break;
    case 'simba':
      formattedText = formattedText.replace(/\b(roar|growl|purr|hakuna matata|circle of life)\b/gi, '<strong class="text-orange-600">$1</strong>');
      break;
    case 'dora':
      formattedText = formattedText.replace(/\b(vamos|hola|excelente|lo hicimos|vámonos)\b/gi, '<strong class="text-pink-600">$1</strong>');
      break;
    case 'mickey':
      formattedText = formattedText.replace(/\b(ha-ha|hot dog|oh boy|gosh|mouseketools)\b/gi, '<strong class="text-red-600">$1</strong>');
      break;
    case 'tinkerbell':
      formattedText = formattedText.replace(/\b(jingle|chime|ding|pixie dust|faith trust)\b/gi, '<strong class="text-green-600">$1</strong>');
      break;
    default:
      formattedText = formattedText.replace(/\b(meow|purr|splash|bubble|whoosh|pop|ding)\b/gi, '<strong class="text-blue-600">$1</strong>');
  }
  
  return formattedText;
}
function getCharacterWelcomeMessages(character: Character) {
  const baseTime = new Date();
  
  switch (character.id) {
    case 'spongebob':
      return [
        {
          id: 'welcome-1',
          sender: character.name,
          text: "*SpongeBob bounces excitedly in his pineapple house* 🧽",
          timestamp: new Date(baseTime.getTime())
        },
        {
          id: 'welcome-2', 
          sender: character.name,
          text: "Oh boy oh boy oh boy! A new friend! Hi there, I'm SpongeBob SquarePants! I live in a pineapple under the sea in Bikini Bottom! *Gary meows in the background* 🐌",
          timestamp: new Date(baseTime.getTime() + 1000)
        },
        {
          id: 'welcome-3',
          sender: character.name,
          text: "I just got done making Krabby Patties at the Krusty Krab - it's the BEST job ever! What brings you down to my neighborhood? I'm always ready for a new adventure! 🍔✨",
          timestamp: new Date(baseTime.getTime() + 2000)
        }
      ];
      
    case 'scooby':
      return [
        {
          id: 'welcome-1',
          sender: character.name,
          text: "*Scooby pokes his head out from behind a tree, looking a bit nervous* 🐕",
          timestamp: new Date(baseTime.getTime())
        },
        {
          id: 'welcome-2',
          sender: character.name, 
          text: "Roh! Ri mean... Rello! I'm Scooby-Doo! *wags tail cautiously* Are you a friend? You're not a rhost, are you? 👻",
          timestamp: new Date(baseTime.getTime() + 1500)
        },
        {
          id: 'welcome-3',
          sender: character.name,
          text: "Raggy and I just solved another mystery! Well... mostly Raggy solved it while I was hiding. *laughs nervously* Do you have any Scooby Snacks? Rhat always makes me feel braver! 🍪",
          timestamp: new Date(baseTime.getTime() + 3000)
        }
      ];
      
    case 'simba':
      return [
        {
          id: 'welcome-1',
          sender: character.name,
          text: "*Simba stands proudly on Pride Rock, mane flowing in the wind* �",
          timestamp: new Date(baseTime.getTime())
        },
        {
          id: 'welcome-2',
          sender: character.name, 
          text: "Welcome to the Pride Lands, my friend. I am Simba, son of Mufasa, King of Pride Rock. *looks out over his kingdom with wisdom in his eyes*",
          timestamp: new Date(baseTime.getTime() + 1200)
        },
        {
          id: 'welcome-3',
          sender: character.name,
          text: "The circle of life has brought us together today. Whether you seek wisdom, friendship, or just want to share in the beauty of this land, you are welcome here. What brings you to Pride Rock? 🌅",
          timestamp: new Date(baseTime.getTime() + 2500)
        }
      ];
      
    case 'dora':
      return [
        {
          id: 'welcome-1',
          sender: character.name,
          text: "*Dora waves enthusiastically with Boots jumping beside her* 🎒",
          timestamp: new Date(baseTime.getTime())
        },
        {
          id: 'welcome-2',
          sender: character.name, 
          text: "¡Hola! Hi! I'm Dora! And this is my best friend Boots! *Boots waves* We were just about to go on an adventure! Do you want to come with us? ¡Vamos! 🐵",
          timestamp: new Date(baseTime.getTime() + 1000)
        },
        {
          id: 'welcome-3',
          sender: character.name,
          text: "I love meeting new friends! We can explore together and I can teach you some Spanish too! Say 'Hola' - that means 'Hello!' ¡Excelente! What adventure should we go on today? 🗺️",
          timestamp: new Date(baseTime.getTime() + 2200)
        }
      ];
      
    case 'mickey':
      return [
        {
          id: 'welcome-1',
          sender: character.name,
          text: "*Mickey Mouse appears with his classic pose, hands on hips and big smile* 🐭",
          timestamp: new Date(baseTime.getTime())
        },
        {
          id: 'welcome-2',
          sender: character.name, 
          text: "Oh boy, oh boy, oh boy! A new pal! Ha-ha! I'm Mickey Mouse! Welcome to my Clubhouse! *does a little dance* Hot dog!",
          timestamp: new Date(baseTime.getTime() + 1000)
        },
        {
          id: 'welcome-3',
          sender: character.name,
          text: "Gosh, I'm so excited to meet you! We can solve problems together with my Mouseketools! Oh, Toodles! *Toodles appears with a jingle* What kind of adventure would you like to have today? 🏠",
          timestamp: new Date(baseTime.getTime() + 2000)
        }
      ];
      
    case 'tinkerbell':
      return [
        {
          id: 'welcome-1',
          sender: character.name,
          text: "*Tinker Bell flies in with a trail of golden pixie dust, jingling softly* ✨",
          timestamp: new Date(baseTime.getTime())
        },
        {
          id: 'welcome-2',
          sender: character.name, 
          text: "*jingles excitedly* Oh! A new friend! I'm Tinker Bell! *does a loop in the air* I'm a tinker fairy from Pixie Hollow! Do you believe in fairies? 🧚‍♀️",
          timestamp: new Date(baseTime.getTime() + 1200)
        },
        {
          id: 'welcome-3',
          sender: character.name,
          text: "I was just working on fixing some pots and pans! *proudly shows tiny tools* Being a tinker fairy is the best job ever! With faith, trust, and a little bit of pixie dust, we can do anything! What would you like to create together? 🔧",
          timestamp: new Date(baseTime.getTime() + 2500)
        }
      ];
      
    default:
      return [
        {
          id: 'welcome',
          sender: character.name,
          text: `*${character.name} appears with a warm smile* Hey there! I'm ${character.name} from ${character.show}! ${character.catchphrases[0]} Ready to chat and share some memories? ✨`,
          timestamp: baseTime
        }
      ];
  }
}

interface ChatPageProps {
  user: any;
}

export const ChatPage: React.FC<ChatPageProps> = ({ user: _user }) => {
  const [messages, setMessages] = useState<Array<{ id: string; sender: string; text: string; timestamp: Date }>>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [character, setCharacter] = useState<Character | null>(null);
  const [session, setSession] = useState<ChatSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { characterId } = useParams();
  const location = useLocation();

  useEffect(() => {
    // Get character from CHARACTERS_DATABASE by id
    if (location.state?.character) {
      setCharacter(location.state.character);
    } else if (characterId) {
      const found = CHARACTERS_DATABASE.find((c: any) => c.id === characterId);
      if (found) {
        setCharacter(found);
      } else {
        setCharacter({
          id: characterId,
          name: characterId.charAt(0).toUpperCase() + characterId.slice(1),
          show: 'Show',
          year: '2000',
          personality: 'Friendly',
          catchphrases: ['Hello!', 'How are you?'],
          voiceDescription: 'Cheerful',
          background: 'A fun character',
          relationships: ['Everyone\'s friend'],
          alternateEndings: ['Happy ending'],
          prompt: 'You are a friendly character who loves to chat!'
        });
      }
    }
  }, [characterId, location.state]);

  useEffect(() => {
    if (character) {
      const initializeChat = async () => {
        const newSession = await chatService.createChatSession(character);
        setSession(newSession);
        
        // Add enhanced welcome message with character immersion
        const welcomeMessages = getCharacterWelcomeMessages(character);
        setMessages(welcomeMessages);
      };

      initializeChat();
    }
  }, [character]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !session || !character) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'You',
      text: newMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = newMessage;
    setNewMessage('');
    
    // Show character-specific thinking/typing messages
    setIsTyping(true);
    setTypingMessage(getCharacterThinkingMessage(character));
    
    // Add realistic delay based on message length and character personality
    const baseDelay = 1000;
    const lengthDelay = Math.min(currentMessage.length * 50, 3000);
    const characterDelay = getCharacterTypingDelay(character);
    const totalDelay = baseDelay + lengthDelay + characterDelay;
    
    setTimeout(() => {
      setTypingMessage(getCharacterTypingMessage(character));
    }, totalDelay * 0.7);

    try {
      // Enhanced AI response with better conversation context
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === 'You' ? 'user' as const : 'assistant' as const,
        content: msg.text
      }));
      
      // Add the current user message to history for context
      const fullHistory = [...conversationHistory, {
        role: 'user' as const,
        content: currentMessage
      }];
      
      // Generate response with enhanced context understanding
      const aiResponseText = await generateCharacterResponse(character, currentMessage, fullHistory);
      
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        sender: character.name,
        text: aiResponseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback response if API fails
      const fallbackResponse = {
        id: (Date.now() + 1).toString(),
        sender: character.name,
        text: `I'm sorry, I'm having trouble connecting right now. But I'm still here and ready to chat! ${character.catchphrases[0]}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleClose = () => {
    navigate('/characterselect');
  };

  if (!character) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-4 font-['O4B3O'] flex items-center justify-center">
        <div className="text-purple-800 text-xl">Loading character...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 p-4 font-['O4B3O'] flex items-center justify-center">
      <div className="bg-white border-4 border-purple-600 shadow-2xl w-full max-w-6xl h-[90vh]">
        {/* Window Title Bar */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-yellow-300 rounded-sm flex items-center justify-center">
              <span className="text-black text-xs font-bold">💬</span>
            </div>
            <span className="font-bold font-04b text-lg">Chatroom</span>
          </div>
          <div className="flex items-center gap-1">
            <img src={minimise} className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity" alt="minimise" />
            <img src={full} className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity" alt="full" />
            <img src={exit} className="w-8 h-8 cursor-pointer hover:opacity-80 transition-opacity" alt="back" onClick={handleClose} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-full">
          {/* Left Panel - Character PNG Image and Name */}
          <div className="w-64 flex flex-col items-center justify-center border-r-2 border-purple-600 p-4">
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="w-48 h-48 flex items-center justify-center">
                {characterImageMap[character.id] && (
                  <img
                    src={characterImageMap[character.id]}
                    alt={character.name}
                    className="object-contain w-full h-full drop-shadow-lg"
                  />
                )}
              </div>
              <div className="mt-4 text-2xl font-04b text-purple-800 text-center">
                {character.name}
              </div>
            </div>
          </div>

          {/* Right Panel - Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 bg-white p-4 overflow-y-auto">
              <div className="border-2 border-gray-400 bg-white h-full p-4 overflow-y-auto">
                <div className="space-y-4">
                  {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    <div
                      className={`max-w-xs px-4 py-3 rounded-none border-2 ${
                        message.sender === 'You'
                          ? 'bg-blue-100 border-blue-400 text-blue-800'
                          : getCharacterMessageStyle(character)
                      } shadow-md hover:shadow-xl transition-shadow`}
                    >
                      <div className="font-bold text-xs mb-2 flex items-center gap-1">
                        {message.sender === 'You' ? (
                          <>👤 {message.sender}</>
                        ) : (
                          <>{getCharacterEmoji(character)} {message.sender}</>
                        )}
                        <span className="text-gray-500 ml-auto">
                          {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <div className={`text-sm ${message.sender !== 'You' ? 'leading-relaxed' : ''}`}>
                        <span dangerouslySetInnerHTML={{ __html: formatCharacterMessage(message.text, character) }} />
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-purple-100 border-2 border-purple-400 px-4 py-2 rounded-none animate-pulse">
                      <div className="font-bold text-xs mb-1">{character.name}</div>
                      <div className="text-sm italic">{typingMessage || "Typing..."}</div>
                    </div>
                  </div>
                )}
                </div>
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Horizontal Formatting Toolbar */}
            <div className="bg-white border-t border-gray-200 px-4 py-2">
              <div className="flex items-center justify-center space-x-4">
                {/* Mic button */}
                <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="#4F46E5"/>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Emoji button */}
                <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#EDB948"/>
                    <circle cx="8" cy="10" r="1" fill="black"/>
                    <circle cx="16" cy="10" r="1" fill="black"/>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>

                {/* Gallery button */}
                <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" fill="#5232F9"/>
                    <circle cx="8.5" cy="8.5" r="1.5" fill="white"/>
                    <path d="M21 15l-5-5L5 21" stroke="white" strokeWidth="2"/>
                  </svg>
                </button>

                {/* Font size A button */}
                <button 
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
                  style={{ fontFamily: 'DM Serif Text' }}
                >
                  <span className="text-lg font-bold text-gray-700">A</span>
                </button>

                {/* Person button */}
                <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="3" fill="black"/>
                    <path d="M16 21v-2a4 4 0 0 0-8 0v2" stroke="black" strokeWidth="2" fill="black"/>
                  </svg>
                </button>

                {/* Arrow button */}
                <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M7 10l5 5 5-5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Divider */}
                <div className="h-6 w-px bg-gray-300"></div>

                {/* Bold button */}
                <button 
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors font-black"
                  style={{ fontFamily: 'Arial Black' }}
                >
                  <span className="text-lg font-bold text-gray-700">B</span>
                </button>

                {/* Italic button */}
                <button 
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors italic"
                  style={{ fontFamily: 'Averia Serif Libre' }}
                >
                  <span className="text-lg font-bold text-gray-700">I</span>
                </button>

                {/* Underline button */}
                <button 
                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors underline"
                  style={{ fontFamily: 'Averia Serif Libre' }}
                >
                  <span className="text-lg font-bold text-gray-700">U</span>
                </button>

                {/* Divider */}
                <div className="h-6 w-px bg-gray-300"></div>

                {/* Chat button */}
                <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="#FF797A"/>
                    <path d="M8 10h8M8 14h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white border-t-2 border-purple-600 p-4 flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border-2 border-purple-400 bg-white focus:outline-none focus:border-purple-600 text-purple-800 font-bold"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-purple-500 to-purple-600 border-2 border-purple-700 text-white px-6 py-2 font-bold hover:from-purple-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 