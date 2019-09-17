# PubHub Proof-of-Concept

This project is built for the PubHub project in collaboration with the ETH Library, at the SEED 2019 conference.

## Disclaimer

This repository contains the first version of the PoC, which is not 100% open-source ready.
There may contain some important credentials for the simplicity and easiness of the development.
When deploying to the public, please create another repository and push the latest deploy-ready version there.

This project is created based on Validity Labs's Whitelabel Web App.

## Architecture
![](https://imgur.com/nz7a1UE.png)
<p align="center"><i><b>Figure 1</b> Architecture of PubHub</i></p>

## Setup

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

If there is error message regarding the node package `bcrypt`, the reason may come from the failure of rebuilding the package.

The solution is to rebuild the docker container.

```
docker-compose up -d --force-recreate
```

Sometimes there is no need to force recreate the entire docker container, only part of it (mostly it's the `api` container) needs to restart.

```
docker-compose restart api
```

To make sure that the api container works, listen to the logs.

```
docker-compose logs -f api
```

## Deployment

When deploying the `ipfs` container, please make sure that: 
1. The CORS config has been properly set up.
    ```json
    "API": {
            "HTTPHeaders": {
                "Access-Control-Allow-Methods": [
                    "PUT",
                    "GET",
                    "POST"
                ],
                "Access-Control-Allow-Origin": [
                    "*"
                ]
            }
        }
    ```
2. Add `"/ip4/0.0.0.0/tcp/8081/ws”` inside `Addresses.Swarm`
