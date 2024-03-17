# 🥼MEcommerce

![Macbook Pro - Light Background](https://github.com/yhj0217/MEcommerce/assets/112550610/df392d3d-4088-4787-b649-aab2b91a27cb)

## 🕶️ 서비스 이용하기

[MEcommerce](https://mecommerce-shop.vercel.app)

```
🛍️ 판매자 테스트 계정
ID : sell@test.com / sell1@test.com
PW : zzzz1234!

💸 구매자 테스트 계정
ID : buyer@test.com
PW : zzzz1234!
```

## 👖 프로젝트 소개

- 머리부터 발끝까지! 모자, 옷, 액세서리, 신발을 모두 구매할 수 있는 쇼핑몰 사이트입니다.

## 👟 주요 기능

- 로그인 / 로그아웃 / 회원가입
- 홈 / 카테고리 / 카테고리별 상품 상세
- 판매 상품 등록 / 등록 상품 전체 조회 / 수정 / 삭제
- 상품 장바구니 추가 / 수정 / 삭제
- 장바구니 내 상품 주문 / 결제
- 구매 내역 / 구매 취소
- 판매 내역 / 판매 상태 변경

## 🧣 사용 기술

<img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black">
<img src="https://img.shields.io/badge/reactquery-FF4154?style=for-the-badge&logo=reactquery&logoColor=white">
<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
<img src="https://img.shields.io/badge/firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white">
<img src="https://img.shields.io/badge/vite-646CFF?style=for-the-badge&logo=vite&logoColor=white">
<img src="https://img.shields.io/badge/tailwindcss-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white">
<img src="https://img.shields.io/badge/shadcnui-000000?style=for-the-badge&logo=shadcnui&logoColor=white">
<img src="https://img.shields.io/badge/vercel-111111?style=for-the-badge&logo=vercel&logoColor=white">

## 💍 서비스 아키텍처

![structure](https://github.com/yhj0217/MEcommerce/assets/112550610/f76172f1-9267-4689-a2a6-1eb11d0850d7)

## 👓 프로젝트 구조

```
📦MEcommrece
 ┣ 📂public
 ┣ 📂src
 ┃ ┣ 📂assets
 ┃ ┃ ┣📜invisible.svg
 ┃ ┃ ┣ 📜MEcommerce.webp
 ┃ ┃ ┣ 📜react.svg
 ┃ ┃ ┗ 📜visible.svg
 ┃ ┣ 📂components
 ┃ ┃ ┣ 📂Cart
 ┃ ┃ ┃ ┣ 📜CartContents.tsx
 ┃ ┃ ┃ ┗ 📜CartMenu.tsx
 ┃ ┃ ┣ 📂Category
 ┃ ┃ ┃ ┣ 📜CategoryCard.tsx
 ┃ ┃ ┃ ┣ 📜CategoryCarousel.tsx
 ┃ ┃ ┃ ┗ 📜CategoryList.tsx
 ┃ ┃ ┣ 📂NavBar
 ┃ ┃ ┃ ┗ 📜NavBar.tsx
 ┃ ┃ ┣ 📂Product
 ┃ ┃ ┃ ┣ 📜ImageCarousel.tsx
 ┃ ┃ ┃ ┗ 📜ProductCard.tsx
 ┃ ┃ ┣ 📂types
 ┃ ┃ ┃ ┗ 📜Iamport.d.ts
 ┃ ┃ ┣ 📂ui
 ┃ ┃ ┃ ┣ 📜alert-dialog.tsx
 ┃ ┃ ┃ ┣ 📜alert.tsx
 ┃ ┃ ┃ ┣ 📜button.tsx
 ┃ ┃ ┃ ┣ 📜card.tsx
 ┃ ┃ ┃ ┣ 📜carousel.tsx
 ┃ ┃ ┃ ┣ 📜input.tsx
 ┃ ┃ ┃ ┣ 📜label.tsx
 ┃ ┃ ┃ ┣ 📜navigation-menu.tsx
 ┃ ┃ ┃ ┣ 📜select.tsx
 ┃ ┃ ┃ ┣ 📜sheet.tsx
 ┃ ┃ ┃ ┣ 📜table.tsx
 ┃ ┃ ┃ ┣ 📜toggle-group.tsx
 ┃ ┃ ┃ ┗ 📜toggle.tsx
 ┃ ┣ 📂context
 ┃ ┃ ┣ 📜AuthContext.tsx
 ┃ ┃ ┗ 📜CartContext.tsx
 ┃ ┣ 📂interface
 ┃ ┃ ┣ 📜Cart.ts
 ┃ ┃ ┣ 📜Order.ts
 ┃ ┃ ┗ 📜Product.ts
 ┃ ┣ 📂lib
 ┃ ┃ ┗ 📜utils.ts
 ┃ ┣ 📂pages
 ┃ ┃ ┣ 📜Categories.tsx
 ┃ ┃ ┣ 📜Home.tsx
 ┃ ┃ ┣ 📜Login.tsx
 ┃ ┃ ┣ 📜MyPage.tsx
 ┃ ┃ ┣ 📜Order.tsx
 ┃ ┃ ┣ 📜OrderDetail.tsx
 ┃ ┃ ┣ 📜OrderHistory.tsx
 ┃ ┃ ┣ 📜ProductInfo.tsx
 ┃ ┃ ┣ 📜ProductList.tsx
 ┃ ┃ ┣ 📜ProductManage.tsx
 ┃ ┃ ┣ 📜ProductUpload.tsx
 ┃ ┃ ┣ 📜SalesManage.tsx
 ┃ ┃ ┗ 📜SignUp.tsx
 ┃ ┣ 📂routes
 ┃ ┃ ┗ 📜Router.tsx
 ┃ ┣ 📜App.css
 ┃ ┣ 📜App.tsx
 ┃ ┣ 📜firebase.ts
 ┃ ┣ 📜index.css
 ┃ ┣ 📜main.tsx
 ┗ ┗ 📜vite-env.d.ts
```

## 🦺 트러블 슈팅
