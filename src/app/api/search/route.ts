import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const serpApiKey = process.env.SERPAPI_KEY;
    if (!serpApiKey) {
      return NextResponse.json({ error: 'SERPAPI_KEY not configured' }, { status: 500 });
    }

    const response = await axios.get('https://serpapi.com/search', {
      params: {
        q: query,
        api_key: serpApiKey,
        engine: 'google',
        num: 10,
      },
    });

    interface SerpResult {
      title: string;
      link: string;
      snippet: string;
      displayed_link: string;
    }

    const results: SerpResult[] = response.data.organic_results || [];
    
    return NextResponse.json({
      results: results.map((result: SerpResult) => ({
        title: result.title,
        link: result.link,
        snippet: result.snippet,
        displayLink: result.displayed_link,
      })),
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}