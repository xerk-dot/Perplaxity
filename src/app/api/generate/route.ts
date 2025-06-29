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

    // Generate related questions
    const relatedQuestionsPrompt = `Based on the user's original question "${query}", generate 5 related questions that someone might want to ask next. 

Requirements:
- Questions should be related but not identical to the original question
- Format each question WITHOUT a question mark at the end
- Questions should be concise and clear
- Return only the questions, one per line
- Do not include numbers, bullets, or any other formatting

Original question: ${query}`;

    const relatedCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You generate related questions based on a user's query. Always format questions without question marks at the end."
        },
        {
          role: "user",
          content: relatedQuestionsPrompt
        }
      ],
      max_tokens: 200,
      temperature: 0.8,
    });

    const relatedQuestionsText = relatedCompletion.choices[0]?.message?.content || '';
    const relatedQuestions = relatedQuestionsText
      .split('\n')
      .map(q => q.trim())
      .filter(q => q.length > 0)
      .slice(0, 5); // Ensure we only get 5 questions

    return NextResponse.json({
      response,
      sources: searchResults,
      relatedQuestions,
    });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}