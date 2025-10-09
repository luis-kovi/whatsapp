-- Execute este SQL no Supabase SQL Editor

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SUPERVISOR', 'AGENT');
CREATE TYPE "UserStatus" AS ENUM ('ONLINE', 'OFFLINE', 'AWAY');
CREATE TYPE "TicketStatus" AS ENUM ('PENDING', 'OPEN', 'CLOSED');
CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
CREATE TYPE "MessageStatus" AS ENUM ('PENDING', 'SENT', 'RECEIVED', 'READ', 'ERROR');
CREATE TYPE "DistributionMode" AS ENUM ('ROUND_ROBIN', 'LEAST_ACTIVE', 'LAST_AGENT', 'RANDOM');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'AGENT',
    "status" "UserStatus" NOT NULL DEFAULT 'OFFLINE',
    "avatar" TEXT,
    "maxTickets" INTEGER NOT NULL DEFAULT 5,
    "workSchedule" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "whatsapp_connections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DISCONNECTED',
    "qrCode" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "retries" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "contacts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL UNIQUE,
    "email" TEXT,
    "avatar" TEXT,
    "customFields" JSONB,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "queues" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "description" TEXT,
    "greetingMessage" TEXT,
    "outOfHoursMessage" TEXT,
    "workSchedule" JSONB,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "distributionMode" "DistributionMode" NOT NULL DEFAULT 'ROUND_ROBIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "queue_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "queueId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("userId", "queueId")
);

CREATE TABLE "tickets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contactId" TEXT NOT NULL,
    "userId" TEXT,
    "queueId" TEXT,
    "connectionId" TEXT NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "TicketPriority" NOT NULL DEFAULT 'MEDIUM',
    "unreadMessages" INTEGER NOT NULL DEFAULT 0,
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT,
    "connectionId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "mediaType" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "fromMe" BOOLEAN NOT NULL DEFAULT false,
    "status" "MessageStatus" NOT NULL DEFAULT 'PENDING',
    "quotedMessageId" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ticket_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ticketId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("ticketId", "tagId")
);

CREATE TABLE "contact_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contactId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("contactId", "tagId")
);

CREATE TABLE "quick_replies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shortcut" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "queueId" TEXT,
    "userId" TEXT,
    "isGlobal" BOOLEAN NOT NULL DEFAULT true,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "notes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ticketId" TEXT,
    "contactId" TEXT,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "transfers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ticketId" TEXT NOT NULL,
    "fromUserId" TEXT,
    "toUserId" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ratings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ticketId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "activities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL UNIQUE,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "chatbots" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "flowData" JSONB NOT NULL,
    "workSchedule" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "tickets_status_queueId_idx" ON "tickets"("status", "queueId");
CREATE INDEX "tickets_contactId_idx" ON "tickets"("contactId");
CREATE INDEX "messages_ticketId_idx" ON "messages"("ticketId");
CREATE INDEX "activities_userId_createdAt_idx" ON "activities"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "queue_users" ADD FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "queue_users" ADD FOREIGN KEY ("queueId") REFERENCES "queues"("id") ON DELETE CASCADE;
ALTER TABLE "tickets" ADD FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE;
ALTER TABLE "tickets" ADD FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL;
ALTER TABLE "tickets" ADD FOREIGN KEY ("queueId") REFERENCES "queues"("id") ON DELETE SET NULL;
ALTER TABLE "tickets" ADD FOREIGN KEY ("connectionId") REFERENCES "whatsapp_connections"("id") ON DELETE CASCADE;
ALTER TABLE "messages" ADD FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE;
ALTER TABLE "messages" ADD FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL;
ALTER TABLE "messages" ADD FOREIGN KEY ("connectionId") REFERENCES "whatsapp_connections"("id") ON DELETE CASCADE;
ALTER TABLE "messages" ADD FOREIGN KEY ("quotedMessageId") REFERENCES "messages"("id") ON DELETE SET NULL;
ALTER TABLE "ticket_tags" ADD FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE;
ALTER TABLE "ticket_tags" ADD FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE;
ALTER TABLE "contact_tags" ADD FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE;
ALTER TABLE "contact_tags" ADD FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE;
ALTER TABLE "quick_replies" ADD FOREIGN KEY ("queueId") REFERENCES "queues"("id") ON DELETE SET NULL;
ALTER TABLE "notes" ADD FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE;
ALTER TABLE "notes" ADD FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE;
ALTER TABLE "notes" ADD FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;
ALTER TABLE "transfers" ADD FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE;
ALTER TABLE "transfers" ADD FOREIGN KEY ("fromUserId") REFERENCES "users"("id") ON DELETE SET NULL;
ALTER TABLE "transfers" ADD FOREIGN KEY ("toUserId") REFERENCES "users"("id") ON DELETE SET NULL;
ALTER TABLE "ratings" ADD FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE;
ALTER TABLE "activities" ADD FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;

-- Seed: Criar usuário admin
INSERT INTO "users" (id, name, email, password, role, "maxTickets", "isActive")
VALUES (
  gen_random_uuid()::text,
  'Administrador',
  'admin@whatsapp.com',
  '$2a$10$rOiZ8qN8K5vY5Z5Z5Z5Z5.Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z',
  'ADMIN',
  10,
  true
);

-- Seed: Criar fila padrão
INSERT INTO "queues" (id, name, color, description, "greetingMessage")
VALUES (
  gen_random_uuid()::text,
  'Suporte',
  '#3b82f6',
  'Fila de suporte geral',
  'Olá! Bem-vindo ao nosso atendimento.'
);

-- Seed: Criar conexão WhatsApp padrão
INSERT INTO "whatsapp_connections" (id, name, status, "isDefault")
VALUES (
  gen_random_uuid()::text,
  'WhatsApp Principal',
  'DISCONNECTED',
  true
);
