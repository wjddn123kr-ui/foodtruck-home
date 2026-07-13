---
name: seo
description: 푸드트럭하우스 정적사이트 SEO 규칙. 모든 페이지에 고유 title·description 메타태그, OG태그(og:title/og:image/og:description 등), 구조화 데이터(JSON-LD) 필수. 새 HTML 페이지를 만들거나 <head>를 수정할 때 별도 요청이 없어도 이 규칙을 지킬 것. 브랜드 무드·톤은 [[foodtruck-brand]] 참조.
---

# 푸드트럭하우스 SEO 규칙 (정적 HTML/CSS/JS 기준)

빌드도구 없는 순수 정적 사이트다. 각 `.html`의 `<head>`에 아래 3종을 **페이지마다 직접** 넣는다. 값은 페이지별로 고유해야 한다(복붙 후 값 안 바꾸는 것 금지).

## 1. 기본 메타 — 모든 페이지 필수

```html
<title>페이지 고유 제목 · 푸드트럭하우스</title>
<meta name="description" content="이 페이지를 요약하는 70~120자 고유 설명. 키워드는 억지로 넣지 말고 실제 문장으로.">
<link rel="canonical" href="https://foodtruckhouse.com/<경로>">
<meta name="viewport" content="width=device-width, initial-scale=1">
```

- `title`은 페이지마다 다르게, 55자 내외. 패턴: `핵심 키워드 · 푸드트럭하우스`.
- `description`은 페이지마다 다르게. 실제 텍스트에 있는 키워드(커피차·푸드트럭·간식차 등, [[vehicle-seo-keywords]])를 자연스럽게.
- `canonical`은 절대 URL. 중복 URL 방지.

## 2. Open Graph / 트위터 카드 — 모든 페이지 필수

```html
<meta property="og:type" content="website">
<meta property="og:site_name" content="푸드트럭하우스">
<meta property="og:title" content="페이지 고유 제목">
<meta property="og:description" content="페이지 고유 설명">
<meta property="og:image" content="https://foodtruckhouse.com/og/<page>.jpg">
<meta property="og:url" content="https://foodtruckhouse.com/<경로>">
<meta name="twitter:card" content="summary_large_image">
```

- `og:image`는 **1200×630 절대 URL**. 페이지 성격에 맞는 대표 이미지(없으면 공통 브랜드 OG 이미지).
- og:title/description은 위 title/description과 일관되게(과장 없이).

## 3. 구조화 데이터(JSON-LD) — 모든 페이지 필수

`<head>` 또는 `</body>` 앞에 `<script type="application/ld+json">`로 넣는다. 페이지 유형에 맞는 스키마를 고른다.

- **전 페이지 공통 — Organization**(사업자 정보와 일치):
  ```html
  <script type="application/ld+json">
  {
    "@context":"https://schema.org",
    "@type":"Organization",
    "name":"주식회사 하이팅",
    "alternateName":"푸드트럭하우스",
    "url":"https://foodtruckhouse.com",
    "logo":"https://foodtruckhouse.com/logo.png",
    "telephone":"1877-6901",
    "address":{"@type":"PostalAddress","addressLocality":"용인시 기흥구","addressRegion":"경기도","addressCountry":"KR"}
  }
  </script>
  ```
- **페이지 유형별 추가:**
  - 후기(review) → `Review` / `AggregateRating`
  - 공지·뉴스(news) → `Article` / `NewsArticle`
  - 메뉴(menu) → `Menu` / `MenuItem`
  - FAQ 섹션 → `FAQPage`
  - 서비스 상세 → `Service`
- JSON-LD의 값은 **화면에 실제로 있는 내용과 일치**해야 한다(허위 리치결과 금지).

## 4. 사이트 전역

- `robots.txt` + `sitemap.xml`을 루트에 두고 전 페이지를 등록한다.
- 이미지 `alt`는 필수(접근성 겸 SEO) → [[]]는 accessibility 스킬 규칙과 함께 지킨다.
- 언어: `<html lang="ko">`.

## 셀프 체크 (새 페이지 배포 전)

1. title·description이 이 페이지만의 고유값인가(다른 페이지와 다름)?
2. og:title/description/image/url 4종 + twitter:card 있는가? og:image가 1200×630 절대 URL인가?
3. Organization JSON-LD + 페이지 유형별 스키마 있는가? 값이 화면과 일치하는가?
4. canonical·`<html lang="ko">`·viewport 있는가?
5. sitemap.xml에 이 페이지가 등록됐는가?
