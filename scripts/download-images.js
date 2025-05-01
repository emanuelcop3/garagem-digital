const fs = require('fs');
const https = require('https');
const path = require('path');

const images = [
  {
    name: 'byd-dolphin.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/BYD_Dolphin_002.jpg/1280px-BYD_Dolphin_002.jpg'
  },
  {
    name: 'toyota-corolla.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/2019_Toyota_Corolla_Design_VVT-i_1.2_Front.jpg/1280px-2019_Toyota_Corolla_Design_VVT-i_1.2_Front.jpg'
  },
  {
    name: 'vw-tcross.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/VW_T-Cross_1.0_TSI_Style%2C_Front_%28cropped%29.jpg/1280px-VW_T-Cross_1.0_TSI_Style%2C_Front_%28cropped%29.jpg'
  },
  {
    name: 'honda-civic.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/2022_Honda_Civic_LX%2C_front_12.21.21.jpg/1280px-2022_Honda_Civic_LX%2C_front_12.21.21.jpg'
  },
  {
    name: 'chevrolet-onix.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Chevrolet_Onix_Plus_Premier_2020.jpg/1280px-Chevrolet_Onix_Plus_Premier_2020.jpg'
  },
  {
    name: 'hyundai-hb20.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Hyundai_HB20_1.6_Premium_2013_%2814644316231%29.jpg/1280px-Hyundai_HB20_1.6_Premium_2013_%2814644316231%29.jpg'
  },
  {
    name: 'renault-kwid.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/2016_Renault_Kwid_Front.jpg/1280px-2016_Renault_Kwid_Front.jpg'
  },
  {
    name: 'fiat-pulse.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Fiat_Pulse_Audace_1.0_Turbo_200_Flex_2022_%281%29.jpg/1280px-Fiat_Pulse_Audace_1.0_Turbo_200_Flex_2022_%281%29.jpg'
  },
  {
    name: 'jeep-renegade.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/FCA_850_-_Jeep_Renegade.jpg/1280px-FCA_850_-_Jeep_Renegade.jpg'
  },
  {
    name: 'peugeot-208.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Peugeot_208_IMG_3526.jpg/1280px-Peugeot_208_IMG_3526.jpg'
  }
];

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
  const imagesDir = path.join(__dirname, '../public/images');
  
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  for (const image of images) {
    try {
      const filepath = path.join(imagesDir, image.name);
      await downloadImage(image.url, filepath);
      console.log(`Downloaded ${image.name}`);
    } catch (error) {
      console.error(`Error downloading ${image.name}:`, error);
    }
  }
};

downloadAllImages(); 