# Alub

## 프로젝트 기획 

1. 크롬 extension

   1. 알고리즘 사이트(백준/프로그래머스 등)에서 문제 풀어서 success면 github 자동/수동 commit
      - 처음 success는 무조건 새 파일로 커밋
      - 다음 success부터  'overwrite(덮어쓰기)' 또는 '다른 이름으로 파일 저장하여 commit' 버튼 선택할 수 있게
   2. fail나면 다른 사람 풀이 본 뒤 며칠 뒤 다시 풀어보라고 noti(크롬 익스텐션)
      - 크롬 알람 API
   3. 시간 측정 기능(chrome extension)
      - 크롬 알람 API
      - 성공하면 문제푸는데 걸린 시간 기록
      - 타이머가 끝나면 noti
      - 시간이 초과되면 마이너스, 초과시간을 보여주기

2. 스터디 기능

   1. 동일한 문제에 대한 스터디원들의 풀이를 한 페이지에서 비교 

      (e.g. https://my-app.com/{teamname}/solved/boj/21234 요런식으로 접속하면 해당 페이지에서 확인 가능)

   2. 깃허브에 데이터가 많이 남도록

   3. 코드를 올리면 잔디가 심기게(commit 되게)

   4. api를 사용해서 issue에 댓글이 달리게 (utterances)

      - utterances를 사용하면 자동 마크다운 형식
      - 문제점: 댓글 수정을 바로 할 수 있게 해야 함

   5. 로그인 기능

      - 플러그인에서 로그인 하면 스터디 사이트에서도 자동 로그인 되게
      - 반대도 마찬가지

## Dockerization 방법
docker buildkit을 위해 `docker/dockerfile:1` 이미지를 미리 pull 합니다.
```sh
docker pull docker/dockerfile:1
```

<br>

backend와 frontend를 dockerizing합니다.
```sh
DOCKER_BUILDKIT=1 docker build -t ${REGISTRY}/alub/backend:${VERSION} --target prod ./backend
DOCKER_BUILDKIT=1 docker build -t ${REGISTRY}/alub/nginx:${VERSION} --target prod ./frontend/web
```

## Container registry로의 push

push할 Container registry에 login합니다.
```sh
docker login ${REGISTRY}
Username: 
Password: 
```

<br>

Container registry에 dockerizing한 이미지를 push합니다.
```sh
docker push ${REGISTRY}/alub/backend:${VERSION}
docker push ${REGISTRY}/alub/nginx:${VERSION}
```

## app 서버 구축 및 app 실행 방법
먼저, Docker와 Docker Compose가 설치되어 있어야 합니다.

<br>

root directory를 생성 및 이동합니다(root directory를 `~/alub`으로 하겠습니다).
```sh
mkdir ~/alub
cd ~/alub
```

<br>

project의 다음 파일을 root directory로 복사합니다.
- [docker-compose.yml](./docker-compose.yml)
- [init-letsencrypt.sh](./init-letsencrypt.sh)
- [nginx/default.conf.template](nginx/default.conf.template)


<br>

docker compose와 certbot을 실행하기 위해서는 `.env` 파일이 필요합니다. `.env`의 항목은 다음과 같습니다.
```env
REGISTRY=repo.treescale.com
APP_DOMAIN=my-app.com
LETSENCRYPT_EMAIL=example@email.com

# mysql
MYSQL_USER=myuser
MYSQL_PASSWORD=mypassword
MYSQL_ROOT_PASSWORD=myrootpassword
MYSQL_DATABASE=mydb

# backend
GITHUB_CLIENT_ID=1q2w3e4r
GITHUB_CLIENT_SECRET=1q2w3e4r1q2w3e4r
SPRING_DATASOURCE_USERNAME=${MYSQL_USER}
SPRING_DATASOURCE_PASSWORD=${MYSQL_PASSWORD}
JWT_SECRET=1q2w3e4r

# mysql, backend, nginx
TZ=Asia/Seoul
```

<br>

**root** 권한으로 [init-letsencrypt.sh](./init-letsencrypt.sh)을 실행시켜 certbot에 의해 SSL/TLS 인증서를 생성하도록 해야 합니다.
```sh
sudo ./init-letsencrypt.sh
```

<br>

docker compose를 통해 application을 실행합니다.
```sh
docker-compose up -d
```


## 자동 배포
[auto-deploy.yml](.github/workflows/auto-deploy.yml)에 의해 자동으로 배포가 이루어 집니다.

### github secrets 설정
프로젝트의 `Settings > Secrets`에서 다음 항목에 대한 secrets 등록이 필요합니다.
```env
HOST : 10.11.12.13
REGISTRY : repo.treescale.com
REGISTRY_PASSWORD : registrypass
REGISTRY_USERNAME : registryuser
SSH_PORT : 22
SSH_PRIVATE_KEY : -----BEGIN OPENSSH PRIVATE KEY----- ~~
SSH_USERNAME : sshuser
```

### 과정
- build-images
  - bild images
  - upload artifacts(images) to share between jobs
- deploy
  - download artifacts(built images)
  - login remote registry
  - copy files using ssh(scp)
  - execute docker compose using ssh
