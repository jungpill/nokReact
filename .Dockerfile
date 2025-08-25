FROM node:20-alpine AS build
WORKDIR /app

# package.json과 lock 파일만 먼저 복사 → 캐시 최적화
COPY package*.json ./
RUN npm ci

# 소스 복사 후 빌드
COPY . .
RUN npm run build

# 2) Final stage (정적 파일만 제공)
# 여기서는 Nginx를 쓸 수도 있지만, 너는 Flask에서 서빙할 거니까 dist만 뽑으면 됨
FROM alpine:3.19 AS export
WORKDIR /dist
COPY --from=build /app/dist ./