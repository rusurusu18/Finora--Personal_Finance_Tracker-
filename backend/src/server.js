import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import { seedDefaultCategories } from "./module/category/category.service.js";
import { startRecurringTransactionScheduler } from "./module/transaction/recurringTransaction.scheduler.js";

const PORT = process.env.PORT || 5000;

async function start() {
  if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be set");
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set");
  }

  await seedDefaultCategories();

  startRecurringTransactionScheduler();

  app.listen(PORT, () => {
    console.log(`Finora API listening on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
