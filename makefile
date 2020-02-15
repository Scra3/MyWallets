IMAGE_NAME:=mywallets
CONTAINER_NAME:=myWalletsContainer

.PHONY: help, test-unit, lint, run, debug, docker_build, docker_test
.DEFAULT_GOAL := help

test: ## Run unit tests
	npm run test:unit

lint: ## Run eslint and stylelint
	npm run lint:fix ; npm run stylelint

run: ## Run app on android
	tns run android --log trace

deploy: ## Deploy the project to a connected physical or virtual device
	tns deploy android

debug: ## Run app in debug mode on android
	tns debug android

install: ## Install app
	npm install

devices: ## List devices
	tns devices

docker_build: ## build Docker Image from Dockerfile
	docker build -t $(IMAGE_NAME) .

docker_test: ## Run unit tests in Docker container
	@docker run -v "$(PWD):/usr/src/app" -it --rm --name $(CONTAINER_NAME) $(IMAGE_NAME) make test

docker_lint: ## Run lint in Docker container
	@docker run -v "$(PWD):/usr/src/app" -it --rm --name $(CONTAINER_NAME) $(IMAGE_NAME) make lint

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
