# book-share-with-you

# Naver OAuth 적용

- passport, passport-naver 적용
- Naver Developer API 등록
  - 서비스 URL: http://localhost:3000/auth/naver
  - 네아로 Callback URL: http://localhost:3000/auth/naver/callback => passport NaverStrategy CallbackURL 과 반드시 일치하여야 한다!!
  - port번호 일치 문제로 인하여 고생을 많이 하였다...
  - NaverStrategy 에서 clientSecret 을 ClientSecret으로 대문자로 써두어서 clientSecret 이 없어서 계속 Authentication Error가 나는 것이었다.
  - passport-naver 에서는 계속 500 Internal Error를 띄워서 도대체 무엇이 문제인지 발견하기 어려웠다. 결국 passport library에서 이곳 저곳에 console.log 를 찍어가며 server로부터의 result값을 보아 에러메시지를 토대로 수정할 수 있었다.
  - express에서 router는 다른 middleware보다 항상 마지막에 와야한다. 안그러면 아래에 있는 middleware를 거치지 않고 route로 가버리기 때문

To Do List

- flash 적용
- authorized User에 대한 Personalization
- social login, local login 모두 통합하여 관리하게끔 verifyUser 수정
- Serialization, Deserialization 수정
- password === password2 체크 db validation 으로 변경하기
-
