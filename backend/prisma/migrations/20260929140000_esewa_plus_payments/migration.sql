CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETE', 'FAILED');

ALTER TABLE "User"
ADD COLUMN "subscriptionTier" TEXT NOT NULL DEFAULT 'FREE',
ADD COLUMN "subscriptionExpiresAt" TIMESTAMP(3);

CREATE TABLE "SubscriptionPayment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "transactionUuid" TEXT NOT NULL,
    "productCode" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "SubscriptionPayment_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SubscriptionPayment_transactionUuid_key" ON "SubscriptionPayment"("transactionUuid");
CREATE INDEX "SubscriptionPayment_userId_status_idx" ON "SubscriptionPayment"("userId", "status");

ALTER TABLE "SubscriptionPayment"
ADD CONSTRAINT "SubscriptionPayment_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;