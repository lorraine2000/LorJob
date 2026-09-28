FROM oven/bun:1.2.10

RUN apt-get update && apt-get install -y libssl3 && apt-get clean

WORKDIR /jobi

COPY . .

RUN bun install

ENV NODE_ENV=production

RUN bun install && bun prisma:generate

RUN bun --cwd apps/api build

EXPOSE 1981

CMD ["bun", "run", "--cwd", "apps/api", "start"]
