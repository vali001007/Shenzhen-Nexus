const https = require('https');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'traveler-web', 'public', 'images', 'top-spots');
fs.mkdirSync(outDir, { recursive: true });

const images = {
  'pingan.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Ping_An_Finance_Center_-_2018-11-30.jpg/800px-Ping_An_Finance_Center_-_2018-11-30.jpg',
  'seaworld.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Sea_World_in_Shekou_Shenzhen2021.jpg/800px-Sea_World_in_Shekou_Shenzhen2021.jpg',
  'dafen.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Artists_at_work_in_Dafen_Oil_Painting_Village.jpg/800px-Artists_at_work_in_Dafen_Oil_Painting_Village.jpg',
  'byd.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/BYD_04.JPG/800px-BYD_04.JPG',
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const opts = new URL(url);
    opts.headers = { 'User-Agent': 'ShenzhenNexusApp/1.0 (https://github.com; contact@example.com)' };
    https.get(opts, { timeout: 20000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        try { fs.unlinkSync(dest); } catch(e) {}
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        try { fs.unlinkSync(dest); } catch(e) {}
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(fs.statSync(dest).size); });
    }).on('error', (e) => { try { fs.unlinkSync(dest); } catch(x) {} reject(e); });
  });
}

(async () => {
  for (const [name, url] of Object.entries(images)) {
    const dest = path.join(outDir, name);
    try {
      const size = await download(url, dest);
      console.log(`OK: ${name} (${size} bytes)`);
    } catch (e) {
      console.log(`FAIL: ${name} - ${e.message}`);
    }
  }
  console.log('Done.');
})();
