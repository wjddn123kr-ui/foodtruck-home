---
name: component-refactor
description: 푸드트럭하우스 공통 구조·DRY 규칙. 헤더·푸터 등 공통 요소는 partials/header.html·partials/footer.html로 분리해 include로 재사용, 중복 코드 금지(DRY), CSS는 assets/css/style.css에 공유. 페이지를 새로 만들거나 공통 요소를 수정할 때 별도 요청이 없어도 이 규칙을 지킬 것.
---

# 푸드트럭하우스 공통 구조 & DRY 규칙

**핵심: 헤더·푸터·공통 CSS는 한 곳에만 있고, 모든 페이지가 그것을 "불러다" 쓴다. 한 번만 고치면 전 페이지 반영.** 복붙으로 같은 마크업을 여러 파일에 두지 않는다.

## 1. 공통 요소는 partials로 분리

| 파일 | 역할 | 고칠 때 |
|------|------|---------|
| `assets/css/style.css` | 공통 CSS(토큰·리셋·헤더·푸터·드로어·플로팅버튼·.reveal·반응형). 폰트는 여기서 `@import` | 색/헤더/푸터 스타일은 **여기만** |
| `partials/header.html` | 헤더 + 모바일 드로어 마크업(소개·서비스 드롭다운 포함) | 메뉴·로고·전화·CTA는 **여기만** |
| `partials/footer.html` | 푸터 + 플로팅버튼(카톡·견적·소셜) 마크업 | 푸터 링크·사업자정보·SNS는 **여기만** |
| `assets/js/include.js` | `[data-include]`에 해당 파일을 fetch해 끼워넣고, 현재 경로와 일치하는 메뉴에 `is-active` 부여 + 헤더 스크롤·드로어·.reveal 동작 연결 | 보통 안 건드림 |

## 2. 각 페이지(.html)의 모습 — 이 4줄만

- `<head>`: `<link rel="stylesheet" href="/assets/css/style.css">` + 그 아래 `<style>`에 **그 페이지 고유 CSS만**
- 헤더 자리: `<div class="hd-slot" data-include="/partials/header.html"></div>`
- 푸터 자리: `<div data-include="/partials/footer.html"></div>`
- `</body>` 직전: `<script src="/assets/js/include.js" defer></script>`

새 페이지를 만들 땐 위 4줄만 넣으면 헤더·푸터가 자동으로 붙는다.

## 3. DRY 규칙

- **같은 마크업/스타일/로직을 두 곳 이상에 복붙하지 않는다.** 공통이면 partials 또는 style.css로 올린다.
- 페이지 고유가 아닌 CSS(헤더·푸터·버튼·색·간격)를 페이지 `<style>`에 두지 않는다 → `assets/css/style.css`.
- 활성 메뉴 표시는 JS가 자동(`is-active`) — 페이지에 하드코딩 금지.
- 헤더/푸터 내용(메뉴 항목·사업자정보·SNS)을 페이지별로 다르게 두지 않는다. 한 곳에서 관리.

## 4. 규칙·주의

- 경로는 **루트 절대경로**(`/assets/...`, `/partials/...`)로. 하위폴더 페이지가 생겨도 안 깨지게.
- `include.js`는 **fetch 방식**이라 `file://`(더블클릭)로 열면 헤더·푸터가 안 뜬다. **반드시 http**(로컬서버/배포)에서 확인 — `미리보기.bat`(→ http://localhost:8123).
- coffee.html만 투명헤더 → `<body class="landing">`(흰 로고). 나머지 밝은 히어로 페이지는 landing 미사용.
- 드래프트/구버전(design-*·index-7 등)엔 적용하지 않는다.

## 셀프 체크

1. 새 페이지가 위 4줄로 헤더·푸터를 include 하는가?(복붙 마크업 없음)
2. 공통 CSS를 페이지 `<style>`에 넣지 않았는가?(style.css로)
3. 같은 코드를 두 곳에 복붙하지 않았는가?
4. 경로가 루트 절대경로인가? http로 확인했는가?
5. 활성 메뉴를 하드코딩하지 않았는가?
