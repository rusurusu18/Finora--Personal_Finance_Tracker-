CREATE TYPE "PaymentProvider" AS ENUM ('ESEWA', 'KHALTI');
CREATE TYPE "RecurrenceFrequency" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY');

ALTER TABLE "SubscriptionPayment"
ADD COLUMN "provider" "PaymentProvider" NOT NULL DEFAULT 'ESEWA',
ADD COLUMN "pidx" TEXT,
ALTER COLUMN "productCode" DROP NOT NULL;

CREATE UNIQUE INDEX "SubscriptionPayment_pidx_key" ON "SubscriptionPayment"("pidx");

ALTER TABLE "Transaction"
ADD COLUMN "recurringTransactionId" TEXT;

CREATE TABLE "RecurringTransaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "categoryId" TEXT,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "description" TEXT NOT NULL,
    "paymentSource" TEXT,
    "notes" TEXT,
    "frequency" "RecurrenceFrequency" NOT NULL,
    "interval" INTEGER NOT NULL DEFAULT 1,
    "startDate" TIMESTAMP(3) NOT NULL,
    "nextRunAt" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "lastRunAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RecurringTransaction_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Transaction_recurringTransactionId_date_key"
ON "Transaction"("recurringTransactionId", "date");

CREATE INDEX "RecurringTransaction_isActive_nextRunAt_idx"
ON "RecurringTransaction"("isActive", "nextRunAt");
CREATE INDEX "RecurringTransaction_userId_isActive_idx"
ON "RecurringTransaction"("userId", "isActive");

ALTER TABLE "RecurringTransaction"
ADD CONSTRAINT "RecurringTransaction_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RecurringTransaction"
ADD CONSTRAINT "RecurringTransaction_accountId_fkey"
FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "RecurringTransaction"
ADD CONSTRAINT "RecurringTransaction_categoryId_fkey"
FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Transaction"
ADD CONSTRAINT "Transaction_recurringTransactionId_fkey"
FOREIGN KEY ("recurringTransactionId") REFERENCES "RecurringTransaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
