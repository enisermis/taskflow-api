# TaskFlow Proje Tanıtım Dokümanı

## Amaç

Bu projede eğitim boyunca öğrendiğim Node.js ve Express konularını gerçek bir senaryo üzerinde uyguladım. Sonuçta görevleri yöneten çalışır bir REST API ortaya çıktı.

## Senaryo

Bir yazılım şirketi, ekipteki görevleri ve kimin neyden sorumlu olduğunu tek yerden takip etmek istiyor. TaskFlow ile yöneticiler görev açıp bir çalışana atayabilir, görevin durumunu ve önceliğini güncelleyebilir, açık işlerin genel durumunu raporlardan görebilir.

Proje yalnızca API'den oluşur, arayüzü yoktur. İstekler Postman gibi bir araçla veya ileride yazılacak bir frontend ile gönderilir.

## Sistem özellikleri

**Temel özellikler**

- Görev ekleme, listeleme, detay görme, güncelleme ve silme
- Her isteği konsola ve log dosyasına yazan logger middleware
- Görevlerin JSON dosyasında saklanması

**Ek özellikler**

- Duruma ve önceliğe göre filtreleme
- Başlık ve açıklamada arama
- Kişiye göre listeleme
- Sayfalama ve sıralama
- Eksik ya da hatalı veride 400 dönen doğrulama middleware'i
- Tamamlanan, bekleyen ve genel özet raporları

## Kullanılan teknolojiler

- Node.js
- Express.js
- Postman (elle test)
- Node'un kendi test aracı `node:test` (otomatik test)

## Mimari

İstek sırasıyla logger'dan, route'tan, gerekiyorsa doğrulama middleware'inden ve controller'dan geçer. Controller veri işini service katmanına bırakır, service de `data/tasks.json` dosyasını okuyup yazar. Hatalar en sondaki hata yakalayıcıda toplanır ve her zaman JSON olarak döner.

Veritabanı kullanmadım çünkü proje kapsamı JSON ile veri yönetimini istiyor. Dosya işlemleri tek bir service dosyasında olduğu için ileride veritabanına geçilirse değişiklik büyük ölçüde o dosyada kalır.
