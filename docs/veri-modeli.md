# Veri Modeli

Sistemde tek veri türü vardır: görev (task). Görevler `data/tasks.json` dosyasında dizi olarak tutulur. Son verilen id `data/lastId.json` dosyasında saklanır.

| Alan | Tür | Zorunlu | Açıklama |
|---|---|---|---|
| `id` | sayı | Otomatik | Görevin numarası. Silinen numara tekrar kullanılmaz. |
| `title` | metin | Evet | Görev başlığı, en az 3 karakter |
| `description` | metin | Evet | Görev açıklaması |
| `priority` | metin | Evet | `low`, `medium` veya `high` |
| `assignee` | metin | Evet | Görevin atandığı kişi |
| `status` | metin | Hayır | `pending`, `in-progress` veya `completed`. Gönderilmezse `pending` olur. |
| `createdAt` | tarih | Otomatik | Oluşturulma zamanı (ISO 8601) |
| `updatedAt` | tarih | Otomatik | Son güncelleme zamanı (ISO 8601) |

## Örnek kayıt

```json
{
  "id": 1,
  "title": "Giris sayfasi API baglantisi",
  "description": "Frontend ekibi icin login endpointi hazirlanacak",
  "priority": "high",
  "assignee": "musa",
  "status": "in-progress",
  "createdAt": "2026-11-02T09:15:00.000Z",
  "updatedAt": "2026-11-03T14:20:00.000Z"
}
```
