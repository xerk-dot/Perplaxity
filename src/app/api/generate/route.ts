import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { query, searchResults } = await request.json();
    
    if (!query || !searchResults) {
      return NextResponse.json({ error: 'Query and search results are required' }, { status: 400 });
    }

    interface SearchResult {
      title: string;
      link: string;
      snippet: string;
      displayLink: string;
    }

    const contextText = searchResults
      .map((result: SearchResult, index: number) => 
        `[${index + 1}] ${result.title}\n${result.snippet}\nSource: ${result.link}\n`
      )
      .join('\n');

    const prompt = `Based on the following search results, provide a comprehensive and accurate answer to the user's question. Include relevant citations using [1], [2], etc. format to reference the sources.

User Question: ${query}

Search Results:
${contextText}

Please provide a well-structured response with proper citations. Only use information from the provided search results.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that provides accurate information based on search results. Always cite your sources using [1], [2], etc. format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'No response generated';

    return NextResponse.json({
      response,
      sources: searchResults,
    });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}