'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Search, Lightbulb, Settings, Paperclip, Mic, AudioWaveform, FlaskConical } from 'lucide-react';

interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  displayLink: string;
}

interface SearchResponse {
  results: SearchResult[];
}

interface GenerateResponse {
  response: string;
  sources: SearchResult[];
  relatedQuestions?: string[];
}

export default function SearchInterface() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [aiResponse, setAiResponse] = useState('');
  const [relatedQuestions, setRelatedQuestions] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState<'answer' | 'sources'>('answer');
  const [initialQuestion, setInitialQuestion] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'research' | 'labs'>('search');
  const [isAnswerPage, setIsAnswerPage] = useState(false);
  const hasResults = aiResponse || searchResults.length > 0 || isAnswerPage;

  const handleSearch = async () => {
    if (!query.trim()) return;

    // Capture the current query before clearing
    const searchQuery = query;
    
    // For follow-up questions, update the initial question to the new question
    setInitialQuestion(searchQuery);

    // Set answer page state to maintain layout during loading
    setIsAnswerPage(true);
    
    setLoading(true);
    setError('');
    setSearchResults([]);
    setAiResponse('');
    setRelatedQuestions([]);
    
    // Clear the query after capturing it
    setQuery('');

    try {
      // Get search results
      const searchResponse = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!searchResponse.ok) {
        throw new Error('Search failed');
      }

      const searchData: SearchResponse = await searchResponse.json();
      setSearchResults(searchData.results);

      // Generate AI response
      const generateResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery, searchResults: searchData.results }),
      });

      if (!generateResponse.ok) {
        throw new Error('Failed to generate response');
      }

      const generateData: GenerateResponse = await generateResponse.json();
      setAiResponse(generateData.response);
      if (generateData.relatedQuestions) {
        setRelatedQuestions(generateData.relatedQuestions);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent new line
      if (!loading && query.trim()) {
        handleSearch();
      }
    }
  };

  const handleRelatedQuestionClick = async (question: string) => {
    // Update the initial question to the new question
    setInitialQuestion(question);
    
    // Clear the follow-up chatbox
    setQuery('');
    
    // Ensure we stay on answer page during loading
    setIsAnswerPage(true);
    
    // Trigger search with the new question
    setLoading(true);
    setError('');
    setSearchResults([]);
    setAiResponse('');
    setRelatedQuestions([]);

    try {
      // Get search results
      const searchResponse = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: question }),
      });

      if (!searchResponse.ok) {
        throw new Error('Search failed');
      }

      const searchData: SearchResponse = await searchResponse.json();
      setSearchResults(searchData.results);

      // Generate AI response
      const generateResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: question, searchResults: searchData.results }),
      });

      if (!generateResponse.ok) {
        throw new Error('Failed to generate response');
      }

      const generateData: GenerateResponse = await generateResponse.json();
      setAiResponse(generateData.response);
      if (generateData.relatedQuestions) {
        setRelatedQuestions(generateData.relatedQuestions);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!hasResults) {
    // Initial centered layout
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              perplaxity 🫠
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              ask questions and, uh, ill get back to you
            </p>
          </div>

          <div className="w-[36rem] max-w-[90vw] mx-auto">
            {/* Single boundary around text area and icon menus */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-lg">
              {/* Text area without border */}
              <Textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="ask anything you want"
                className="w-full h-32 py-4 px-6 text-lg bg-transparent border-none focus:ring-0 focus:outline-none resize-none mb-4"
              />
              
              {/* Icon menus below text area */}
              <div className="flex justify-between items-center">
                {/* Left tab menu */}
                <div className="bg-gray-200 dark:bg-gray-600 rounded-lg p-1 flex relative">
                  
                  <button 
                    className={`relative z-10 p-2 rounded-md transition-colors group ${
                      activeTab === 'search' ? 'text-blue-500' : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveTab('search')}
                    title="Search"
                  >
                    <Search size={18} />
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      Search
                    </div>
                  </button>
                  
                  <button 
                    className={`relative z-10 p-2 rounded-md transition-colors group ${
                      activeTab === 'research' ? 'text-blue-500' : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveTab('research')}
                    title="Research"
                  >
                    <Lightbulb size={18} />
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      Research
                    </div>
                  </button>
                  
                  <button 
                    className={`relative z-10 p-2 rounded-md transition-colors group ${
                      activeTab === 'labs' ? 'text-blue-500' : 'text-gray-600 hover:text-gray-800'
                    }`}
                    onClick={() => setActiveTab('labs')}
                    title="Labs"
                  >
                    <FlaskConical size={18} />
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      Labs
                    </div>
                  </button>
                </div>
                
                {/* Right toggle menu */}
                <div className="flex items-center space-x-2">
                  <button 
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group relative"
                    onClick={() => console.log('Choose model clicked')}
                    title="Choose model"
                  >
                    <Settings size={18} className="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      Choose model
                    </div>
                  </button>
                  <button 
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group relative"
                    onClick={() => console.log('Set sources clicked')}
                    title="Set sources"
                  >
                    <Search size={18} className="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      Set sources
                    </div>
                  </button>
                  <button 
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group relative"
                    onClick={() => console.log('Attach clicked')}
                    title="Attach"
                  >
                    <Paperclip size={18} className="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      Attach
                    </div>
                  </button>
                  <button 
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group relative"
                    onClick={() => console.log('Dictation clicked')}
                    title="Dictation"
                  >
                    <Mic size={18} className="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      Dictation
                    </div>
                  </button>
                  <button 
                    className="bg-blue-500 hover:bg-blue-600 p-2.5 rounded-xl transition-colors shadow-sm group relative"
                    onClick={() => console.log('Voice mode clicked')}
                    title="Voice mode"
                  >
                    <AudioWaveform size={18} className="text-white animate-pulse" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      Voice mode
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600">{error}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Answer page layout
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content area */}
      <div className="flex-1 max-w-4xl mx-auto p-6 pb-32">
        {/* Initial question - top of page */}
        {initialQuestion && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {initialQuestion}
            </h2>
          </div>
        )}

        {/* Toggle group for Answer/Sources */}
        <div className="space-y-4">
          <ToggleGroup
            type="single"
            value={activeView}
            onValueChange={(value) => {
              if (value) setActiveView(value as 'answer' | 'sources');
            }}
            className="justify-start"
          >
            <ToggleGroupItem value="answer" aria-label="Show answer">
              Answer
            </ToggleGroupItem>
            {searchResults.length > 0 && (
              <ToggleGroupItem value="sources" aria-label="Show sources">
                Sources
              </ToggleGroupItem>
            )}
          </ToggleGroup>
          
          {/* Answer content - underneath the toggle */}
          {activeView === 'answer' && (
            <div className="space-y-6">
              {aiResponse ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="prose max-w-none">
                      {aiResponse.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-2">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : loading ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-gray-500">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                        <span>Generating answer...</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-gray-500">
                      <p>Answer will appear here once generated</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {relatedQuestions.length > 0 && (
                <div className="space-y-3 pb-24">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Related</h3>
                  <div className="space-y-2">
                    {relatedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleRelatedQuestionClick(question)}
                        className="w-full text-left p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="text-gray-900 dark:text-white">
                          {question}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {activeView === 'sources' && searchResults.length > 0 && (
            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        [{index + 1}] {result.title}
                      </a>
                    </CardTitle>
                    <CardDescription>{result.displayLink}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300">{result.snippet}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50 mt-4">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Grainy white gradient background extending full width */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-96 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 100vw 400px at center bottom, 
              rgba(255, 255, 255, 0.9) 0%, 
              rgba(255, 255, 255, 0.85) 20%, 
              rgba(255, 255, 255, 0.8) 40%, 
              rgba(255, 255, 255, 0.7) 60%, 
              transparent 100%
            ),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='17' cy='17' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='37' cy='17' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='57' cy='17' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='17' cy='37' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='37' cy='37' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='57' cy='37' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='17' cy='57' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='37' cy='57' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3Ccircle cx='57' cy='57' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      {/* Fixed chat box at bottom */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 p-4 z-10">
        <div className="w-[36rem] max-w-[90vw]">
          {/* Single boundary around text area and icon menus */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 shadow-lg">
            {/* Text area without border */}
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="ask a follow-up"
              className="w-full h-32 py-4 px-6 text-lg bg-transparent border-none focus:ring-0 focus:outline-none resize-none mb-4"
            />
            
            {/* Icon menus below text area */}
            <div className="flex justify-between items-center">
              {/* Left tab menu */}
              <div className="bg-gray-200 dark:bg-gray-600 rounded-lg p-1 flex relative">
                
                <button 
                  className={`relative z-10 p-2 rounded-md transition-colors group ${
                    activeTab === 'search' ? 'text-blue-500' : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setActiveTab('search')}
                  title="Search"
                >
                  <Search size={18} />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Search
                  </div>
                </button>
                
                <button 
                  className={`relative z-10 p-2 rounded-md transition-colors group ${
                    activeTab === 'research' ? 'text-blue-500' : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setActiveTab('research')}
                  title="Research"
                >
                  <Lightbulb size={18} />
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Research
                  </div>
                </button>
                
                <button 
                  className={`relative z-10 p-2 rounded-md transition-colors group ${
                    activeTab === 'labs' ? 'text-blue-500' : 'text-gray-600 hover:text-gray-800'
                  }`}
                  onClick={() => setActiveTab('labs')}
                  title="Labs"
                >
                  <FlaskConical size={18} />
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Labs
                  </div>
                </button>
              </div>
              
              {/* Right toggle menu */}
              <div className="flex items-center space-x-2">
                <button 
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group relative"
                  onClick={() => console.log('Choose model clicked')}
                  title="Choose model"
                >
                  <Settings size={18} className="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Choose model
                  </div>
                </button>
                <button 
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group relative"
                  onClick={() => console.log('Set sources clicked')}
                  title="Set sources"
                >
                  <Search size={18} className="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Set sources
                  </div>
                </button>
                <button 
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group relative"
                  onClick={() => console.log('Attach clicked')}
                  title="Attach"
                >
                  <Paperclip size={18} className="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Attach
                  </div>
                </button>
                <button 
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group relative"
                  onClick={() => console.log('Dictation clicked')}
                  title="Dictation"
                >
                  <Mic size={18} className="text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Dictation
                  </div>
                </button>
                <button 
                  className="bg-blue-500 hover:bg-blue-600 p-2.5 rounded-xl transition-colors shadow-sm group relative"
                  onClick={() => console.log('Voice mode clicked')}
                  title="Voice mode"
                >
                  <AudioWaveform size={18} className="text-white animate-pulse" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    Voice mode
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}