IMAGE_NAME:=mywallets
CONTAINER_NAME:=myWalletsContainer
IMAGE_SDK_NAME:=androidsdk
CONTAINER_SDK_NAME:=androidSdkContainer

.PHONY: help, lint, run, end_to_end, end_to_end_old_api, end_to_end_ipad, tests, debug, docker_build, docker_test, build, deploy, docker_build_android, docker_build_android_apk
.DEFAULT_GOAL := help

tests: ## Run unit tests and e2e tests
	make test && make end_to_end

test: ## Run unit tests
	npm run test:unit

end_to_end: ## Run end to end tests
	npm run e2e -- --runType=androidPixel

end_to_end_old_api: ## Run end to end tests on old api
	npm run e2e -- --runType=nexusOne

end_to_end_ipad: ## Run end to end tests on Ipad format and new API
	npm run e2e -- --runType=ipad

lint: ## Run eslint and stylelint
	npm run lint:fix ; npm run stylelint

run: ## Run app on android
	tns run android

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

docker_build_android: ## Build Docker Image from android Dockerfile to build app
	docker build -t $(IMAGE_SDK_NAME) --file ./dockerfiles/android.sdk.Dockerfile .

docker_build_android_apk: ## Build app for android platform from container
	@docker run -v "$(PWD):/usr/src/app" -it --rm --name $(CONTAINER_SDK_NAME) $(IMAGE_SDK_NAME) make build

docker_test: ## Run unit tests in container
	@docker run -v "$(PWD):/usr/src/app" -it --rm --name $(CONTAINER_NAME) $(IMAGE_NAME) make test

docker_lint: ## Run lint in container
	@docker run -v "$(PWD):/usr/src/app" -it --rm --name $(CONTAINER_NAME) $(IMAGE_NAME) make lint

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
