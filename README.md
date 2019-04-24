# Validity Labs Whitelabel Web App

## Development setup

In order to setup your development environment, follow the following steps:

1. We require `docker` (https://www.docker.com/get-started) and `yarn` (https://yarnpkg.com/en/) to be installed on your system.
2. The currently supported versions of node and yarn are defined in .nvmrc and .yvmrc files. If you have nvm and yvm installed, you can just run `nvm install && nvm use && yvm use` from the project directory.
3. Install project dependencies by executing the following command in the root directory of the project:
   ```sh
   yarn
   ```
4. Login docker to GitLab:
   ```
   docker login registry.gitlab.com
   ```
5. Create and start docker containers:
   ```sh
   docker-compose up
   ```

Furthermore it's recommended to install the following vscode extensions:

- https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode
- https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin

## Development

The frontend is available under the following url: https://locahost:3001

If you pull commits from Gitlab and one of them contains changes to the package.json or yarn.lock, then it's necessary to run the following commands in the root folder of the repository:

```sh
yarn
docker-compose restart
```

Note that it is most of the time not required to rebuild the containers because the build scripts of the applications are executed while starting the containers and not during the build process.

## Docker containers

### API

#### Options

| Key                     | Description                                                                                                                                                                                                                   |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SSL_CERT`              | Path to the ssl certificate. (optional)                                                                                                                                                                                       |
| `SSL_KEY`               | Path to the private key of the ssl certificate. (optional)                                                                                                                                                                    |
| `JWK_PRIVATE_FILE_PATH` | Path to a JSON Web Key file (json) which contains the private key for signing JSON web tokens. A new key pair can be generated with the cli of the auth application by the following command: `node ./cli key:create <path>`  |
| `JWK_PUBLIC_FILE_PATH`  | Path to a JSON Web Key file (json) which contains the public key for verifying JSON web tokens. A new key pair can be generated with the cli of the auth application by the following command: `node ./cli key:create <path>` |
| `DB_HOST`               | Database host.                                                                                                                                                                                                                |
| `DB_PORT`               | Database port.                                                                                                                                                                                                                |
| `DB_NAME`               | Database name.                                                                                                                                                                                                                |
| `DB_USER`               | Database user.                                                                                                                                                                                                                |
| `DB_PASSWORD`           | Database password.                                                                                                                                                                                                            |
| `DB_SYNCHRONIZE`        | Indicates if database schema should be auto created on every application launch. Be careful with this option and don't use this in production - otherwise you can lose production data.                                       |
| `DB_LOGGING`            | Indicates if logging is enabled or not. If set to true then query and error logging will be enabled.                                                                                                                          |

### UI

#### Options

| Key                   | Description                                  |
| --------------------- | -------------------------------------------- |
| `APP_API_ENDPOINT`    | API Endpoint (URL without a trailing slash). |
| `APP_APPLICATION_ID`  | ID of the Application (e.g. "ui").           |
| `APP_INFURA_NODE_URL` | URL of the infura node.                      |

When using the development stage of the docker container, there are also the options of [Create React App](https://facebook.github.io/create-react-app/docs/advanced-configuration) available.

Please note that you must create custom environment variables beginning with APP\_. Any other variables will be ignored to avoid accidentally exposing a private key on the machine that could have the same name.

### MariaDB

MariaDB is accessible outside of the docker container. The credentials can be found in the docker-compose file.
The database is typically running on port 3306 on localhost.

Please consult the official documentation of the docker container for more details: https://hub.docker.com/_/mariadb
