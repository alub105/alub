# :back: Backend

## :lollipop: local 개발 방법

- DB
  - MariaDB를 설치한 후, 다음 query를 수행한다.

	```sql
	CREATE DATABASE `alub`;
	CREATE USER 'a105'@'%' IDENTIFIED BY 'a1051234';
	GRANT ALL PRIVILEGES ON `alub`.* TO 'a105'@'%';
	```

