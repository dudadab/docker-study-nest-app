import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const notesTable = pgTable('notes', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type NoteRecord = typeof notesTable.$inferSelect;
export type NewNoteRecord = typeof notesTable.$inferInsert;
