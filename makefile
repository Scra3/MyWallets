IMAGE_NAME:=mywallets
CONTAINER_NAME:=myWalletsContainer
IMAGE_SDK_NAME:=androidsdk
CONTAINER_SDK_NAME:=androidSdkContainer

.PHONY: help, test-unit, lint, run, debug, docker_build, docker_test, build, deploy, docker_build_android, docker_build_android_apk
.DEFAULT_GOAL := help

test: ## Run unit tests
	npm run test:unit

lint: ## Run eslint and stylelint
	npm run lint:fix ; npm run stylelint

run: ## Run app on android
	tns run android --log trace

build: ## Build app for android platform
	tns build android --copy-to .

deploy: ## Deploy the project to a connected physical or virtual device
	tns deploy android

debug: ## Run app in debug mode on android
	tns debug android

install: ## Install app
	npm install -g nativescript && npm install

devices: ## List devices
	tns devices

docker_build: ## Build Docker Image from Dockerfile to run lints and tests
	docker build -t $(IMAGE_NAME) .

docker_build_android: ## Build Docker Image from Dockerfile to build app
	docker build -t $(IMAGE_SDK_NAME) --file ./Dockerfiles/android.sdk.Dockerfile .

docker_build_android_apk: ## Build app for android platform from container
	@docker run -v "$(PWD):/usr/src/app" -it --rm --name $(CONTAINER_SDK_NAME) $(IMAGE_SDK_NAME) make build

docker_test: ## Run unit tests in container
	@docker run -v "$(PWD):/usr/src/app" -it --rm --name $(CONTAINER_NAME) $(IMAGE_NAME) make test

docker_lint: ## Run lint in container
	@docker run -v "$(PWD):/usr/src/app" -it --rm --name $(CONTAINER_NAME) $(IMAGE_NAME) make lint

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
