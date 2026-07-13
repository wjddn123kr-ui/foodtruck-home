---
name: performance
description: 푸드트럭하우스 성능 규칙. 이미지는 webp+lazy load, 애니메이션은 transform/opacity만(레이아웃 리플로우 유발 속성 금지), Lighthouse 90점 이상 기준. 이미지·애니메이션·CSS·스크립트를 추가하거나 최적화할 때 별도 요청이 없어도 이 규칙을 지킬 것.
---

# 푸드트럭하우스 성능 규칙

정적 사이트. 목표는 **모바일 Lighthouse Performance 90점 이상** 유지. 아래 규칙을 지키면 대부분 달성된다.

## 1. 이미지 — webp + lazy load

- 포맷은 **webp** 우선(사진). 원본이 크면 웹용으로 압축해 올린다.
- 첫 화면(above the fold) 밖 이미지는 **`loading="lazy"`**. 히어로 등 첫 화면 이미지는 lazy 걸지 말고 `fetchpriority="high"`.
- **`width`/`height` 속성(또는 CSS aspect-ratio)을 항상 지정** → CLS(레이아웃 이동) 방지.
- 반응형: 뷰포트별 다른 이미지는 `<picture>`/`srcset`으로. 모바일에 데스크톱 대용량 이미지 내려주지 않는다.
- `decoding="async"`, `alt` 필수(접근성 겸).
```html
<img src="/img/menu.webp" width="800" height="600" loading="lazy" decoding="async" alt="...">
```

## 2. 애니메이션 — transform/opacity만

- **애니메이션·트랜지션은 `transform`과 `opacity`만** 사용한다. GPU 합성만으로 처리돼 리플로우/리페인트가 없다.
- **금지(레이아웃 리플로우 유발):** `width`/`height`/`top`/`left`/`right`/`bottom`/`margin`/`padding`을 애니메이션하지 않는다. 이동은 `translate`, 크기는 `scale`로.
- 자주 움직이는 요소엔 `will-change: transform`을 **필요할 때만**(남발 금지, 메모리 소모).
- `prefers-reduced-motion: reduce`에서 애니메이션·배경영상 끈다(품질 바닥).

## 3. 로딩·리소스

- CSS는 `assets/css/style.css` 하나로 공유(중복 로드 방지). 폰트는 CSS `@import`.
- JS는 `defer`로 로드. 렌더 블로킹 스크립트 금지.
- 폰트: `font-display: swap`, 필요한 웨이트만 로드. 서브셋 가능하면 서브셋.
- 배경 영상(히어로)은 muted·loop·playsinline + poster 이미지, reduced-motion에서 숨김.
- 서드파티 스크립트(픽셀·분석)는 최소화하고 지연 로드.

## 셀프 체크

1. 새 이미지가 webp인가? 첫 화면 밖이면 `loading="lazy"` + width/height 지정?
2. 애니메이션이 transform/opacity만 쓰는가? top/left/width 등 애니메이션 없는가?
3. reduced-motion 존중하는가?
4. JS `defer`, CSS 단일 파일 공유인가?
5. 모바일 Lighthouse 90점 이상인가?(배포 전 확인)
