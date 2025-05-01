const fs = require('fs');
const https = require('https');
const path = require('path');
const cars = require('../src/data/cars.json');

const downloadImage = (url, filepath) => {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(fs.createWriteStream(filepath))
                .on('error', reject)
                .once('close', () => resolve(filepath));
      } else {
        response.resume();
        reject(new Error(`Request Failed With a Status Code: ${response.statusCode}`));
      }
    });
  });
};

const downloadAllImages = async () => {
  const imagesDir = path.join(process.cwd(), 'public', 'images', 'cars');
  
  // Ensure directory exists
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  for (const car of cars) {
    const imageUrl = car.Image;
    const filename = `${car.Name}-${car.Model}.jpg`.toLowerCase().replace(/\s+/g, '-');
    const filepath = path.join(imagesDir, filename);

    try {
      console.log(`Downloading image for ${car.Name} ${car.Model}...`);
      await downloadImage(imageUrl, filepath);
      console.log(`Successfully downloaded ${filename}`);
    } catch (error) {
      console.error(`Error downloading image for ${car.Name} ${car.Model}:`, error.message);
    }
  }
};

downloadAllImages(); 