
import fs from 'fs';
import path from 'path';

const fetchHtml = async () => {
  try {
    const url = 'https://yonseicoop.co.kr/m/?act=info.page&seq=29';
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const outputPath = path.join(__dirname, 'debug-html.html');
    fs.writeFileSync(outputPath, html);
    console.log(`HTML saved to ${outputPath}`);
  } catch (error) {
    console.error('Error fetching HTML:', error);
  }
};

fetchHtml();
