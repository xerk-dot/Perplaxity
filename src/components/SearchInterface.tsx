'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
}

export default function SearchInterface() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [aiResponse, setAiResponse] = useState('');
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setSearchResults([]);
    setAiResponse('');

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Perplaxity
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ask questions and, uh, ill get back to you
        </p>
      </div>

      <div className="flex space-x-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask a question..."
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={loading || !query.trim()}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {(aiResponse || searchResults.length > 0) && (
        <Tabs defaultValue="answer" className="w-full">
          <TabsList className={`grid w-full ${searchResults.length > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <TabsTrigger value="answer">Answer</TabsTrigger>
            {searchResults.length > 0 && (
              <TabsTrigger value="sources">Sources</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="answer" className="mt-4">
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
          </TabsContent>
          
          {searchResults.length > 0 && (
            <TabsContent value="sources" className="mt-4">
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
            </TabsContent>
          )}
        </Tabs>
      )}
    </div>
  );
}