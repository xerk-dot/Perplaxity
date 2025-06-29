'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Search, X, Lightbulb, Settings, Paperclip, Mic, AudioWaveform } from 'lucide-react';

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
  const hasResults = aiResponse || searchResults.length > 0;

  const handleSearch = async () => {
    if (!query.trim()) return;

    // Capture the initial question if this is the first search
    if (!initialQuestion) {
      setInitialQuestion(query);
    }

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
        body: JSON.stringify({ query }),
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
        body: JSON.stringify({ query, searchResults: searchData.results }),
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
    setQuery(question);
    
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
                placeholder="ask anything and ill try my hardest"
                className="w-full h-32 py-4 px-6 text-lg bg-transparent border-none focus:ring-0 focus:outline-none resize-none mb-4"
              />
              
              {/* Icon menus below text area */}
              <div className="flex justify-between items-center">
                {/* Left toggle menu */}
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Search size={20} className="text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <X size={20} className="text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Lightbulb size={20} className="text-gray-500" />
                  </button>
                </div>
                
                {/* Right toggle menu */}
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings size={18} className="text-gray-500" />
                    <span className="sr-only">Choose model</span>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Search size={18} className="text-gray-500" />
                    <span className="sr-only">Set sources</span>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Paperclip size={18} className="text-gray-500" />
                    <span className="sr-only">Attach</span>
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Mic size={18} className="text-gray-500" />
                    <span className="sr-only">Dictation</span>
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-600 p-2.5 rounded-xl transition-colors shadow-sm">
                    <AudioWaveform size={18} className="text-white animate-pulse" />
                    <span className="sr-only">Voice mode</span>
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
                <div className="space-y-3">
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
      
      {/* Fixed chat box at bottom */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 p-4">
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
              {/* Left toggle menu */}
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Search size={20} className="text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={20} className="text-gray-500" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Lightbulb size={20} className="text-gray-500" />
                </button>
              </div>
              
              {/* Right toggle menu */}
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings size={18} className="text-gray-500" />
                  <span className="sr-only">Choose model</span>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Search size={18} className="text-gray-500" />
                  <span className="sr-only">Set sources</span>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Paperclip size={18} className="text-gray-500" />
                  <span className="sr-only">Attach</span>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Mic size={18} className="text-gray-500" />
                  <span className="sr-only">Dictation</span>
                </button>
                <button className="bg-blue-500 hover:bg-blue-600 p-2.5 rounded-xl transition-colors shadow-sm">
                  <AudioWaveform size={18} className="text-white animate-pulse" />
                  <span className="sr-only">Voice mode</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}