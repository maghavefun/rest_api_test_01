# Installation

## Clone the project

```bash
git clone https://github.com/maghavefun/rest_api_test_01.git
```

For start the application you should have docker and docker-compose
Here is the installation [tutorial](https://docs.docker.com/compose/install/).

Create .env file in project folder with the following content

```bash
BACKEND_PORT=8888

DB_USER=postgres
DB_PASS=postgres
DB_NAME=postgres
DB_HOST=sekvenia_test_db
DB_PORT=5340

NODE_ENV=dev
```

After adding env file run next command for starting project un docker container

```bash
docker-compose up -d
```

## Database connection

Also you can connect to database in docker container with command line or [DBeaver](https://dbeaver.io/). Make shure you using localhost instead of DB_HOST=sekvenia_test_db

## API testing

### You can test endpoint by importing postman endpoints collection via [link](https://api.postman.com/collections/18919361-cd30a34b-5a56-493d-aae2-0041ba42fb5d?access_key=PMAT-01HRJANKN8Q6M7J773WG7K7FNA).
