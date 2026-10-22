# Veteriner demo siteleri

`sitesiz.json` listesinden seçilen 5 işletme için tek sayfalık, mobil öncelikli statik siteler.
Her klasör kendi başına yayınlanabilir (HTML, CSS, JS, görseller).

| Klasör | İşletme | Telefon |
|---|---|---|
| `idaia/` | İdaia Veteriner Kliniği | 0532 290 44 32 |
| `ultravet/` | Ultravet Veteriner Kliniği (7/24) | 0552 799 88 57 |
| `orient/` | Üsküdar Orient Veteriner Kliniği (7/24) | 0546 553 89 76 |
| `fistikagaci/` | Üsküdar Fıstıkağacı Veteriner Kliniği | 0551 488 24 23 |
| `vita/` | Ümraniye Vita Veteriner | 0537 873 44 36 |

## Yerelde çalıştırma

```
python -m http.server 8080 --bind 127.0.0.1 -d siteler
```

Sonra `http://127.0.0.1:8080/` adresini açın. Yerelde form gönderilmez, yalnızca akış gösterilir.

## Yayınlama (Netlify)

1. https://app.netlify.com/drop adresine ilgili site klasörünü (örneğin `idaia/`) sürükleyin.
2. Form otomatik tanınır (`data-netlify="true"`). Site ayarlarında Forms > Form notifications altından gelen talepler için e-posta bildirimi açın.
3. Alan adını aşağıdaki gibi değiştirin, sonra Google Search Console'a `sitemap.xml` adresini ekleyin.

## Alan adı (SEO için önce bu)

Alan adları tahmini, e-postalarla aynı: `idaiaveteriner.com`, `ultravet.com.tr`, `orientveteriner.com`, `fistikagaciveteriner.com`, `vitaveteriner.com`.
Her site klasöründe şu 3 dosyada geçer: `index.html` (canonical, Open Graph, şema), `robots.txt`, `sitemap.xml`. Gerçek adres belli olunca hepsini birlikte değiştirin, örneğin:

```
sed -i 's#https://www.idaiaveteriner.com/#https://gercek-adres.com/#g' idaia/index.html idaia/robots.txt idaia/sitemap.xml
```

## Görseller

- Sayfadaki görseller WebP biçiminde. Açılış görselinin iki boyutu var: `hero-900.webp` (telefon), `hero-1800.webp` (bilgisayar).
- `img/og.jpg` (1200x630) WhatsApp, Facebook ve benzeri paylaşımlarda görünen önizleme görseli.
- Yeni fotoğraf eklerken aynı adlarla WebP olarak kaydedin ve `index.html` içindeki `width` / `height` değerlerini yeni boyutlara göre güncelleyin.

## Satıştan önce değiştirilecekler

Kodda `DEĞİŞTİRİLECEK` yorumları ve `data-degistirilecek` özelliği ile işaretli.

- **Alan adı:** Yukarıdaki bölüme bakın.
- **Görseller:** Hepsi Unsplash stok görseli. Kliniğin kendi fotoğraflarıyla değiştirin. "Örnek görsel" etiketini kaldırmak için ilgili `style.css` içindeki `.stok` kuralına `display: none` ekleyin.
- **E-posta:** Adresler tahmini (`info@...`), işletmeden alınacak.
- **Çalışma saatleri:** Kapanış saatleri Google'dan geliyor, açılış saati (09:00) tahmini. `body` etiketindeki `data-saatler` ile alt bilgideki metni birlikte güncelleyin.
- **Hizmetler ve SSS:** Yaygın veteriner hizmetleri yazıldı. Röntgen, ultrason, yatış, ödeme seçenekleri, hatırlatma mesajı gibi hizmetleri işletmeyle doğrulayın.
- **Vita:** İlçe (Üsküdar) Google'daki "Ümraniye" adı nedeniyle doğrulanacak.
- **Yorumlar:** Alıntılar ve puanlar Google Haritalar verisinden alındı (Ekim 2026).
