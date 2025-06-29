'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

      {aiResponse && (
        <Card>
          <CardHeader>
            <CardTitle>AI Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              {aiResponse.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-2">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {searchResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Sources</h2>
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
  );
}