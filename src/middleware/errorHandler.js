function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Boyle bir adres yok: ${req.method} ${req.originalUrl}`,
  });
}

// Express 4 parametreli fonksiyonu hata yakalayici olarak goruyor, next kullanilmasa da kalmali
function errorHandler(err, req, res, next) {
  // Bozuk JSON gonderilince express.json buraya 400 ile dusuyor
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Gecersiz JSON gonderildi' });
  }

  if (err.status && err.status < 500) {
    return res.status(err.status).json({ success: false, message: err.message });
  }

  console.error(err);
  res.status(500).json({ success: false, message: 'Sunucuda bir hata olustu' });
}

module.exports = { notFound, errorHandler };
