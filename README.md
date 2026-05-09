# GoTasker 🚀

GoTasker, **Go (Golang)** ile geliştirilmiş, temiz mimari (clean architecture) prensiplerini takip eden, yüksek performanslı bir Görev Yönetim Sistemidir. JWT tabanlı kimlik doğrulama, GORM ile PostgreSQL entegrasyonu ve modern bir ön yüz arayüzü sunar.

## ✨ Özellikler

- **🔐 Güvenli Kimlik Doğrulama**: JWT (JSON Web Token) tabanlı kayıt olma ve giriş sistemi.
- **👤 Profil Yönetimi**: Kullanıcı bilgilerini görüntülemek ve güncellemek için korumalı uç noktalar.
- **📋 Görev Yönetimi**: Kişisel görevler için tam CRUD (Oluşturma, Okuma, Güncelleme, Silme) işlemleri.
- **🏗️ Temiz Mimari**: Repository, Service ve Controller katmanlarından oluşan modüler tasarım.
- **🐳 Docker Desteği**: Tutarlı geliştirme ve dağıtım için kolayca konteynerize edilebilir yapı.
- **🌐 Web Arayüzü**: Hemen kullanım için entegre edilmiş statik ön yüz (HTML/JS/CSS).

## 🛠️ Teknoloji Yığını

- **Dil**: [Go (Golang)](https://golang.org/)
- **Web Çerçevesi**: [Gin Gonic](https://gin-gonic.com/)
- **ORM**: [GORM](https://gorm.io/)
- **Veritabanı**: PostgreSQL
- **Kimlik Doğrulama**: JWT (JSON Web Tokens)
- **Konteynerizasyon**: Docker & Docker Compose
- **Ortam Yönetimi**: godotenv

## 🚀 Başlangıç

### Ön Gereksinimler

- Go 1.22+ yüklü olmalı
- PostgreSQL veritabanı
- Docker (isteğe bağlı)

### Kurulum ve Kurulum

1. **Depoyu klonlayın:**
   ```bash
   git clone https://github.com/kullaniciadi/GoTasker.git
   cd GoTasker
   ```

2. **Ortam Değişkenlerini Yapılandırın:**
   Kök dizinde bir `.env` dosyası oluşturun:
   ```env
   DB_HOST=localhost
   DB_USER=kullanici_adiniz
   DB_PASSWORD=sifreniz
   DB_NAME=gotasker
   DB_PORT=5432
   SERVER_PORT=8080
   JWT_SECRET=cok_gizli_anahtariniz
   ```

3. **Bağımlılıkları Yükleyin:**
   ```bash
   go mod download
   ```

4. **Uygulamayı Çalıştırın:**
   ```bash
   go run main.go
   ```
   Sunucu `http://localhost:8080` adresinde çalışmaya başlayacaktır.

### Docker ile Çalıştırma

```bash
docker-compose up --build
```

## 📡 API Uç Noktaları

### Kimlik Doğrulama
| Yöntem | Uç Nokta | Açıklama |
| :--- | :--- | :--- |
| `POST` | `/auth/register` | Yeni kullanıcı kaydı |
| `POST` | `/auth/login` | Giriş yap ve JWT token al |
| `GET` | `/auth/me` | Mevcut kullanıcı bilgilerini getir (Korumalı) |
| `PUT` | `/auth/update` | Profili güncelle (Korumalı) |

### Görevler (Korumalı)
| Yöntem | Uç Nokta | Açıklama |
| :--- | :--- | :--- |
| `POST` | `/tasks/` | Yeni görev oluştur |
| `GET` | `/tasks/` | Tüm görevleri listele |
| `PUT` | `/tasks/:id` | Belirli bir görevi güncelle |
| `DELETE` | `/tasks/:id` | Görevi sil |

## 📂 Proje Yapısı

```text
GoTasker/
├── cmd/           # Giriş noktaları
├── config/        # Veritabanı ve uygulama yapılandırması
├── controllers/   # İstek yöneticileri
├── middleware/    # Auth ve log ara yazılımları
├── models/        # GORM modelleri / varlıklar
├── public/        # Ön yüz statik dosyaları (HTML/JS/CSS)
├── repositories/  # Veritabanı erişim katmanı
├── routes/        # Rota tanımlamaları
├── services/      # İş mantığı (Business Logic) katmanı
├── utils/         # Yardımcı fonksiyonlar
└── main.go        # Ana uygulama giriş dosyası
```

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Bir sorun (issue) açabilir veya bir çekme isteği (pull request) gönderebilirsiniz.

## 📄 Lisans

Bu proje MIT Lisansı ile lisanslanmıştır.
