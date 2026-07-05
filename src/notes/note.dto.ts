export class CreateNoteDto {
  title!: string;
  content!: string;
}

export class UpdateNoteDto {
  title?: string;
  content?: string;
}
