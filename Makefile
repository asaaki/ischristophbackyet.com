prod: publish

publish: ### production
	@wrangler publish --env production

preview: ### workers.dev
	@wrangler publish

dev:
	@wrangler dev

list-kv-ns:
	@wrangler kv:namespace list | jq

logs:
	@wrangler tail

format:
	@cd workers-site && npm run format
