
export const ROLES = Object.freeze({
    USER : "USER",
    ADMIN: "ADMIN"
});

export const ACCOUNT_TYPES = Object.freeze({
    BANK  : "BANK",
    WALLET: "WALLET",
    CASH  : "CASH"
});

export const TRANSACTION_TYPES = Object.freeze({
    INCOME  : "INCOME",
    EXPENSE : "EXPENSE",
    TRANSFER: "TRANSFER"
});

export const BUDGET_PERIODS = Object.freeze({
    WEEKLY : "WEEKLY",
    MONTHLY: "MONTHLY",
    YEARLY : "YEARLY"
});

export const GOAL_STATUSES = Object.freeze({
    ACTIVE   : "ACTIVE",
    COMPLETED: "COMPLETED",
    PAUSED   : "PAUSED"
});

export const CATEGORY_TYPES = Object.freeze({
    INCOME : "INCOME",
    EXPENSE: "EXPENSE"
});

export const NOTIFICATION_TYPES = Object.freeze({
    INFO   : "INFO",
    SUCCESS: "SUCCESS",
    WARNING: "WARNING",
    ERROR  : "ERROR"
});


// ── Default system categories ──────────────

export const DEFAULT_INCOME_CATEGORIES = [
    { name: "Salary",     icon: "FiBriefcase", color: "#22c55e" },
    { name: "Freelance",  icon: "FiCode", color: "#3b82f6" },
    { name: "Business",   icon: "FiShoppingBag", color: "#f59e0b" },
    { name: "Investment", icon: "FiTrendingUp", color: "#8b5cf6" },
    { name: "Gift",       icon: "FiGift", color: "#ec4899" },
    { name: "Other",      icon: "FiDollarSign", color: "#64748b" }
];

export const DEFAULT_EXPENSE_CATEGORIES = [
    { name: "Food & Dining",    icon: "FiCoffee", color: "#f97316" },
    { name: "Transport",        icon: "FiTruck", color: "#3b82f6" },
    { name: "Shopping",         icon: "FiShoppingBag", color: "#ec4899" },
    { name: "Utilities",        icon: "FiZap", color: "#eab308" },
    { name: "Health",           icon: "FiHeart", color: "#ef4444" },
    { name: "Education",        icon: "FiBookOpen", color: "#6366f1" },
    { name: "Entertainment",    icon: "FiFilm", color: "#8b5cf6" },
    { name: "Rent & Housing",   icon: "FiHome", color: "#14b8a6" },
    { name: "Communication",    icon: "FiSmartphone", color: "#06b6d4" },
    { name: "Personal Care",    icon: "FiDroplet", color: "#f59e0b" },
    { name: "Travel",           icon: "FiMap", color: "#0ea5e9" },
    { name: "Other",            icon: "FiPackage", color: "#64748b" }
];
