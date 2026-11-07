# TaskFlow API

Node.js ve Express ile yazdığım görev ve proje yönetim sistemi REST API'si. Node.js Backend Programlama eğitiminin bitirme projesidir.

Görev ekleme, listeleme, detay, güncelleme ve silme işlemlerinin yanında filtreleme, arama, sayfalama, sıralama, veri doğrulama ve raporlama da vardır.

## Gereksinimler

- Node.js 18 veya üstü
- npm
- API'yi denemek için Postman

## Kurulum

Projeyi indirin ve klasörüne girin:

```bash
git clone <repo-adresi>
cd <repo-klasoru>
```

Bağımlılıkları kurun:

```bash
npm install
```

Sunucuyu başlatın:

```bash
npm start
```

Sunucu `http://localhost:3000` adresinde açılır. Farklı port için:

```bash
PORT=4000 npm start
```

Otomatik testleri çalıştırmak için:

```bash
npm test
```

Testler geçici bir kopya üzerinde çalışır, `data/tasks.json` dosyasını değiştirmez.

## Klasör yapısı

```
src/
  server.js          sunucuyu başlatır
  app.js             Express ayarları ve route bağlantıları
  routes/            adres tanımları
  controllers/       isteği alıp cevabı dönen fonksiyonlar
  services/          veri okuma/yazma, filtreleme ve raporlama
  middleware/        logger, doğrulama ve hata yakalama
data/tasks.json      görevlerin tutulduğu dosya
data/lastId.json     son verilen id (ilk ekleme veya silmede oluşur)
logs/requests.log    istek kayıtları (sunucu çalışınca oluşur)
tests/               otomatik testler
docs/                dokümanlar ve Postman koleksiyonu
kanıt/               Postman ekran görüntüleri
```

## Endpoint'ler

| Metot | Adres | Açıklama |
|---|---|---|
| POST | `/tasks` | Görev ekler |
| GET | `/tasks` | Görevleri listeler |
| GET | `/tasks/:id` | Görev detayını getirir |
| PUT | `/tasks/:id` | Görevi günceller |
| DELETE | `/tasks/:id` | Görevi siler |
| GET | `/tasks/search?keyword=backend` | Başlık ve açıklamada arar |
| GET | `/tasks/assignee/musa` | Kişiye atanan görevleri listeler |
| GET | `/reports/completed` | Tamamlanan görev sayısı |
| GET | `/reports/pending` | Bekleyen görev sayısı |
| GET | `/reports/summary` | Genel özet |

`GET /tasks` şu parametreleri alır: `status`, `priority`, `page`, `limit`, `sort`, `order`.

Ayrıntılar için [API dokümantasyonuna](docs/api-dokumantasyonu.md) bakabilirsiniz.

## Dokümanlar

- [Proje tanıtım dokümanı](docs/proje-tanitim.md)
- [Veri modeli](docs/veri-modeli.md)
- [API dokümantasyonu](docs/api-dokumantasyonu.md)
- [Test dokümantasyonu](docs/test-dokumantasyonu.md)
- [Kullanım kılavuzu](docs/kullanim-kilavuzu.md)
- [Postman koleksiyonu](docs/TaskFlow.postman_collection.json)
- [Postman ekran görüntüleri](kanıt/)
