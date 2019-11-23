.PHONY: help, test-unit, lint, run, debug
.DEFAULT_GOAL := help

test-unit: ## Run unit tests
	npm run test:unit

lint: ## Run eslint and stylelint
	npm run lint:fix ; npm run stylelint

run: ## Run app on android
	tns run android

debug: ## Run app in debug mode on android
	tns debug android

install: ## Install app
	npm run install
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
