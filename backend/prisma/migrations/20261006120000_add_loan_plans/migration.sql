CREATE TABLE "LoanPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "principal" DECIMAL(15,2) NOT NULL,
    "annualInterestRate" DECIMAL(7,4) NOT NULL,
    "termMonths" INTEGER NOT NULL,
    "monthlyPayment" DECIMAL(15,2) NOT NULL,
    "totalPayment" DECIMAL(15,2) NOT NULL,
    "totalInterest" DECIMAL(15,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "LoanPlan_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "LoanPlan_userId_createdAt_idx" ON "LoanPlan"("userId", "createdAt");

ALTER TABLE "LoanPlan"
ADD CONSTRAINT "LoanPlan_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
