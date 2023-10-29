# CronyxServer [![npm version](https://badge.fury.io/js/cronyx-server.svg)](https://badge.fury.io/js/cronyx-server) [![CI/CD](https://github.com/yujiosaka/CronyxServer/actions/workflows/ci_cd.yml/badge.svg)](https://github.com/yujiosaka/CronyxServer/actions/workflows/ci_cd.yml)

###### [Code of Conduct](https://github.com/yujiosaka/CronyxServer/blob/main/docs/CODE_OF_CONDUCT.md) | [Contributing](https://github.com/yujiosaka/CronyxServer/blob/main/docs/CONTRIBUTING.md) | [Changelog](https://github.com/yujiosaka/CronyxServer/blob/main/docs/CHANGELOG.md)

HTTP server for [Cronyx](https://github.com/yujiosaka/Cronyx), enabling seamless job scheduling across services via RESTful endpoints.

## 🌟 Features

<img src="https://github.com/yujiosaka/CronyxServer/assets/2261067/e7fbfaa7-204f-400c-8850-31a483d14ffc" alt="icon" width="300" align="right">

CronyxServer expands the capabilities of Cronyx, allowing its integration beyond the TypeScript ecosystem. Easily schedule tasks, monitor job life-cycles, and control job executions from any programming language.

### Why CronyxServer?

🌍 **Language Agnostic**: Built for Cronyx, a [TypeScript](https://www.typescriptlang.org/) project, CronyxServer paves the way for integration with any programming language including [Go](https://go.dev/), [Python](https://www.python.org/), [Rust](https://www.rust-lang.org/), and more.

📡 **RESTful API**: An intuitive API set that mirrors Cronyx's functions, making transitions seamless and intuitive.

🔒 **Scalable**: Start multiple servers under a load balancer and retain the exclusive lock feature, ensuring that only one instance of a job runs at any given time.

🔗 **Diverse Persistence Options**: Fully supports all persistence options offered by Cronyx, including [MongoDB](https://www.mongodb.com/), [Redis](https://redis.io/), [MySQL](https://www.mysql.com/), and [PostgreSQL](https://www.postgresql.org/). This ensures flexibility in choice and scalability in operations.

🐋 **Docker Support**: With an available image on [Docker Hub](https://hub.docker.com/r/yujiosaka/cronyx-server), setting up CronyxServer is a breeze.

⛓ **Kubernetes Ready**: Easily deployable configurations for [Kubernetes](https://kubernetes.io/) ensure that scaling with CronyxServer is seamless and efficient.

⚙️ **Bun-powered**: Developed on [Bun](https://bun.sh/), CronyxServer guarantees performant operations and an unparalleled developer experience.

### Embracing The Future

While Cronyx brought the world of script-based task scheduling to TypeScript users, CronyxServer opens the door for every developer, irrespective of their stack.

## 🚀 Getting Started

To utilize CronyxServer, follow the steps below:

### Installation

Simply invoke the server using `bunx`:

```sh
$ bunx cronyx-server
```

### Configuration

When using `bunx` or the provided [Docker image](https://hub.docker.com/r/yujiosaka/cronyx-server), configure your server using the following environment variables:

```sh
# Server's port
SERVER_PORT=3000

# Default timezone
TIMEZONE=UTC

# Job store's source (mongodb, redis, mysql, aurora-mysql, postgres or aurora-postgres)
JOB_STORE_SOURCE=

# Job store's URL (required for mongodb data store)
JOB_STORE_URL=

# Job store's options
JOB_STORE_OPTIONS=

# Basic authentication's user name
BASIC_AUTH_USERNAME=

# Basic authentication's password
BASIC_AUTH_PASSWORD=
```

#### JOB_STORE_SOURCE

`JOB_STORE_OPTIONS` allows for detailed configuration of your chosen persistence store. When specifying `JOB_STORE_OPTIONS`, ensure your input string is a valid JSON format.

##### MongoDB

When using MongoDB, `JOB_STORE_OPTIONS` expects options compatible with the [ConnectOptions](https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connection-options/) parameter.

**Example:**

```sh
JOB_STORE_OPTIONS='{"useNewUrlParser": true, "useUnifiedTopology": true}'
```

##### Redis

For Redis, the configuration is expected to align with [RedisClientOptions](https://github.com/redis/node-redis/blob/master/docs/client-configuration.md).

**Example:**

```sh
JOB_STORE_OPTIONS='{"host": "127.0.0.1", "port": 6379}'
```

##### MySQL and Postgres

CronyxServer utilizes [TypeORM](https://typeorm.io/) for MySQL and PostgreSQL. Accordingly, the configuration for these databases follows TypeORM's respective options:

- For MySQL, use [MysqlConnectionOptions](https://typeorm.delightful.studio/interfaces/_driver_mysql_mysqlconnectionoptions_.mysqlconnectionoptions.html).
- For Postgres, use [PostgresConnectionOptions](https://typeorm.delightful.studio/interfaces/_driver_postgres_postgresconnectionoptions_.postgresconnectionoptions).

**Example for Postgres:**

```sh
JOB_STORE_OPTIONS='{"type": "postgres", "username": "postgres", "password": "postgres"}'
```

### Basic Usage

**Schedule a Job**

Equivalent to [requestJobStart](https://github.com/yujiosaka/Cronyx/blob/main/docs/API.md#requestjobstart):

```sh
$ curl -X POST http://localhost:3000/{{jobName}} \
    --header 'Content-Type: application/json' \
    --data-raw '{ "jobInterval": "* * * * * *" }'
```

**Finish a Job**

Equivalent to [finish](https://github.com/yujiosaka/Cronyx/blob/main/docs/API.md#finish):

```sh
$ curl -X PUT http://localhost:3000/{{jobName}}/{{jobId}}/finish \
    --header 'Content-Type: application/json
```

**Interrupt a Job**

Equivalent to [interrupt](https://github.com/yujiosaka/Cronyx/blob/main/docs/API.md#interrupt):

```sh
$ curl -X PUT http://localhost:3000/{{jobName}}/{{jobId}}/interrupt \
    --header 'Content-Type: application/json'
```

## 💻 Development

One of the advantages of CronyxServer is its support for various data persistence options, such as MongoDB, Redis, MySQL, and PostgreSQL. To streamline the local development setup for each data source, specific Docker Compose configurations are available.

You don't have to manage them directly, as simplified `make` commands have been provided for convenience. Here's how you can use them:

```sh
$ make start-mongodb
```

Similarly, for other databases, replace `mongodb` with `redis`, `mysql`, or `postgres`.

This command runs the appropriate Docker Compose configuration for the chosen database, setting up the environment tailored to that specific database.

## 🚢 Local Deployment

To deploy the services locally, follow the steps below:

### Configuration

Create a `.env` file from the `.env.example` file for each data source. This can be achieved by running:

```sh
make config
```

This command will copy `.env.example` to `.env` for all supported databases, namely MongoDB, Redis, MySQL, and PostgreSQL.

### Create Secrets

Use the following command to create Kubernetes Secrets. For MongoDB:

```sh
make create-secret-mongodb
```

Replace `mongodb` with `redis`, `mysql`, or `postgres` as needed.

### Deploy to Kubernetes

To deploy the services to Kubernetes, use the following command. For MongoDB:

```sh
make deploy-mongodb
```

Again, replace `mongodb` with `redis`, `mysql`, or `postgres` as required.

Make sure you have a compatible version of Kubernetes running. The project has been tested and verified with Kubernetes version `1.25.4`. You can check your Kubernetes version using the following command:

```sh
kubectl version
```

### Accessing Services

To access the deployed services, use the following command to get the list of services and their corresponding URLs:

```sh
kubectl get services
```

To check the availability of the service, you can access the health check endpoint at http://localhost:3000/healthcheck.

### Cleaning Up

To delete all the deployed resources, use the following command. For MongoDB:

```sh
make delete-mongodb
```

Replace `mongodb` with `redis`, `mysql`, or `postgres` depending on which one you've deployed.

### Docker Hub Repository

Docker images for this project are available in the [Docker Hub repository](https://hub.docker.com/r/yujiosaka/cronyx-server). You can find suitable images for different versions or tags of the CronyxServer application.

## 🐞 Debugging tips

### Enable debug logging

Job status changes are logged via the [debug](https://github.com/visionmedia/debug) module under the `cronyx:server` namespace.

```sh
env DEBUG="cronyx:server" bunx cronyx-server
```

## 💳 License

This project is licensed under the MIT License. See [LICENSE](https://github.com/yujiosaka/CronyxServer/blob/main/LICENSE) for details.

## 🤔 FAQ

### How is CronyxServer different from services like Airflow or Dagster?

While [Airflow](https://airflow.apache.org/) and [Dagster](https://dagster.io/) are fantastic tools tailored primarily for the needs of data scientists and MLOps professionals, CronyxServer offer a different niche. These key differences set them apart:

- **Audience & Language**: Airflow and Dagster are primarily built around Python users, especially suiting MLOps tasks. In contrast, Cronyx is language-agnostic, with its server variant opening the door for any language integration.

- **Task Focus**: While Airflow and Dagster often cater to ML pipelines, Cronyx and CronyxServer are optimized for developer-centric tasks, such as aggregation pipelines.

- **Developer Experience**: Cronyx emphasizes a seamless developer experience. There's no need to switch between a web UI and code. With Cronyx and CronyxServer, configurations are code-centric, which can enhance productivity by keeping everything in one place.

Remember, the best tool always depends on the specific use-case. CronyxServer offers a developer-focused approach to task scheduling, while tools like Airflow and Dagster cater to a more data-driven audience.
