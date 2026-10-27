# ==========================================
# GIAI ĐOẠN 1: Cài đặt dependencies và Prisma Client
# ==========================================
FROM node:20-alpine AS deps
WORKDIR /app

# Cài đặt OpenSSL và libc6-compat cần thiết cho Prisma Engine trên Alpine Linux
RUN apk add --no-cache openssl libc6-compat

# Copy package manifests và thư mục prisma
COPY package*.json ./
COPY prisma ./prisma/

# Cài đặt toàn bộ dependencies (kể cả devDependencies để phục vụ biên dịch)
RUN npm ci

# Sinh mã Prisma Client tương thích với môi trường Alpine Linux
RUN npx prisma generate

# ==========================================
# GIAI ĐOẠN 2: Biên dịch NestJS TypeScript
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Biên dịch mã nguồn sang thư mục /dist (sinh dist/main.js)
RUN npm run build

# Loại bỏ devDependencies, chỉ giữ lại production dependencies
RUN npm prune --production

# ==========================================
# GIAI ĐOẠN 3: Runtime Production tối giản
# ==========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN apk add --no-cache openssl

# Tạo người dùng không đặc quyền (non-root) để tăng tính an toàn
RUN addgroup --system --gid 1001 nestgroup && \
    adduser --system --uid 1001 nestuser

# Sao chép các tệp cần thiết từ builder và deps
COPY --from=builder --chown=nestuser:nestgroup /app/dist ./dist
COPY --from=builder --chown=nestuser:nestgroup /app/node_modules ./node_modules
COPY --from=deps --chown=nestuser:nestgroup /app/prisma ./prisma
COPY --from=deps --chown=nestuser:nestgroup /app/package*.json ./

USER nestuser

EXPOSE 8000

CMD ["node", "dist/main"]
