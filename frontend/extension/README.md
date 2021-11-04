# Extension을 개발자 모드로 실행하는 방법

### `npm i`

프로젝트를 clone한 후 CLI로 프로젝트 경로로 이동. 해당 명령어를 통해 필요한 node_modules를 설치한다.

<br>

### `npm run build`

모듈 설치가 끝나면 프로젝트를 build 한다.

<br>

### [chorme://extensions](chrome://extensions/)로 이동

크롬 익스텐션 사이트로 들어가 우측 상단에 있는 개발자 모드 스위치를 on 한다.
<img src="https://user-images.githubusercontent.com/24693833/140236263-0e9f837f-5c73-48cf-ba94-f30a80b23b92.png">

'압축해제된 확장 프로그램을 로드합니다.' 버튼을 클릭한다. 그리고 프로젝트의 build 파일을 선택한다.
![image](https://user-images.githubusercontent.com/24693833/140236489-6820db82-f354-46e8-b0cf-8763f61fe232.png)
