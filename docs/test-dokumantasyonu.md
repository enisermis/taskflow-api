# Test Dokümantasyonu

API iki şekilde test edilir:

1. **Otomatik test:** `npm test` komutu aşağıdaki senaryoları gerçek HTTP istekleriyle çalıştırır. Testler verinin geçici bir kopyasını kullanır.
2. **Postman:** `docs/TaskFlow.postman_collection.json` içe aktarılır. Temel CRUD testlerinin ekran görüntüleri `kanıt/` klasöründedir.

## Senaryolar

| No | Senaryo | İstek | Beklenen |
|---|---|---|---|
| 1 | Geçerli görev ekleme | `POST /tasks` | 201, durum `pending` |
| 2 | Görev detayı | `GET /tasks/:id` | 200 |
| 3 | Görev güncelleme, body'de farklı id gönderme | `PUT /tasks/:id` | 200, id değişmez |
| 4 | Görev silme | `DELETE /tasks/:id` | 200, sonra detay 404 |
| 5 | Silinen id'nin tekrar kullanılmaması (en son görev silinse bile) | `POST /tasks` | Yeni id daha büyük |
| 6 | Olmayan görev | `GET`, `PUT`, `DELETE /tasks/9999` | 404 |
| 7 | Geçersiz id | `GET /tasks/abc` | 400 |
| 8 | Duruma ve önceliğe göre filtre | `GET /tasks?status=completed` | Sadece eşleşenler |
| 9 | Geçersiz filtre değeri | `GET /tasks?status=yanlis` | 400 |
| 10 | Arama, büyük/küçük harf | `GET /tasks/search?keyword=BACKEND` | Küçük harfle aynı sonuç |
| 11 | keyword olmadan arama | `GET /tasks/search` | 400 |
| 12 | Kişiye göre listeleme | `GET /tasks/assignee/musa` | 2 kayıt |
| 13 | Sayfalama | `GET /tasks?page=2&limit=3` | 1 kayıt, toplam 2 sayfa |
| 14 | Geçersiz sayfa | `GET /tasks?page=0` | 400 |
| 15 | Tarihe göre sıralama | `GET /tasks?sort=createdAt&order=desc` | Yeniden eskiye |
| 16 | Önceliğe göre sıralama | `GET /tasks?sort=priority&order=desc` | high, medium, low sırası |
| 17 | Boş veriyle ekleme | `POST /tasks` `{}` | 400, 4 hata mesajı |
| 18 | Geçersiz öncelik | `POST /tasks` `priority: acil` | 400 |
| 19 | Kısa başlık | `POST /tasks` `title: ab` | 400 |
| 20 | Boş güncelleme | `PUT /tasks/1` `{}` | 400 |
| 21 | Bozuk JSON | `POST /tasks` | 400 |
| 22 | Raporların tutarlılığı | `GET /reports/*` | Özet ile sayılar aynı |
| 23 | Logger kaydı | herhangi bir istek | Log dosyasında metot, adres, zaman, durum kodu |
| 24 | Olmayan adres | `GET /yanlis-adres` | 404 |

## Sonuç

`npm test` çıktısı: 12 test bloğu, 12 başarılı, 0 hatalı. Yukarıdaki 24 senaryo bu 12 bloğun içindedir.
