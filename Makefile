PROJECT = "Telegram-GPT"
IMAGE_NAME = "hanstanawi/telegram-gpt"

docker-build: ;@echo "Building and running ${PROJECT} docker image....."; \
  docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .

docker-run: ;@echo "Running ${PROJECT} docker container....."; \
  docker run --name ${PROJECT} -d ${IMAGE_NAME}:${IMAGE_TAG}

docker-up: ;@echo "Building and running ${PROJECT} containers....."; \
	docker compose up -d --build

docker-down: ;@echo "Shutting down ${PROJECT} containers....."; \
	docker compose down

docker-start: ;@echo "Starting ${PROJECT} containers....."; \
	docker compose start

docker-stop: ;@echo "Pausing ${PROJECT} containers....."; \
	docker compose stop

# need to wait 1 s for container to start
e2e-test-up: ;@echo "Running ${PROJECT} E2E tests environment....."; \
	pnpm db:test:up
	sleep 1 
	pnpm db:test:deploy

e2e-test-down: ;@echo "Shutting down ${PROJECT} E2E tests environment....."; \
	pnpm db:test:down