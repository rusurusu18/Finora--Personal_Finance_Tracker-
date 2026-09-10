// ==========================================
// SHARED CONSTANTS / ENUMS
// ==========================================

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
    { name: "Salary",     icon: "💼", color: "#22c55e" },
    { name: "Freelance",  icon: "💻", color: "#3b82f6" },
    { name: "Business",   icon: "🏪", color: "#f59e0b" },
    { name: "Investment", icon: "📈", color: "#8b5cf6" },
    { name: "Gift",       icon: "🎁", color: "#ec4899" },
    { name: "Other",      icon: "💰", color: "#64748b" }
];

export const DEFAULT_EXPENSE_CATEGORIES = [
    { name: "Food & Dining",    icon: "🍜", color: "#f97316" },
    { name: "Transport",        icon: "🚌", color: "#3b82f6" },
    { name: "Shopping",         icon: "🛍️", color: "#ec4899" },
    { name: "Utilities",        icon: "⚡", color: "#eab308" },
    { name: "Health",           icon: "🏥", color: "#ef4444" },
    { name: "Education",        icon: "📚", color: "#6366f1" },
    { name: "Entertainment",    icon: "🎬", color: "#8b5cf6" },
    { name: "Rent & Housing",   icon: "🏠", color: "#14b8a6" },
    { name: "Communication",    icon: "📱", color: "#06b6d4" },
    { name: "Personal Care",    icon: "🧴", color: "#f59e0b" },
    { name: "Travel",           icon: "✈️", color: "#0ea5e9" },
    { name: "Other",            icon: "📦", color: "#64748b" }
];
