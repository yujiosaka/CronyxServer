DATABASES := mongodb redis mysql postgres

.PHONY: config start-% create-secret-% delete-secret-% deploy-% delete-%

config:  ## Copy .env.example to .env
	find kubernetes/ -name .env.example -exec sh -c 'cp $$0 $${0%.example}' {} \;

start-%:  ## Start dev server with % job store
	docker compose -f docker-compose.$*.yml up

create-secret-%: ## Create Secrets from .env file for % job store
	kubectl create secret generic cronyx-server-secret-$* \
		--from-env-file=./kubernetes/$*/.env \
		--dry-run=client -o yaml | kubectl apply -f -

delete-secret-%: ## Delete Secrets for % job store
	kubectl delete secret cronyx-server-secret-$*

deploy-%:  ## Deploy Kubernetes resources with % job store
	kubectl apply -f ./kubernetes/$*/

delete-%:  ## Delete Kubernetes resources with % job store
	kubectl delete -f ./kubernetes/$*/
