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
        
        // Get the image
        const image = $(element).find('img').attr('src');
        
        // Only add the news if it contains 'Bancharampur' in title or description
        if (title.includes('Bancharampur') || description.includes('Bancharampur')) {
          allNews.push({ title, description, img: image, source: source.name });
        } else {
          allNews.push({ title, description, img: image, source: source.name });
        }
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
