<img src="https://user-images.githubusercontent.com/24693833/142531329-34337015-a738-4865-b077-284c36200d0d.png" style="width: 240px; "/>

🌱 깃허브 잔디 심기 서비스 ALUB


<br>

## 📝 프로젝트 소개

<strong>ALUB</strong>은 Algorithgm + GitHub의 줄임말로, 백준 같은 알고리즘 문제 사이트에서 문제를 제출하면 바로 GitHub 레포지토리에 푸쉬해주는 서비스입니다. 저희는 알고리즘 문제를 풀 때 문제를 복사하고, 커밋하고, 푸쉬하는 번거로운 과정을 줄이고 최대한 깃허브에 잔디를 많이 심는 것을 목표로 시작했습니다. ALUB은 익스텐션과 웹사이트 스터디 두 가지로 구성되어 있습니다.

<br>

<img src="https://user-images.githubusercontent.com/24693833/142546044-c9fe40e7-e0cc-45a5-a17a-848ad2f18aca.png" style="width: 600px"/>
<img src="https://user-images.githubusercontent.com/24693833/142548188-a50cee2c-a7cf-4724-a157-46a75892e001.png" style="width: 600px"/>
<img src="https://user-images.githubusercontent.com/24693833/142550682-fe8e8b40-1d6d-4701-9703-ee3540fde94e.png" style="width: 600px"/>

### 크롬 extension

[👩🏻‍💻 ALUB chrome extension 설치하기 ](https://chrome.google.com/webstore/detail/alub/joknofdeknbhkjfpmhleippabhejlagn?hl=ko)

| 문제만 물어도 깃에 커밋이 된다?

- 익스텐션을 설치하면 깃허브 계정으로 로그인 하고 깃허브 레포지토리를 생성 및 연동 합니다.
- 알고리즘 사이트 백준 에서 문제를 풀고 success면 commit 버튼이 생성됩니다.
- 깃허브에 문제를 푸쉬할 때 default/custom 설정을 할 수 있습니다.
  - default: 문제 번호로 코드 생성
  - custom: 문제 이름 지정 가능
- 백준을 풀 때도 실전처럼! 타이머 기능을 제공합니다.
  - extension에서 타이머가 보일지 아닐지 설정과, 기본 시간을 설정할 수 있습니다.
  - 시간이 초과되면 마이너스, 초과시간을 보여줍니다
  - 문제를 success하면 걸린 시간을 소스 코드 주석으로 기록합니다.

<br>

<img src="https://user-images.githubusercontent.com/24693833/142552122-e21ab889-eb19-43a8-821f-af8de6bff0a4.png" style="width: 500px"/>
<img src="https://user-images.githubusercontent.com/24693833/142552233-877bfc72-aef4-4f7e-b907-d77640e1b2bb.png" style="height: 500px" />
<img src="https://user-images.githubusercontent.com/24693833/142552843-48e0157e-3747-440d-8237-6a133240f510.png" style="width:700px;"/>

### 스터디 기능

[📚 스터디 웹사이트](https://alub.co.kr/)

- ALUB 익스텐션처럼 깃 레포지토리를 생성, 연동 할 수 있습니다.
- 멤버를 검색해 스터디 채널을 만들 수 있습니다.
- 백준에서 문제를 검색해 문제집을 생성할 수 있습니다.
- 과제 기간 내에 해당 문제를 풀면 코드가 복사, 붙여넣기 할 필요 없이 코드 비교 페이지에 바로 보여집니다.
- 멤버들의 문제 풀이 상황을 한눈에 확인할 수 있습니다.
- 멤버들의 코드를 한 곳에서 드래그 앤 드랍으로 쉽게 비교할 수 있습니다.
- 멤버들의 코드에 댓글을 달면 깃허브 issue로 연동 됩니다.

<br>

## ⚙️ 기술 스택

<img src="https://user-images.githubusercontent.com/24693833/142553273-eed7eb4b-6479-4896-bfc5-46d6c0aea607.png" style="width: 600px"/>

- 익스텐션 frontend
  - React, Typescript
- 웹사이트 frontend
  - React, Redux, scss, Utterances
- backend
  - spring boot, Maria DB
- 배포
  - aws, nginx, jenkins

<br>

## 👨‍👩‍👦‍👦 멤버 소개

<img src="https://user-images.githubusercontent.com/24693833/142554287-ce422707-2693-4e5f-b93f-c97505d57ecb.png" style="width: 600px;"/>

[✅ 팀 노션](https://www.notion.so/Alub-8103c3ee708145928f20bd10f7fdc8ee)

<br>

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
