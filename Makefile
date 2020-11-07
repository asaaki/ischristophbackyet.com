NR_NATIVE_METRICS_NO_BUILD = true

prod: publish

publish: ### production
	@wrangler publish --env production

preview: ### workers.dev
	@wrangler publish

dev:
	@wrangler dev

build:
	@wrangler build

list-kv-ns:
	@wrangler kv:namespace list | jq

logs:
	@wrangler tail

format:
	@cd workers-site && npm run format
