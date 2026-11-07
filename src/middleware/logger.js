const fs = require('fs');
const path = require('path');

const LOG_FILE =
  process.env.LOG_FILE || path.join(__dirname, '..', '..', 'logs', 'requests.log');

// Hocam her istegi hem konsola hem dosyaya yaziyorum, sunucu kapaninca da kayit kalsin diye.
// Durum kodunu da gormek istedim, o yuzden cevap bitince (finish) yazdiriyorum.
function logger(req, res, next) {
  res.on('finish', () => {
    const line = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode}`;
    console.log(line);

    fs.mkdir(path.dirname(LOG_FILE), { recursive: true }, () => {
      fs.appendFile(LOG_FILE, `${line}\n`, (err) => {
        // Log yazilamadi diye API durmasin, sadece konsola uyari veriyorum
        if (err) console.error('Log dosyasina yazilamadi:', err.message);
      });
    });
  });

  next();
}

module.exports = logger;
