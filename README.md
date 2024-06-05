# SoftBackend

## Requirements dev

- **node.js**
- **pnpm**
- **docker**

## Requirements infrastructure

- **RabbitMQ** - As queue for messages
-- https://www.cloudamqp.com
- **MongoDB** - As database
-- https://www.mongodb.com
- **AWS Space Bucket** - For store files
-- https://www.digitalocean.com
- **DigitalOcean** - For deploy
-- https://www.digitalocean.com
- **AWS SES** - For mail sending
-- https://www.mailersend.com/
- **Apitally** - For monitoring
-- https://app.apitally.io

## Build and local run

- copy `.env.template` to `.env.local`
- fill `.env.local`
- run `mkdir https`
- run `mkcert -install -cert-file ./https/fastify.cert -key-file ./https/fastify.key localhost`
- run `pnpm run build`
- run `pnpm start`

## Deploy

- you need to insert env variables in CI/CD github secrets
- ci /cd make docker image and push to registry after all merge to master
- you can use this image for digitalocean app platform

## Metrics

- all data is on https://app.apitally.io