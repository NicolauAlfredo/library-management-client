import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(2, "Title must have at least 2 characters"),
  author: z.string().min(2, "Author must have at least 2 characters"),
  category: z.string().optional(),
  isbn: z.string().optional(),
  coverUrl: z.string().url("Invalid cover URL").optional().or(z.literal("")),
  quantity: z.coerce.number().int().positive("Quantity must be greater than 0"),
});

export type BookFormInput = z.input<typeof bookSchema>;
export type BookFormData = z.output<typeof bookSchema>;
