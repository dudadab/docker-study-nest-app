import { Injectable, NotFoundException } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { uuidv7 } from 'uuidv7';
import type { CreateNoteDto, UpdateNoteDto } from './note.dto';
import { DatabaseService } from '../database/database.service';
import { notesTable, type NewNoteRecord, type NoteRecord } from '../database/schema';

@Injectable()
export class NotesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async findAll(): Promise<NoteRecord[]> {
    return this.databaseService.db.select().from(notesTable).orderBy(desc(notesTable.createdAt));
  }

  async findById(id: string): Promise<NoteRecord> {
    const [note] = await this.databaseService.db
      .select()
      .from(notesTable)
      .where(eq(notesTable.id, id))
      .limit(1);

    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }

    return note;
  }

  async create(dto: CreateNoteDto): Promise<NoteRecord> {
    const [note] = await this.databaseService.db
      .insert(notesTable)
      .values({
        id: uuidv7(),
        title: dto.title,
        content: dto.content,
      })
      .returning();

    if (!note) {
      throw new Error('Failed to create note');
    }

    return note;
  }

  async update(id: string, dto: UpdateNoteDto): Promise<NoteRecord> {
    const changes: Partial<NewNoteRecord> = {
      updatedAt: new Date(),
    };

    if (dto.title !== undefined) {
      changes.title = dto.title;
    }

    if (dto.content !== undefined) {
      changes.content = dto.content;
    }

    const [note] = await this.databaseService.db
      .update(notesTable)
      .set(changes)
      .where(eq(notesTable.id, id))
      .returning();

    if (!note) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }

    return note;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.databaseService.db
      .delete(notesTable)
      .where(eq(notesTable.id, id))
      .returning({ id: notesTable.id });

    if (deleted.length === 0) {
      throw new NotFoundException(`Note with id ${id} not found`);
    }
  }
}
