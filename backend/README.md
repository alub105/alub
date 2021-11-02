# :back: Backend

## :lollipop: local 개발 방법

### DB

- MariaDB를 설치한 후, 다음 query를 수행한다.

```sql
CREATE DATABASE `alub`;
CREATE USER 'a105'@'%' IDENTIFIED BY 'a1051234';
GRANT ALL PRIVILEGES ON `alub`.* TO 'a105'@'%';
```



### client-secret 적용

client-secret 적용 방법에는 2가지가 있다.

- 환경 변수 설정(STS)

  1. run -> Run Configurations -> Spring Boot App -> alub

  2. Environment -> Add -> 환경 변수 설정 -> OK -> Apply

     - Name: `GITHUB_CLIENT_SECRET` 

     - Value: `[github에서 발급 받은 client secrets]`

  <img src="https://user-images.githubusercontent.com/62821450/139608306-59e00734-e9e6-49d6-99ec-01a3f564eace.png" alt="image-20211101100756925" style="zoom:80%;" />

  

- IDE VM argument 설정(STS)

  1. 위의 1번과 동일

  2. Arguments -> VM arguments에 아래와 같이 작성 -> Apply

     ```
     -Dgithub.client-secret=[github에서 발급 받은 client secrets]
     ```

     <img src="https://user-images.githubusercontent.com/62821450/139608421-b6837c7d-40fe-41d2-984e-2100e7bd0fae.png" alt="set_client_secret" style="zoom: 80%;" />

