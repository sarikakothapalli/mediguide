import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// User profile table for health information
export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull().unique(),
  age: int("age"),
  bloodGroup: varchar("blood_group", { length: 10 }),
  allergies: text("allergies"),
  chronicConditions: text("chronic_conditions"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

// Symptom check history table
export const symptomChecks = mysqlTable("symptom_checks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id"),
  symptom: varchar("symptom", { length: 255 }).notNull(),
  onset: varchar("onset", { length: 50 }).notNull(),
  duration: varchar("duration", { length: 50 }).notNull(),
  associatedSymptoms: text("associated_symptoms"),
  painScale: int("pain_scale"),
  severity: mysqlEnum("severity", ["mild", "moderate", "severe", "critical"]).notNull(),
  specialty: varchar("specialty", { length: 100 }),
  redFlags: text("red_flags"),
  reasoning: text("reasoning"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type SymptomCheck = typeof symptomChecks.$inferSelect;
export type InsertSymptomCheck = typeof symptomChecks.$inferInsert;

// Health flags for filtering seasonal advisories
export const healthFlags = mysqlTable("health_flags", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  flagName: varchar("flag_name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type HealthFlag = typeof healthFlags.$inferSelect;
export type InsertHealthFlag = typeof healthFlags.$inferInsert;