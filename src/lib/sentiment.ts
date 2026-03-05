import { Review, SentimentAnalysis } from '@/types';

/**
 * Analyzes sentiment using algorithmic approach (no AI API required)
 * 
 * This function provides intelligent sentiment analysis without needing
 * expensive AI API keys. It works by:
 * 1. Analyzing review ratings (1-10 scale)
 * 2. Counting positive/negative keywords
 * 3. Generating insights based on patterns
 * 
 * For REAL AI analysis using Claude/OpenAI, see analyzeSentimentWithAI() below
 */
export async function analyzeSentiment(reviews: Review[]): Promise<SentimentAnalysis> {
  // Smart algorithmic analysis - NO AI API KEY NEEDED
  // This provides good results for the free version
  
  const ratings = reviews.filter(r => r.rating !== null).map(r => r.rating as number);
  const avgRating = ratings.length > 0 
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
    : 5;

  // Count positive/negative keywords
  let positiveCount = 0;
  let negativeCount = 0;

  const positiveWords = ['amazing', 'excellent', 'great', 'wonderful', 'fantastic', 'brilliant', 'masterpiece', 'perfect', 'love', 'best', 'outstanding', 'superb', 'incredible'];
  const negativeWords = ['bad', 'terrible', 'awful', 'poor', 'worst', 'disappointing', 'boring', 'waste', 'horrible', 'mediocre', 'weak'];

  reviews.forEach(review => {
    const text = review.text.toLowerCase();
    positiveWords.forEach(word => {
      if (text.includes(word)) positiveCount++;
    });
    negativeWords.forEach(word => {
      if (text.includes(word)) negativeCount++;
    });
  });

  // Determine classification
  let classification: 'positive' | 'mixed' | 'negative';
  if (avgRating >= 7.5) {
    classification = 'positive';
  } else if (avgRating >= 5) {
    classification = 'mixed';
  } else {
    classification = 'negative';
  }

  // Adjust based on sentiment words
  const sentimentRatio = positiveCount / (negativeCount + 1);
  if (sentimentRatio > 2 && classification !== 'positive') {
    classification = 'mixed';
  } else if (sentimentRatio < 0.5 && classification !== 'negative') {
    classification = 'mixed';
  }

  // Generate insights
  const insights = generateInsights(reviews, avgRating, classification);

  // Generate summary
  const summary = generateSummary(reviews, avgRating, classification);

  // Calculate confidence based on:
  // 1. Number of reviews (more = higher confidence)
  // 2. Rating consistency (low variance = higher confidence)
  // 3. How strongly ratings match the classification
  const confidence = calculateConfidence(ratings, avgRating, classification);

  return {
    summary,
    classification,
    insights,
    confidence
  };
}

function calculateConfidence(ratings: number[], avgRating: number, classification: string): number {
  if (ratings.length === 0) return 50;

  // Factor 1: Sample size (more reviews = more confident)
  const sampleSizeFactor = Math.min(25, ratings.length * 1.67); // Max 25 points
  
  // Factor 2: Rating consistency (calculate standard deviation)
  const variance = ratings.reduce((sum, rating) => sum + Math.pow(rating - avgRating, 2), 0) / ratings.length;
  const stdDev = Math.sqrt(variance);
  const consistencyFactor = Math.max(0, 25 - stdDev * 4); // Max 25 points, penalize high variance
  
  // Factor 3: How well the rating matches the classification
  let alignmentFactor = 0;
  if (classification === 'positive' && avgRating >= 7.5) {
    alignmentFactor = 20 + (avgRating - 7.5) * 4; // 20-30 points
  } else if (classification === 'negative' && avgRating < 5) {
    alignmentFactor = 20 + (5 - avgRating) * 4; // 20-30 points  
  } else if (classification === 'mixed' && avgRating >= 5 && avgRating < 7.5) {
    // Mixed sentiment should have LOWER confidence by design
    alignmentFactor = 10 + (2.5 - Math.abs(avgRating - 6.25)) * 2; // 10-15 points only
  } else {
    alignmentFactor = 5; // Very weak alignment
  }
  
  // Factor 4: Sentiment distribution clarity
  const highRatings = ratings.filter(r => r >= 8).length;
  const midRatings = ratings.filter(r => r >= 5 && r < 8).length;
  const lowRatings = ratings.filter(r => r < 5).length;
  
  // Calculate how polarized the distribution is
  let distributionFactor = 0;
  if (classification === 'positive') {
    distributionFactor = (highRatings / ratings.length) * 15; // More highs = higher confidence
  } else if (classification === 'negative') {
    distributionFactor = (lowRatings / ratings.length) * 15; // More lows = higher confidence
  } else if (classification === 'mixed') {
    // For mixed, we want lower confidence if truly mixed
    const mixedness = midRatings / ratings.length;
    distributionFactor = Math.max(0, 10 - (mixedness * 15)); // Mixed ratings reduce confidence
  }
  
  const totalConfidence = sampleSizeFactor + consistencyFactor + alignmentFactor + distributionFactor;
  
  // Cap between 50% and 95%
  return Math.round(Math.min(95, Math.max(50, totalConfidence)));
}

function generateSummary(reviews: Review[], avgRating: number, classification: string): string {
  const reviewCount = reviews.length;
  
  if (classification === 'positive') {
    return `Based on ${reviewCount} reviews, audiences are highly praising this film. With an average rating of ${avgRating.toFixed(1)}/10, viewers consistently highlight the exceptional performances, compelling storyline, and impressive production quality. The overwhelming majority recommend this as a must-watch experience.`;
  } else if (classification === 'mixed') {
    return `Analysis of ${reviewCount} reviews reveals mixed reactions. With an average rating of ${avgRating.toFixed(1)}/10, audiences appreciate certain aspects while finding others less satisfying. Common praise includes strong performances and visual appeal, though some cite pacing issues or narrative shortcomings. Worth watching for fans of the genre.`;
  } else {
    return `${reviewCount} reviews indicate predominantly negative reception. Averaging ${avgRating.toFixed(1)}/10, viewers express disappointment with various elements. While some find redeeming qualities in specific performances or technical aspects, the consensus points to unfulfilled expectations and significant flaws in execution.`;
  }
}

function generateInsights(reviews: Review[], avgRating: number, classification: string): string[] {
  const insights: string[] = [];

  // Insight 1: Rating-based
  if (avgRating >= 8) {
    insights.push(`Exceptional rating of ${avgRating.toFixed(1)}/10 - Places this in the top tier of audience favorites`);
  } else if (avgRating >= 6.5) {
    insights.push(`Solid ${avgRating.toFixed(1)}/10 rating - Generally well-received by audiences`);
  } else if (avgRating >= 5) {
    insights.push(`Moderate ${avgRating.toFixed(1)}/10 rating - Opinions vary significantly among viewers`);
  } else {
    insights.push(`Below-average ${avgRating.toFixed(1)}/10 rating - Struggles to meet audience expectations`);
  }

  // Insight 2: Common themes
  const allText = reviews.map(r => r.text.toLowerCase()).join(' ');
  
  if (allText.includes('acting') || allText.includes('performance') || allText.includes('cast')) {
    if (classification === 'positive') {
      insights.push('Standout performances - Cast receives widespread acclaim for their portrayal');
    } else {
      insights.push('Mixed reactions to performances - Acting quality varies across the cast');
    }
  }

  if (allText.includes('story') || allText.includes('plot') || allText.includes('narrative')) {
    if (classification === 'positive') {
      insights.push('Compelling narrative - Story captivates and maintains viewer engagement');
    } else {
      insights.push('Narrative concerns - Some viewers find the plot predictable or confusing');
    }
  }

  if (allText.includes('visual') || allText.includes('cinematography') || allText.includes('effects')) {
    insights.push('Strong visual presentation - Technical execution and aesthetics impress audiences');
  }

  // Insight 3: Recommendation rate
  const highRatings = reviews.filter(r => r.rating && r.rating >= 7).length;
  const recommendRate = (highRatings / reviews.length * 100).toFixed(0);
  insights.push(`${recommendRate}% of reviewers would recommend - Strong indicator of audience satisfaction`);

  // Ensure we have at least 4 insights
  if (insights.length < 4) {
    insights.push('Diverse audience reactions - Appeals to different viewer preferences and expectations');
  }

  return insights.slice(0, 5);
}

// Mock function for when you want to use actual AI
export async function analyzeSentimentWithAI(reviews: Review[]): Promise<SentimentAnalysis> {
  // This would integrate with Claude AI or OpenAI
  // Example implementation:
  /*
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const prompt = `Analyze these movie reviews and provide:
1. A comprehensive summary (2-3 sentences)
2. Overall sentiment classification (positive/mixed/negative)
3. 4-5 key insights about the movie

Reviews:
${reviews.map(r => `Rating: ${r.rating}/10\n${r.text}`).join('\n\n')}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await response.json();
  // Parse and return the AI response
  */
  
  return analyzeSentiment(reviews);
}

/**
 * Google Gemini AI Sentiment Analysis (FREE API)
 * 
 * Uses Google's Gemini 1.5 Flash model for intelligent sentiment analysis
 * - Fast and accurate
 * - 1500 requests per day FREE
 * - Easy to use
 * 
 * Get your FREE API key at: https://aistudio.google.com/app/apikey
 */
export async function analyzeSentimentWithGemini(reviews: Review[]): Promise<SentimentAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  // Fallback to algorithmic if no key
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.log('⚠️  No valid Gemini API key, using algorithmic analysis');
    return analyzeSentiment(reviews);
  }

  try {
    // Calculate average rating
    const ratings = reviews.filter(r => r.rating !== null).map(r => r.rating as number);
    const avgRating = ratings.length > 0 
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length 
      : 5;

    // Prepare review texts for AI
    const reviewTexts = reviews.slice(0, 10).map((r, i) => 
      `Review ${i + 1} (Rating: ${r.rating}/10):\n${r.text}`
    ).join('\n\n');

    // Create prompt for Gemini
    const prompt = `Analyze these movie reviews and provide a sentiment analysis.

Reviews:
${reviewTexts}

Average Rating: ${avgRating.toFixed(1)}/10

Response format (JSON only, no extra text):
{
  "summary": "2-3 sentence summary of overall sentiment",
  "classification": "positive" | "mixed" | "negative",
  "insights": ["insight 1", "insight 2", "insight 3", "insight 4"],
  "confidence": 85
}

Classification rules:
- "positive": rating >= 7.5 and mostly favorable
- "negative": rating < 5 or mostly critical
- "mixed": otherwise

Confidence (60-95): Based on review consistency and sample size.
Insights: 4 brief points (1 line each) about what audiences noted.

Return ONLY the JSON object, nothing else.`;


    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
            topP: 0.95,
            topK: 40,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    const finishReason = data.candidates?.[0]?.finishReason;

    if (!aiResponse) {
      console.error('No response text from Gemini');
      console.error('Full API response:', JSON.stringify(data, null, 2));
      throw new Error('No response from Gemini');
    }

    // Check if response was truncated
    if (finishReason && finishReason !== 'STOP') {
      console.warn('⚠️  Gemini response was truncated. Reason:', finishReason);
      console.log('Using algorithmic fallback due to incomplete response');
      return analyzeSentiment(reviews);
    }

    console.log('Raw AI response:', aiResponse); // Log full response for debugging
    console.log('Response length:', aiResponse.length, 'characters');

    // Parse JSON from AI response (handle both plain JSON and markdown code blocks)
    let jsonText = aiResponse.trim();
    
    // Remove markdown code blocks if present
    // Try to extract content between ```json and ``` or just ``` markers
    if (jsonText.includes('```')) {
      // Try with closing marker first
      let match = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (match) {
        jsonText = match[1].trim();
        console.log('Extracted from closed markdown block');
      } else {
        // Try without closing marker (incomplete response)
        match = jsonText.match(/```(?:json)?\s*([\s\S]*)/);
        if (match) {
          jsonText = match[1].trim();
          console.log('Extracted from unclosed markdown block (possible truncation)');
        }
      }
    }
    
    // Try to find complete JSON object - find first { and last }
    const firstBrace = jsonText.indexOf('{');
    const lastBrace = jsonText.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const jsonString = jsonText.substring(firstBrace, lastBrace + 1);
      console.log('Attempting to parse JSON of length:', jsonString.length);
      
      try {
        const aiResult = JSON.parse(jsonString);
        console.log('✓ Successfully parsed JSON with keys:', Object.keys(aiResult));
        
        // Validate the structure
        if (!aiResult.summary || !aiResult.classification) {
          console.error('❌ Invalid AI result - missing required fields');
          console.error('Keys found:', Object.keys(aiResult));
          throw new Error('Invalid AI response structure');
        }
        
        // Ensure insights array exists and has at least some entries
        if (!Array.isArray(aiResult.insights) || aiResult.insights.length === 0) {
          console.warn('⚠️  No insights in AI response, generating fallback insights');
          aiResult.insights = generateInsights(reviews, avgRating, aiResult.classification);
        } else if (aiResult.insights.length < 4) {
          console.warn(`⚠️  Only ${aiResult.insights.length} insights, expected 4. Filling with generated insights.`);
          const additionalInsights = generateInsights(reviews, avgRating, aiResult.classification);
          aiResult.insights = [...aiResult.insights, ...additionalInsights].slice(0, 4);
        }
        
        // Use AI confidence if reasonable, otherwise calculate our own
        let confidence = aiResult.confidence;
        if (!confidence || confidence < 50 || confidence > 100) {
          console.warn('⚠️  Invalid confidence value, calculating from data');
          confidence = calculateConfidence(ratings, avgRating, aiResult.classification);
        }
        
        console.log('✅ Sentiment analysis complete');
        return {
          summary: aiResult.summary,
          classification: aiResult.classification as 'positive' | 'mixed' | 'negative',
          insights: aiResult.insights,
          confidence
        };
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Attempted to parse:', jsonString.substring(0, 200));
        throw new Error('Failed to parse JSON from AI response');
      }
    }

    // Fallback if JSON parsing fails
    console.error('Could not find JSON in AI response');
    console.error('Full response text:', aiResponse);
    throw new Error('Could not parse AI response');

  } catch (error) {
    console.error('Gemini API error:', error);
    // Fallback to algorithmic analysis
    return analyzeSentiment(reviews);
  }
}
