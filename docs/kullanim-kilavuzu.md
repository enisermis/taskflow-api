# Kullanım Kılavuzu

Bu kılavuz API'yi Postman ile ya da kendi uygulamanızdan nasıl kullanacağınızı anlatır.

## 1. Sunucuyu açın

```bash
npm install
npm start
```

Tarayıcıda `http://localhost:3000` adresi `TaskFlow API ayakta` mesajını gösteriyorsa sunucu çalışıyordur.

## 2. Postman'i hazırlayın

1. Postman'de **Import** düğmesine basın.
2. `docs/TaskFlow.postman_collection.json` dosyasını seçin.
3. Soldaki **TaskFlow API** koleksiyonunu açın. Adres, koleksiyonun `baseUrl` değişkeninde hazırdır.

## 3. Örnek akış

1. **Görev ekle** isteğini gönderin. Cevaptaki `id` değerine bakın.
2. **Görev detayı** isteğinde adresin sonundaki sayıyı bu `id` ile değiştirin.
3. **Görev güncelle** ile durumu `completed` yapın.
4. **Genel özet** raporunda tamamlanan sayısının arttığını görün.
5. **Görev sil** ile görevi kaldırın.

## 4. Kendi uygulamanızdan kullanma

JavaScript ile örnek:

```js
const cevap = await fetch('http://localhost:3000/tasks?status=pending&limit=5');
const sonuc = await cevap.json();

console.log(sonuc.total);
console.log(sonuc.data);
```

Yeni görev eklerken `Content-Type: application/json` başlığı gönderilmelidir:

```js
await fetch('http://localhost:3000/tasks', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Rapor sayfasini duzelt',
    description: 'Toplamlar yanlis gorunuyor',
    priority: 'high',
    assignee: 'ayse',
  }),
});
```

## 5. Sık karşılaşılan hatalar

| Sorun | Sebep | Çözüm |
|---|---|---|
| `400 Gecersiz veri` | Zorunlu alan eksik ya da değer hatalı | Cevaptaki `errors` listesine bakın |
| `400 Gecersiz JSON gonderildi` | Body bozuk | Postman'de body türünü **raw / JSON** seçin, virgül ve tırnakları kontrol edin |
| `404` | Görev silinmiş ya da adres yanlış | `GET /tasks` ile mevcut id'lere bakın |
| `EADDRINUSE` | Port başka programda açık | `PORT=4000 npm start` ile başka port kullanın |

## 6. Kayıtlar

Her istek konsola ve `logs/requests.log` dosyasına yazılır:

```
[2026-11-07T10:00:00.000Z] POST /tasks 201
```
