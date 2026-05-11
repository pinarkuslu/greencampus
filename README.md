<div align="center">

<img src="favicon.svg" width="80" alt="GreenCampus logo" />

# GreenCampus

### Karbon ve Su Ayak İzi Farkındalık Analizi

İnteraktif, cinematik ve tamamen istemci tarafı çalışan bir akademik sürdürülebilirlik panosu.
210 üniversite öğrencisinin katıldığı nicel saha çalışmasının görselleştirilmiş sonuçları.

[**Canlı Demo**](https://pinarkuslu.github.io/greencampus/) · [Karbon Ayak İzi (Wikipedia)](https://tr.wikipedia.org/wiki/Karbon_ayak_izi) · [Su Ayak İzi (Wikipedia)](https://tr.wikipedia.org/wiki/Su_ayak_izi)

<br />

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![No Build](https://img.shields.io/badge/No_Build_Step-04110e?style=for-the-badge)
![GitHub Pages](https://img.shields.io/badge/Deployed_on-GitHub_Pages-181717?style=for-the-badge&logo=github)

</div>

---

## Hakkında

**GreenCampus**, üniversite öğrencilerinin günlük tüketim alışkanlıklarının çevresel etkisini
disiplinlerarası bir yaklaşımla değerlendiren nicel bir saha çalışmasının dijital sunumudur.

Çalışma; demografi, çevresel duyarlılık, **karbon ayak izi** ve **su ayak izi** olmak üzere
dört eksende toplam 50'yi aşkın ifade içeren bir anket üzerine kuruludur. Sonuçlar, ham Google
Forms ekranlarından alınarak premium, animasyonlu ve etkileşimli bir dashboard deneyimine
dönüştürülmüştür.

> "Ölçemediğimizi yönetemeyiz." — Sürdürülebilir bir gelecek için bilinçli adımlar.

---

## Öne Çıkan Özellikler

| | |
|---|---|
| **Cinematik Hero** | Parçacık canvas, animasyonlu blob'lar, parallax grid overlay, glow gradyanlar |
| **Çift Tema** | Karanlık (varsayılan) ↔ aydınlık sage-paper paleti, oturum kalıcı, FOUC önlemli pre-paint script |
| **Otomatik Dilim Döngüsü** | Donut grafiklerin ortası 5 saniyede bir dilim sırasını gösterir; hover'da durur, ayrılınca kaldığı yerden devam eder |
| **Etkileşimli Pano** | 4 sekmeli (Demografi · Farkındalık · Karbon · Su) animasyonlu donut, yatay bar ve gruplu Likert grafikleri |
| **Editöryel Kavramlar Bölümü** | CO₂ ve H₂O için inline SVG ile pixel-perfect gradient sembol, ayna düzen |
| **SDG Kartları** | BM 2030 Gündemi'nin 7 anahtar hedefiyle uyum (06, 07, 11, 12, 13, 15, 04) |
| **Performans** | Hero offscreen olunca canvas + blob animasyonları otomatik durur, scroll FPS dipsiz kalmaz |
| **Session-based Loader** | İlk girişte cinematik yükleme animasyonu; aynı sekme oturumunda yenilemede atlanır |
| **Erişilebilir** | Semantik HTML, `prefers-reduced-motion` desteği, klavye-uyumlu nav, ARIA etiketleri |
| **Sıfır Bağımlılık** | Sadece HTML/CSS/JS · framework, build adımı veya backend yok |

---

## Bölümler

1. **Hero** — Proje girişi ve canlı katılımcı metrikleri
2. **Araştırma Hakkında** — Disiplinlerarası yaklaşım ve metodoloji özeti
3. **Kavramlar** — Karbon ayak izi ve su ayak izi tanımları + Wikipedia bağlantıları
4. **Canlı İstatistik** — Animasyonlu sayaç kartları
5. **İnteraktif Pano** — 4 sekmeli grafik bölgesi
6. **SDG Bağlantısı** — BM Sürdürülebilir Kalkınma Hedefleri ile uyum
7. **Yöntem** — 5 adımlı akademik araştırma süreci timeline
8. **Footer** — Proje künyesi ve iletişim

---

## Teknoloji

| Katman | Teknoloji |
|---|---|
| Markup | Semantik HTML5 |
| Stil | Vanilla CSS · CSS Variables · Custom Properties · Glassmorphism · Container Queries |
| Etkileşim | Vanilla JS (ES6+) · IntersectionObserver · requestAnimationFrame · sessionStorage |
| Grafikler | Inline SVG (donut, sembol) · CSS bar (yatay/dikey gruplu) · HTML5 Canvas (parçacıklar) |
| Tipografi | Google Fonts (Inter + Space Grotesk) |
| Deploy | GitHub Pages (statik) |

**Bağımlılık yok.** Tek bir `npm install` veya build adımı gerekmez.

---

## Yerel Kurulum

Proje tamamen statik dosyalardan oluştuğu için herhangi bir kurulum gerektirmez:

```bash
git clone https://github.com/pinarkuslu/greencampus.git
cd greencampus
```

Sonra üç seçenekten biri:

```bash
# 1) En kolay: index.html'yi tarayıcıda aç
open index.html

# 2) Python ile local server
python3 -m http.server 8080
# → http://localhost:8080

# 3) Node ile (varsa)
npx serve .
```

---

## Veri Güncelleme

Tüm grafik verisi, `index.html` içinde grafik elementlerinin `data-*` özniteliklerinde JSON olarak gömülüdür.
Yüzdeleri veya kategorileri değiştirmek için **yalnızca HTML'i** düzenlemek yeterlidir; JS dosyasına dokunmaya gerek yoktur.

```html
<!-- Donut örneği -->
<div class="donut" data-donut='[
  {"label":"Kadın","value":65.7,"color":"#34f5c5"},
  {"label":"Erkek","value":34.3,"color":"#3aa8ff"}
]'></div>

<!-- Yatay bar örneği -->
<ul class="hbar" data-hbar='[
  {"label":"Mühendislik","value":32.4,"color":"#34f5c5"}
]'></ul>
```

---

## Tema ve Renk Özelleştirme

`style.css` dosyasının başındaki `:root` ve `[data-theme="light"]` blokları tüm
renk paletini kontrol eder. Tek bir değişkeni değiştirerek site genelindeki gradyanları,
glow'ları ve arka planları senkronize biçimde güncelleyebilirsin.

```css
:root, [data-theme="dark"] {
  --bg-0: #04110e;
  --mint: #34f5c5;
  --cyan: #3aa8ff;
  --grad-primary: linear-gradient(135deg, #34f5c5 0%, #3aa8ff 100%);
}
```

---

## Erişilebilirlik

- `prefers-reduced-motion: reduce` medya sorgusu: tüm animasyonlar otomatik devre dışı
- Klavye gezintisi: tüm interaktif elementler odaklanabilir
- Renk kontrastı: WCAG AA uyumlu
- Semantik HTML: `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>` doğru kullanımı
- ARIA: SVG ikonlarda `aria-hidden`, butonlarda `aria-label`

---

## Performans Notları

- Hero ekran dışına çıktığında parçacık canvas ve blob animasyonları otomatik durur
- IntersectionObserver ile grafikler sadece görünürken animasyonla çizilir
- `will-change` ipuçları compositor katmanı için optimize
- Cursor glow `mix-blend-mode` değişkenli — temaya göre `screen` / `multiply` arasında geçiş yapar
- Donut otomatik döngü, gizli sekmelerde (`document.hidden`) durur

---

## Proje Yapısı

```
greencampus/
├── index.html       Tüm yapı ve veri (yaklaşık 800 satır, tek sayfa)
├── style.css        Tasarım sistemi ve animasyonlar (~900 satır)
├── script.js        Etkileşim, grafikler, loader, tema, döngüler (~400 satır)
├── favicon.svg      Yaprak logosu (gradyan)
└── README.md        Bu dosya
```

---

## Lisans

Bu proje akademik amaçla geliştirilmiştir. Eğitim ve kişisel kullanım için serbesttir.

---

<div align="center">

**Pınar Kuşlu** · [pinaarkuslu@gmail.com](mailto:pinaarkuslu@gmail.com)

Üniversite Araştırma Projesi · 2026

</div>
