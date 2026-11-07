# API Dokümantasyonu

Temel adres: `http://localhost:3000`

İstek gövdeleri JSON olarak gönderilir. Başarılı cevaplarda `success: true`, hatalı cevaplarda `success: false` ve `message` döner.

## Durum kodları

| Kod | Anlamı |
|---|---|
| 200 | İşlem başarılı |
| 201 | Görev oluşturuldu |
| 400 | Gönderilen veri veya parametre hatalı |
| 404 | Görev ya da adres bulunamadı |
| 500 | Sunucu hatası |

## Görev ekleme

`POST /tasks`

```json
{
  "title": "Giris sayfasini yap",
  "description": "Kullanici girisi eklenecek",
  "priority": "high",
  "assignee": "musa"
}
```

Cevap `201`:

```json
{
  "success": true,
  "data": {
    "id": 5,
    "title": "Giris sayfasini yap",
    "description": "Kullanici girisi eklenecek",
    "priority": "high",
    "assignee": "musa",
    "status": "pending",
    "createdAt": "2026-11-07T10:00:00.000Z",
    "updatedAt": "2026-11-07T10:00:00.000Z"
  }
}
```

Hatalı veri, cevap `400`:

```json
{
  "success": false,
  "message": "Gecersiz veri",
  "errors": ["title zorunlu ve bos olamaz"]
}
```

## Görevleri listeleme

`GET /tasks`

| Parametre | Örnek | Açıklama |
|---|---|---|
| `status` | `completed` | Duruma göre filtreler |
| `priority` | `high` | Önceliğe göre filtreler |
| `page` | `1` | Sayfa numarası, varsayılan 1 |
| `limit` | `10` | Sayfadaki kayıt sayısı, varsayılan 10 |
| `sort` | `createdAt` | `createdAt`, `updatedAt`, `title`, `priority` veya `status` |
| `order` | `desc` | `asc` veya `desc`, varsayılan `asc` |

Parametreler birlikte kullanılabilir: `GET /tasks?status=pending&sort=priority&order=desc&page=1&limit=5`

Cevap `200`:

```json
{
  "success": true,
  "page": 1,
  "limit": 10,
  "total": 1,
  "totalPages": 1,
  "data": [
    {
      "id": 3,
      "title": "Backend hata kayitlarini incele",
      "description": "Gecen haftanin loglari kontrol edilecek",
      "priority": "low",
      "assignee": "musa",
      "status": "completed",
      "createdAt": "2026-11-04T08:30:00.000Z",
      "updatedAt": "2026-11-05T16:45:00.000Z"
    }
  ]
}
```

## Görev detayı

`GET /tasks/:id`

Cevap `200`: `{ "success": true, "data": { ...görev } }`

Görev yoksa `404`, id sayı değilse `400` döner.

## Görev güncelleme

`PUT /tasks/:id`

Sadece değişecek alanları göndermek yeterlidir. `id` ve tarih alanları istekle değiştirilemez, `updatedAt` otomatik yenilenir.

```json
{
  "status": "completed"
}
```

Cevap `200`: `{ "success": true, "data": { ...güncel görev } }`

## Görev silme

`DELETE /tasks/:id`

Cevap `200`:

```json
{
  "success": true,
  "message": "1 numarali gorev silindi"
}
```

## Arama

`GET /tasks/search?keyword=backend`

Başlık ve açıklamada büyük/küçük harf ayırmadan arar. `keyword` yoksa `400` döner. Cevap formatı listelemeyle aynıdır, `page`, `limit`, `sort`, `order`, `status` ve `priority` burada da çalışır.

## Kişiye göre listeleme

`GET /tasks/assignee/:name`

Örnek: `GET /tasks/assignee/musa`. Cevap formatı listelemeyle aynıdır.

## Raporlar

`GET /reports/completed` ve `GET /reports/pending`:

```json
{
  "success": true,
  "data": { "count": 1 }
}
```

`GET /reports/summary`:

```json
{
  "success": true,
  "data": {
    "totalTasks": 4,
    "completed": 1,
    "pending": 2,
    "inProgress": 1,
    "completionRate": 25,
    "byPriority": { "high": 2, "medium": 1, "low": 1 },
    "byAssignee": { "musa": 2, "ayse": 1, "ali": 1 }
  }
}
```

`completionRate` yüzde olarak tamamlanan görev oranıdır.
