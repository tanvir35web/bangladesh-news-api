const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

const urls = [
  {
    name: 'Prothom Alo',
    link: 'https://www.prothomalo.com',
    selector: '.news_item_content'
  }
];

app.get('/news', async (req, res) => {
  try {
    const allNews = [];

    for (const source of urls) {
      const { data } = await axios.get(source.link);
      const $ = cheerio.load(data);
      
      // Customize the selector for Prothom Alo website
      $(source.selector).each((index, element) => {
        // Get the title
        const title = $(element).find('h3.headline-title a span').text();
        
        // Get the description
        const description = $(element).find('a.excerpt').text();
        
        // Get the image - handle relative URLs
        let image = $(element).find('img').attr('src');
        if (image && !image.startsWith('http')) {
          image = `https://www.prothomalo.com${image}`;
        }
        
        // Get the link to the detailed news
        const newsLink = $(element).find('h1.headline-title a').attr('href');
        const fullLink = `https://www.prothomalo.com${newsLink}`; // Ensure the link is complete
        console.log(fullLink);

        // Only add the news if it contains 'Bancharampur' in title or description
        // if (title.includes('Bancharampur') || description.includes('Bancharampur')) {
          allNews.push({
            title,
            description,
            image,  // Now contains the full image URL
            link: fullLink,  // Add the full link to the news article
            source: source.name
          });
        // }
      });
    }

    res.json(allNews);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Error fetching news' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
