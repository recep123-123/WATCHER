OMNINOMICS v5.0.6 — Market Intelligence Layer

Bu sürüm v5.0.5 üzerine Funding Rate + Open Interest + News + Reddit/Social Intelligence katmanı ekler.

Eklenenler:
1. /api/intel.js endpoint
2. Binance Funding Rate history
3. Binance Open Interest current/history
4. Funding Z-Score
5. OI 1h / 4h / 24h değişim
6. Derivatives Risk Score
7. GDELT news intelligence
8. CryptoPanic optional API key desteği
9. Reddit public search/social proxy
10. Euphoria / Panic / Attention skorları
11. Market Intelligence paneli
12. Derivatives Intelligence paneli
13. News Intelligence paneli
14. Social Intelligence paneli
15. Final Decision Intelligence Overlay
16. Hard risk flags: hack/exploit/delist/depeg/halt
17. Size-down sistemi: crowded funding, OI spike, social euphoria, negative news

Önemli karar:
- Funding/OI/orderbook doğrudan LONG/SHORT üretmez.
- Türev verileri ana karar motoruna direksiyon olarak bağlanmaz.
- Bu veriler risk overlay, size-down, WAIT ve yalnızca kırmızı olaylarda NO_TRADE hard-block üretir.
- Top 200 radar yoktur.
- Dune otomatik tarama yoktur.

Yükleme:
1. ZIP'i aç.
2. GitHub repo köküne tüm dosyaları yükle.
3. public/index.html ve api/intel.js yüklendiğinden emin ol.
4. Commit changes.
5. Vercel deploy sonrası Ctrl+F5 yap.
6. Market Intelligence → BTC/Seçili coin istihbaratını yenile.
7. Sistem → Self-Test sayfasını çalıştır.

--- Önceki README ---
OMNINOMICS v5.0.5 — Signal Verification & Live Scorecard

Bu sürüm v5.0.4 Signal Calibration üzerine doğrulama ve canlı performans katmanı ekler.

Eklenenler:
1. Build Info kartı
2. Self-test butonu / sistemi
3. Raw → Final sinyal açıklaması
4. Neden işlem yok paneli
5. Sinyal yaşlandırma filtresi
6. Retest teyit modu
7. Wick / fakeout kalitesi filtresi
8. Canlı sinyal karnesi
9. Coin karakter profili
10. BTC piyasa modu ana kilidi

Önemli:
- Türev verileri karar sistemine bağlı değildir.
- Funding/OI/orderbook karar motoruna girmez.
- Top 200 radar yoktur.
- Canlı karne localStorage kullanır; tarayıcı bazlıdır.

Yükleme:
1. ZIP'i aç.
2. GitHub repo köküne tüm dosyaları yükle.
3. public/index.html dosyasının yüklendiğinden emin ol.
4. Commit changes.
5. Vercel deploy sonrası Ctrl+F5 yap.
6. Sistem → Build Info ve Sistem → Self-Test sayfalarını kontrol et.

--- Önceki README ---
OMNINOMICS v5.0.4 — Signal Calibration Edition

Bu sürüm çalışan Vercel paketinin üzerine sinyal doğruluğunu artırmaya yönelik kalibrasyon katmanı ekler.

Eklenenler:
1. Setup bazlı geçmiş başarı hafızası
2. Coin bazlı geçmiş benzer setup analizi
3. Expected R hesabı
4. Setup win rate tahmini
5. Minimum sample size kontrolü
6. MTF teyit filtresi
7. Destek/direnç mesafe filtresi
8. Rejim/entropi tabanlı NO_TRADE filtresi
9. Sinyal confidence skoru
10. Sinyal eleme nedenleri paneli
11. Setup Kalitesi sayfası güncellendi
12. Sinyaller sayfası raw/final sinyal karşılaştırmalı hale geldi
13. Detay sayfasına kalibrasyon raporu eklendi

Önemli:
- Türev verileri karar sistemine bağlı değildir.
- Funding/OI/orderbook karar motoruna dahil edilmez.
- Türev & Likidite sadece panel olarak kalır.
- Amaç daha fazla sinyal değil, daha kaliteli sinyal üretmektir.

Yükleme:
1. ZIP'i aç.
2. GitHub repo köküne tüm dosyaları yükle.
3. public/ klasörünün yüklendiğinden emin ol.
4. Commit changes.
5. Vercel deploy sonrası Ctrl+F5 yap.

--- Önceki README ---
OMNINOMICS v5.0.3 — Vercel Public Output Directory Fix

DÜZELTİLEN HATA:
Vercel logundaki:
  Error: No Output Directory named "public" found after the Build completed.

Sebep:
Vercel "Other / Static" import ayarında build sonrası "public" klasörü bekliyordu.
Önceki pakette public klasörü yoktu.

Bu pakette:
- public/ klasörü eklendi.
- public/index.html eklendi.
- vercel.json içine "outputDirectory": "public" eklendi.
- buildCommand statik ve güvenli bırakıldı.
- functions bloğu yok.
- API endpointleri rewrites ile korunuyor.
- Türev verileri karar sistemine bağlı değil; sadece panelde.

YÜKLEME:
1. GitHub repo kökünü mümkünse temizle.
2. Bu ZIP içindeki dosyaları repo köküne yükle.
3. Özellikle public/ klasörünün yüklendiğinden emin ol.
4. Commit changes.
5. Vercel deploy'u yeniden başlat.
6. Deploy sonrası Ctrl+F5 yap.

Dosyalar:
index.html
public/
  index.html
package.json
.vercelignore
vercel.json
README.txt
api/
  market.js
  liquidity.js
  attention.js

--- Önceki README ---
OMNINOMICS v5.0.2 — Vercel "Function must contain at least one property" Fix

DÜZELTİLEN HATA:
Vercel logundaki:
  Error: Function must contain at least one property.

Sebep:
vercel.json içinde boş function config vardı:
  "functions": {
    "api/market.js": {},
    "api/liquidity.js": {},
    "api/attention.js": {}
  }

Vercel yeni CLI bunu kabul etmiyor. Bu blok tamamen kaldırıldı.
API endpointleri rewrites ile çalışmaya devam eder.

YÜKLEME:
1. GitHub repo kökünü mümkünse temizle.
2. Bu ZIP içindeki dosyaları repo köküne yükle.
3. Commit changes.
4. Vercel deploy'u yeniden başlat.
5. Deploy sonrası Ctrl+F5 yap.

Dosyalar:
index.html
package.json
.vercelignore
vercel.json
README.txt
api/
  market.js
  liquidity.js
  attention.js

Türev verileri karar sistemine bağlı değildir; sadece panelde izlenir.

--- Önceki README ---
OMNINOMICS v5.0.1 SAFE — Vercel Deploy Fix

Bu paket, arkadaşının v5.0.0 paketinden üretildi.

Yapılan güvenli düzeltmeler:
1. Vercel deploy için package.json eklendi.
2. Eski Vite/React build ayarlarının deploy'u bozmasını önlemek için buildCommand/installCommand statik hale getirildi.
3. .vercelignore eklendi; eski src/dist/workers kalıntıları deploy'a karışmasın.
4. vercel.json catch-all fallback eklendi.
5. maxDuration değerleri kaldırıldı; plan/config çakışması yaşanmasın.
6. Türev/orderbook/funding verileri karar motorundan çıkarıldı.
7. Türev & Likidite endpointleri ve panelleri korundu; sadece izleme paneli olarak kalır.

ÖNEMLİ:
- Türev verileri karar sistemine bağlı değildir.
- Top 200 radar eklenmedi.
- Bu paket static/Vercel uyumludur; npm build gerektirmez.

Yükleme:
1. GitHub repo kökünü mümkünse temizle.
2. Bu ZIP'in içindeki dosyaları repo köküne yükle.
3. Commit changes.
4. Vercel deploy bekle.
5. Deploy sonrası Ctrl+F5 yap.

Dosyalar:
index.html
package.json
.vercelignore
vercel.json
README.txt
api/
  market.js
  liquidity.js
  attention.js

--- Arkadaş Paketinin Eski README'i ---
OMNINOMICS Trade Engine v5.0.0
================================

Vercel uyumlu paket. Önceki versiyonlardan (v4.7.x) gelen tüm yazılımsal ve
trade stratejisi sorunları düzeltilmiş halidir.

İçerik
------
- index.html
- api/market.js
- api/liquidity.js
- api/attention.js
- vercel.json
- README.txt

Yükleme
-------
1. Bu paketi GitHub repo'ya yükle (root'a koy).
2. Vercel'e gir, "Add New > Project".
3. GitHub repo'yu seç.
4. "Framework Preset" = Other.
5. Build/Output ayarına dokunma.
6. Deploy.


v5.0.0 değişiklikleri
=====================

Trade stratejisi düzeltmeleri (kritik)
--------------------------------------
1. Look-ahead bias düzeltildi: backtest'te sinyal bar i'de oluşur, entry bar i+1
   open'da olur. Önceki versiyon sinyali ürettiği barın kapanışında giriyor,
   sonuçları sistematik olarak şişiriyordu.
2. TP'ler S/R direnç/destek bantlarıyla cap'lendi: TP fiyatı en yakın direnç
   bandının ATR×0.3 altına/üstüne çekiliyor. Winner'lar artık dirençten
   dönmeden çıkış alıyor.
3. VWAP session-reset: 1d/4h'da daily, 1h/15m/5m'de daily reset uygulanır.
   Önceki kümülatif VWAP yanıltıcıydı.
4. Slope ATR-relative: dirPressure'da slope volatilite ile normalize edildi.
   Yüksek-volatilite altcoinlerde false-positive azaldı.
5. decide() simetrik: STRONG_LONG ve STRONG_SHORT eşikleri eşitlendi
   (harmony >= 63 her ikisi için). BREAKDOWN zorunluluğu kaldırıldı.
6. Real liquidity skoru: orderbook depth verisi (bid/ask USD, spread bps,
   imbalance) Field Model'e entegre edildi. Eski "liqPressure" yeniden
   adlandırıldı: "volumeFlow" (dürüstlük adına).
7. Resonance n>=10 zorunluluğu: tek bir benzer geçmiş örneği için bias
   üretilmez. Confidence interval eklendi.
8. BTC context tam aktarımı: BTC entropy/state/funding altcoin analizine
   girer; BTC kaos/breakdown'da altcoin sinyalleri otomatik downgrade.
9. Position sizing limits: tek pozisyon hesabın max %25'ini geçemez,
   portföy total risk max %4 ile sınırlı.
10. Fakeout follow-through: 2 bar onay bekler, anlık spike'lar fakeout
    sayılmaz.
11. DISTRIBUTION state aktif: high entropy + falling momentum + high volume
    durumunda dağıtım fazı tanınır.
12. Funding rate Field Model'e entegre: extreme funding (>%0.1) sinyal
    yönüne karşıt etki yapar (long crowding dipte short fırsatı, vb.).

Yazılımsal düzeltmeler
----------------------
1. getDerivatives çift tanımı kaldırıldı, tek versiyon.
2. Vercel API'lerde paralel mirror fetch (Promise.any) — eski sıralı
   fallback worst-case 48s sürüyordu, şimdi 5s per-request.
3. Page dispatch ternary zinciri lookup map'e dönüştürüldü.
4. runBt incremental indicator hesabı: O(n²) → O(n).
5. CSP meta tag eklendi (XSS koruma).
6. setInterval ayarlardan dinamik güncelleniyor (refreshSec değişikliğinde
   eski interval iptal edilir).
7. AbortController: TF değişiminde önceki refresh iptal edilir.
8. alert() yerine toast component.
9. Vercel.json cache çelişkisi çözüldü.
10. Form input'larında scroll/değer korunması.

Geriye uyumluluk
----------------
- Mevcut localStorage anahtarları korunur (omni_v2_terminal, omni_paper,
  omni_signal_journal, omni_notes_v2, omni_api_keys).
- Tüm 58 sayfa erişilebilir durumda.
- Settings'teki coin listesi, ağırlıklar, risk parametreleri bozulmaz.
