import React, { useState, useEffect } from 'react';
import { Sparkles, Copy, Download, Wand2, Lightbulb, Target, Users, Zap, Loader2, Menu, X, Clock, LogOut, LogIn, Crown } from 'lucide-react';
import { generatePromptWithAI, PromptRequest } from './api/openai';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';
import { Auth } from './components/Auth';
import { Pricing } from './components/Pricing';

// Add error boundary
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
            <p className="mb-4">The app encountered an error. Please refresh the page.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 px-4 py-2 rounded"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  category: string;
}

interface PromptHistory {
  id: string;
  prompt: string;
  timestamp: Date;
  template?: string;
}

const promptTemplates: PromptTemplate[] = [
  {
    id: '1',
    name: 'Content Writer',
    description: 'Create engaging blog posts and articles',
    template: 'Write a [type of content] about [topic] that is [tone/style] and targets [audience]. Include [specific elements] and make it [length/format].',
    category: 'Writing'
  },
  {
    id: '2',
    name: 'Code Assistant',
    description: 'Get help with programming and debugging',
    template: 'I need help with [programming language] to [specific task]. My current code is [paste code here]. Please explain [what you need help with] and provide a solution.',
    category: 'Programming'
  },
  {
    id: '3',
    name: 'Creative Storyteller',
    description: 'Generate creative stories and narratives',
    template: 'Write a [genre] story about [main character] who [main conflict/plot]. The story should be [length] and include [specific elements]. Make it [tone/style].',
    category: 'Creative'
  },
  {
    id: '4',
    name: 'Business Analyst',
    description: 'Analyze business problems and provide insights',
    template: 'Analyze [business problem/opportunity] for [company/industry]. Consider [specific factors] and provide [type of analysis] with actionable recommendations.',
    category: 'Business'
  },
  {
    id: '5',
    name: 'Learning Tutor',
    description: 'Get educational explanations and tutorials',
    template: 'Explain [concept/topic] to someone who is [knowledge level]. Use [teaching style] and include [specific examples/analogies] to make it clear and engaging.',
    category: 'Education'
  },
  {
    id: '6',
    name: 'Problem Solver',
    description: 'Break down complex problems into solutions',
    template: 'I have a problem with [describe problem]. The context is [background information]. Please help me [specific goal] by [approach you want].',
    category: 'Problem Solving'
  }
];

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(promptTemplates[0]); // Content Writer as default
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [promptParams, setPromptParams] = useState<Record<string, string>>({});

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [promptHistory, setPromptHistory] = useState<PromptHistory[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [promptCount, setPromptCount] = useState(0);
  const [dailyPromptCount, setDailyPromptCount] = useState(0);
  const [lastPromptDate, setLastPromptDate] = useState<string>('');
  const [showAuth, setShowAuth] = useState(false);
  const [showPricing, setShowPricing] = useState(false);

  useEffect(() => {
    // Check for existing session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      }
    };
    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          setShowAuth(false);
        } else {
          setUser(null);
        }
      }
    );



    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleTemplateSelect = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setGeneratedPrompt('');
    setPromptParams({});
  };

  const handleParamChange = (param: string, value: string) => {
    setPromptParams(prev => ({ ...prev, [param]: value }));
  };

  const generatePrompt = async () => {
    // Check if user needs to authenticate (1 free prompt before login)
    if (promptCount >= 1 && !user) {
      setShowAuth(true);
      setError('Please log in to continue generating prompts.');
      return;
    }

    // Check daily limit for logged-in free users
    if (user && !user.email?.includes('@plus.') && !user.email?.includes('@platinum.')) {
      const today = new Date().toDateString();
      
      // Reset daily count if it's a new day
      if (lastPromptDate !== today) {
        setDailyPromptCount(0);
        setLastPromptDate(today);
      }
      
      // Check if daily limit reached (4 prompts per day for free users)
      if (dailyPromptCount >= 4) {
        setError('Daily limit reached! Upgrade to Plus for unlimited prompts.');
        setShowPricing(true);
        return;
      }
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const request: PromptRequest = {
        template: selectedTemplate?.template || '',
        parameters: promptParams,
        customPrompt: customPrompt || undefined
      };

      const response = await generatePromptWithAI(request);
      
      if (response.error) {
        setError(response.error);
        setGeneratedPrompt('');
      } else {
        setGeneratedPrompt(response.generatedPrompt);
        
        // Add to prompt history
        const newHistoryItem: PromptHistory = {
          id: Date.now().toString(),
          prompt: response.generatedPrompt,
          timestamp: new Date(),
          template: selectedTemplate?.name
        };
        setPromptHistory(prev => [newHistoryItem, ...prev]);
        
        // Increment prompt count and check if user needs to log in
        const newPromptCount = promptCount + 1;
        setPromptCount(newPromptCount);
        
        // Track daily usage for logged-in free users
        if (user && !user.email?.includes('@plus.') && !user.email?.includes('@platinum.')) {
          const today = new Date().toDateString();
          if (lastPromptDate !== today) {
            setDailyPromptCount(1);
            setLastPromptDate(today);
          } else {
            setDailyPromptCount(prev => prev + 1);
          }
        }
        
        if (newPromptCount === 1 && !user) {
          setShowAuth(true);
        }
      }
    } catch (err) {
      setError('Failed to generate prompt. Please check your API key and try again.');
      setGeneratedPrompt('');
    } finally {
      setIsGenerating(false);
    }
  };

  const loadPromptFromHistory = (historyItem: PromptHistory) => {
    setGeneratedPrompt(historyItem.prompt);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setPromptCount(0);
    setPromptHistory([]);
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
  };

  const downloadPrompt = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedPrompt], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'chatgpt-prompt.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const extractParameters = (template: string): string[] => {
    const matches = template.match(/\[([^\]]+)\]/g);
    return matches ? matches.map(match => match.slice(1, -1)) : [];
  };

  return (
    <ErrorBoundary>
      <div className="metallic-bg">
        {/* Authentication Modal */}
        {showAuth && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative">
              <Auth onAuthSuccess={handleAuthSuccess} />
            </div>
          </div>
        )}

      {/* Pricing Modal */}
      {showPricing && (
        <Pricing onClose={() => setShowPricing(false)} />
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Authentication Notice */}
        {promptCount >= 1 && !user && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Authentication Required:</strong> You've used your free prompt. Please log in to continue generating prompts.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAuth(true)}
                className="ml-4 bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-yellow-700"
              >
                Log In
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="text-center mb-8 md:mb-12 relative">
          {/* Hamburger Menu */}
          <div className="absolute top-2 left-2 md:top-0 md:left-0">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="metallic-button p-1 md:p-3 rounded text-xs"
            >
              {isMenuOpen ? <X className="w-3 h-3 md:w-6 md:h-6" /> : <Menu className="w-3 h-3 md:w-6 md:h-6" />}
            </button>
          </div>

          {/* User Info - Bottom Left Corner */}
          <div className="absolute bottom-0 left-0 flex items-center space-x-2 md:space-x-3 p-2 md:p-4">
            {user && (
              <>
                <span className="text-white text-xs md:text-sm">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="metallic-secondary-button p-1.5 md:p-2 rounded-lg"
                  title="Logout"
                >
                  <LogOut className="w-3 h-3 md:w-4 md:h-4" />
                </button>
              </>
            )}
          </div>

          {/* Top Right Buttons */}
          <div className="absolute top-2 right-2 md:top-0 md:right-0 flex items-center space-x-2 md:space-x-3">
            {!user && (
              <button
                onClick={() => setShowAuth(true)}
                className="bg-gray-700 hover:bg-gray-800 text-white px-2 py-1 md:px-4 md:py-2 rounded-lg text-xs md:text-base font-medium transition-colors"
              >
                Sign In
              </button>
            )}
            <button
              onClick={() => setShowPricing(true)}
              className="bg-gray-800 hover:bg-gray-900 text-white px-2 py-1 md:px-4 md:py-2 rounded-lg text-xs md:text-base font-medium transition-colors"
            >
              Get Plus
            </button>
          </div>

          {/* Menu Dropdown */}
          {isMenuOpen && (
            <div className="absolute top-12 md:top-16 left-0 z-50 w-72 md:min-w-80">
              <div className="metallic-card p-4 md:p-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 mr-2 text-gray-600" />
                  Prompt History
                </h3>
                
                {promptHistory.length === 0 ? (
                  <p className="text-gray-600 text-sm">No prompts generated yet. Start creating prompts to see them here!</p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {promptHistory.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => loadPromptFromHistory(item)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs text-gray-600 font-medium">
                            {item.template || 'Custom Prompt'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {item.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {item.prompt.substring(0, 150)}...
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-center mb-3 md:mb-4 pt-8 md:pt-12">
            <img 
              src={process.env.PUBLIC_URL + '/new-logo.png'} 
              alt="PromptThis Logo" 
              className="h-6 w-6 md:h-10 md:w-10 mr-2 md:mr-3 rounded-full object-cover shadow-lg"
            />
            <h1 className="text-xl md:text-2xl elegant-title text-white">
              Prompthis
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto px-4">
            Better AI prompts. Better AI answers.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Panel - Templates and Custom Input */}
          <div className="space-y-6">
            {/* Template Selection */}
            <div className="metallic-card p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <Wand2 className="w-6 h-6 mr-2 text-gray-600" />
                Prompt Templates
              </h2>
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {promptTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`metallic-template p-3 md:p-4 cursor-pointer ${
                      selectedTemplate?.id === template.id ? 'selected' : ''
                    }`}
                  >
                    <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">{template.name}</h3>
                    <p className="text-gray-600 text-xs md:text-sm mb-2">{template.description}</p>
                    <span className="inline-block px-1.5 py-0.5 md:px-2 md:py-1 bg-gray-100 rounded text-xs text-gray-700">
                      {template.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Parameter Inputs */}
            {selectedTemplate && (
              <div className="metallic-card p-6 animate-slide-up">
                              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-gray-600" />
                Customize Your Prompt
              </h3>
                <div className="space-y-4">
                  {extractParameters(selectedTemplate.template).map((param) => (
                    <div key={param}>
                      <label className="block text-gray-700 text-sm mb-2">{param}</label>
                      <input
                        type="text"
                        value={promptParams[param] || ''}
                        onChange={(e) => handleParamChange(param, e.target.value)}
                        placeholder={`Enter ${param.toLowerCase()}`}
                        className="metallic-input w-full p-3 text-gray-800 placeholder-gray-500 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Prompt Input */}
            <div className="metallic-card p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <Lightbulb className="w-6 h-6 mr-2 text-yellow-600" />
                Custom Prompt
              </h2>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Or write your own custom prompt here..."
                className="metallic-input w-full h-32 p-4 text-gray-800 placeholder-gray-500 resize-none focus:outline-none"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={generatePrompt}
              disabled={(!selectedTemplate && !customPrompt) || isGenerating || (promptCount >= 1 && !user) || (!!user && !user.email?.includes('@plus.') && !user.email?.includes('@platinum.') && dailyPromptCount >= 4)}
              className="w-full py-4 px-6 metallic-button font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : promptCount >= 1 && !user ? (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Log In to Continue
                </>
              ) : user && !user.email?.includes('@plus.') && !user.email?.includes('@platinum.') && dailyPromptCount >= 4 ? (
                <>
                  <Crown className="w-5 h-5 mr-2" />
                  Upgrade to Plus
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Generate Prompt with AI
                </>
              )}
            </button>
            
            {/* Error Display */}
            {error && (
              <div className="metallic-card p-4 bg-red-50 border border-red-200">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Right Panel - Generated Prompt */}
          <div className="space-y-6">
            <div className="metallic-card p-6 h-full">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-gray-600" />
                Your Generated Prompt
              </h2>
              
              {generatedPrompt ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <pre className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
                      {generatedPrompt}
                    </pre>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={copyToClipboard}
                      className="flex-1 metallic-secondary-button flex items-center justify-center"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </button>
                    <button
                      onClick={downloadPrompt}
                      className="flex-1 metallic-secondary-button flex items-center justify-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  <div className="text-center">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select a template or write a custom prompt to get started</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 metallic-card p-8">
                        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Why Use Prompthis?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Wand2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Smart Templates</h3>
              <p className="text-gray-600">Pre-built templates designed for different use cases and industries</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Customizable</h3>
              <p className="text-gray-600">Easily customize prompts with dynamic parameters and your own text</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">User-Friendly</h3>
              <p className="text-gray-600">Intuitive interface that makes prompt creation simple and efficient</p>
            </div>
          </div>
          
          {/* Get Plus CTA */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-2">Ready to unlock unlimited prompts?</h3>
              <p className="text-gray-200 mb-6">Get Plus for just $3.99/month and access advanced features</p>
              <button
                onClick={() => setShowPricing(true)}
                className="bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Plus Now
              </button>
            </div>
          </div>
                  </div>
        </div>
      </div>
      </ErrorBoundary>
    );
  }

export default App; 