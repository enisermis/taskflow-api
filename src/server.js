const app = require('./app');

// Port'u disaridan da verebilelim diye env'e baktim, yoksa 3000'de aciliyor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`TaskFlow API calisiyor: http://localhost:${PORT}`);
});
