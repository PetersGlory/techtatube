import { DatabaseReader, DatabaseWriter } from "./_generated/server";

// Initialize your database with any required data
export async function initializeDatabase(db: DatabaseWriter) {
  // Example: Create initial system settings
  const existingSettings = await db
    .query("system_settings")
    .filter((q) => q.eq(q.field("key"), "initialized"))
    .first();

  if (!existingSettings) {
    await db.insert("system_settings", {
      key: "initialized",
      value: true,
      createdAt: Date.now(),
    });
  }
} 