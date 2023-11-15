.PHONY: build
build: ## build node container
	@docker build -t hub-docker.norsys.fr/ecole_du_dev/botsh:1.0 .

.PHONY: start
start: ## start project
	@docker run -p 49160:8080 --name="botsh" hub-docker.norsys.fr/ecole_du_dev/botsh:1.0

.PHONY: stop
stop: ## stop project
	@docker kill botsh;

.PHONY: restart
restart: stop build start
