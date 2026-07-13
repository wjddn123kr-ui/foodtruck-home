---
name: supabase-rules
description: 푸드트럭하우스 Supabase(admin·DB·Storage) 사용 규칙. 모든 테이블 RLS 필수, egress 절약(select * 금지·필요 컬럼만·페이지네이션 기본), 이미지/파일은 Storage 사용·DB에 base64 저장 금지, 주민번호·계좌번호 등 민감정보는 암호화 컬럼. Supabase 스키마·쿼리·마이그레이션·RLS 정책·Storage 업로드 코드를 만들거나 리뷰할 때 별도 요청이 없어도 이 규칙을 지킬 것.
---

# 푸드트럭하우스 Supabase 규칙

후기·뉴스·메뉴 admin 등 Supabase를 쓰는 코드(스키마·쿼리·RLS·Storage)를 만들거나 고칠 때 반드시 지키는 규칙이다. 아래 4개는 협상 불가.

## 1. RLS — 모든 테이블에 정책 필수

- **예외 없이 모든 테이블에서 RLS를 켠다.** 테이블을 만들면 같은 마이그레이션에서 바로:
  ```sql
  alter table public.<table> enable row level security;
  ```
- RLS를 켠 뒤 **필요한 정책을 명시적으로 추가**한다. 정책이 없으면 아무도 접근 못 하는 게 정상 — "그냥 열어두기"용 `using (true)` 남발 금지.
- 최소 권한 원칙:
  - 공개 읽기용(후기·뉴스·메뉴 등)은 `select`만 `to anon` 허용.
  - 쓰기/수정/삭제는 관리자(`authenticated` + 역할 체크)에게만.
- `service_role` 키는 **서버 전용**. 브라우저·정적 페이지에 절대 노출하지 않는다(클라이언트엔 `anon` 키만).
- 정책은 `select` / `insert` / `update` / `delete`를 분리해서 각각 정의하고, `insert`엔 `with check`를 건다.

## 2. Egress 절약 — 필요한 것만 가져온다

Supabase는 전송량(egress)으로 과금·제한된다. 항상:

- **`select *` 금지.** 화면에 실제로 쓰는 컬럼만 지정:
  ```js
  // ❌ supabase.from('reviews').select('*')
  // ✅
  supabase.from('reviews').select('id, title, category, thumb_url, created_at')
  ```
- **페이지네이션 기본.** 목록은 항상 `.range()`(또는 keyset)로 페이지 크기를 제한한다. 무한정 전체 로드 금지:
  ```js
  supabase.from('reviews')
    .select('id, title, thumb_url')
    .order('created_at', { ascending: false })
    .range(0, 11)   // 12개씩
  ```
- 큰 본문(long text)·이미지 URL 목록은 목록 쿼리에서 빼고, 상세 진입 시에만 별도 조회한다.
- 카운트가 필요하면 `count: 'exact'`를 매번 부르지 말고 `'estimated'`/`'planned'`를 고려한다.
- 이미지는 Storage의 **transform(리사이즈) URL**로 썸네일을 받아 원본 전송량을 줄인다.

## 3. 파일·이미지는 Storage — DB에 base64 금지

- 이미지·PDF·영상 등 바이너리는 **Supabase Storage 버킷**에 올리고, DB에는 **경로/URL(text)만** 저장한다.
- **base64를 컬럼(text/jsonb)에 저장 금지.** 행이 비대해지고 egress·쿼리 성능이 망가진다.
- 버킷 정책:
  - 공개 노출용(메뉴·후기 사진)은 public 버킷 또는 signed URL.
  - 민감 파일은 private 버킷 + 짧은 만료의 signed URL.
- 업로드 시 파일명은 충돌 없게(예: `menu/<uuid>.webp`), 웹용으로 압축(webp/최적화)해서 올린다.

## 4. 민감정보는 암호화 컬럼

- **주민번호·계좌번호** 등 민감 식별정보는 평문 저장 금지. 암호화해서 보관한다.
  - `pgcrypto`(`pgp_sym_encrypt`/`pgp_sym_decrypt`) 또는 Supabase Vault로 처리하고, 키는 코드/리포에 넣지 않는다(환경변수·Vault).
  - 암호화 컬럼은 `bytea`로 저장하고, 복호화는 서버(service_role/RPC)에서만.
- 이런 컬럼은 **어떤 공개(anon) 정책에도 노출하지 않는다.** 화면 표시용은 마스킹값(예: 계좌 뒤 4자리)만 별도 컬럼/뷰로 제공.
- 애초에 **꼭 필요한 민감정보만 수집**한다 — 안 받아도 되면 컬럼 자체를 만들지 않는다.

## 셀프 체크(스키마·쿼리 쓰기 전/후)

1. 새 테이블에 `enable row level security` + 최소권한 정책 넣었는가?
2. 모든 select에 컬럼을 명시했는가(`*` 없음)? 목록에 `.range()` 있는가?
3. 파일은 Storage 경로만 저장하는가(base64 없음)?
4. 주민번호·계좌번호는 암호화 컬럼 + anon 미노출인가?
5. `service_role` 키가 클라이언트로 새지 않는가?
