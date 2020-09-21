# book-share-with-you

# Naver OAuth 적용

- passport, passport-naver 적용
- Naver Developer API 등록
  - 서비스 URL: http://localhost:3000/auth/naver
  - 네아로 Callback URL: http://localhost:3000/auth/naver/callback => passport NaverStrategy CallbackURL 과 반드시 일치하여야 한다!!
  - port번호 일치 문제로 인하여 고생을 많이 하였다...
