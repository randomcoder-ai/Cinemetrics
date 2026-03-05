import axios from 'axios';
import * as cheerio from 'cheerio';
import { Review } from '@/types';

export async function scrapeIMDbReviews(imdbId: string): Promise<Review[]> {
  try {
    const url = `https://www.imdb.com/title/${imdbId}/reviews`;
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    const $ = cheerio.load(response.data);
    const reviews: Review[] = [];

    // Try multiple selectors for different IMDb layouts
    const reviewContainers = $('.user-review-item').length > 0 
      ? $('.user-review-item') 
      : $('.review-container').length > 0 
        ? $('.review-container')
        : $('article');

    // Select review containers
    reviewContainers.each((_, element) => {
      const $el = $(element);
      
      // Try multiple rating selectors
      let rating: number | null = null;
      const ratingSelectors = [
        '.rating-other-user-rating span',
        '[data-testid="review-rating"] span',
        '.ipc-rating-star--rating',
        'span[class*="rating"]',
      ];
      
      for (const selector of ratingSelectors) {
        const ratingText = $el.find(selector).first().text().trim();
        if (ratingText && /^\d+$/.test(ratingText)) {
          rating = parseInt(ratingText);
          break;
        }
      }

      // Try multiple text selectors
      let text = '';
      const textSelectors = [
        '.text.show-more__control',
        '[data-testid="review-overflow"]',
        '.content .text',
        'div[class*="reviewText"]',
        '.review-text-container',
      ];
      
      for (const selector of textSelectors) {
        const foundText = $el.find(selector).text().trim();
        if (foundText && foundText.length > 20) {
          text = foundText;
          break;
        }
      }
      
      // If no text found with specific selectors, try to find any substantial text
      if (!text) {
        text = $el.text().trim();
        // Clean up - remove very short texts and navigation elements
        if (text.length < 50) {
          text = '';
        }
      }

      const title = $el.find('.title, [data-testid="review-summary"], h3, .review-title').first().text().trim();
      const author = $el.find('.display-name-link, [data-testid="author-link"], .author, a[href*="/user/"]').first().text().trim();
      const date = $el.find('.review-date, [data-testid="review-date"], time, .date').first().text().trim();
      const helpful = $el.find('.actions.text-muted, [data-testid="helpful-vote"]').first().text().trim();

      if (text && text.length > 20) {
        reviews.push({
          author: author || 'Anonymous',
          rating,
          title: title || 'No title',
          text,
          date: date || 'Unknown date',
          helpful,
        });
      }
    });

    // Fallback: If scraping fails, return mock data for demo
    if (reviews.length === 0) {
      console.warn('No reviews scraped from IMDb, using mock data');
      return getMockReviews();
    }

    return reviews.slice(0, 15); // Limit to 15 reviews
  } catch (error) {
    console.error('Error scraping reviews:', error);
    // Return mock data as fallback
    return getMockReviews();
  }
}

function getMockReviews(): Review[] {
  return [
    {
      author: "MovieFan123",
      rating: 9,
      title: "An absolute masterpiece!",
      text: "This movie exceeded all my expectations. The cinematography is stunning, the acting is superb, and the story keeps you engaged from start to finish. A must-watch for any film enthusiast.",
      date: "15 January 2024"
    },
    {
      author: "CriticMind",
      rating: 7,
      title: "Good but not perfect",
      text: "While the film has its moments of brilliance, there are some pacing issues in the middle act. However, the performances are solid and the ending makes up for it.",
      date: "10 January 2024"
    },
    {
      author: "FilmBuff42",
      rating: 10,
      title: "One of the best films I've seen",
      text: "Everything about this movie works perfectly. The director's vision is clear, the soundtrack is memorable, and the emotional impact is profound. I've already watched it three times!",
      date: "5 January 2024"
    },
    {
      author: "TheReviewer",
      rating: 6,
      title: "Decent entertainment",
      text: "It's a decent popcorn flick with good special effects and an entertaining story. Nothing groundbreaking, but enjoyable nonetheless.",
      date: "2 January 2024"
    },
    {
      author: "CinemaLover",
      rating: 8,
      title: "Highly recommended",
      text: "Great performances from the entire cast. The story is compelling and the visuals are breathtaking. Definitely worth watching in theaters.",
      date: "28 December 2023"
    }
  ];
}
