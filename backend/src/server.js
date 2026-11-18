import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import { seedDefaultCategories } from "./module/category/category.service.js";
import { startRecurringTransactionScheduler } from "./module/transaction/recurringTransaction.scheduler.js";

const PORT = process.env.PORT || 5000;

async function start() {
  // Authentication cannot start safely when either JWT secret is missing.
  if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be set");
  }

  // The database connection is required before the application initializes.
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set");
  }

  // Ensure default categories exist before handling requests.
  await seedDefaultCategories();

  // Process due recurring transactions independently of incoming requests.
  startRecurringTransactionScheduler();

  app.listen(PORT, () => {
    console.log(`Finora API listening on http://localhost:${PORT}`);
  });
}

// Stop the process cleanly if startup validation or initialization fails.
start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
