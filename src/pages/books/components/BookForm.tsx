import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { bookSchema } from "../book.schema";

import type { BookFormData, BookFormInput } from "../book.schema";

import type { Book } from "../../../types/book";

interface BookFormProps {
  defaultValues?: Book;
  isSubmitting?: boolean;
  onSubmit: (data: BookFormData) => void;
}

export function BookForm({
  defaultValues,
  isSubmitting = false,
  onSubmit,
}: BookFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormInput, unknown, BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      author: defaultValues?.author ?? "",
      category: defaultValues?.category ?? "",
      isbn: defaultValues?.isbn ?? "",
      coverUrl: defaultValues?.coverUrl ?? "",
      quantity: defaultValues?.quantity ?? 1,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Title" {...register("title")} />
      {errors.title && <p>{errors.title.message}</p>}

      <input placeholder="Author" {...register("author")} />
      {errors.author && <p>{errors.author.message}</p>}

      <input placeholder="Category" {...register("category")} />

      <input placeholder="ISBN" {...register("isbn")} />

      <input placeholder="Cover URL" {...register("coverUrl")} />
      {errors.coverUrl && <p>{errors.coverUrl.message}</p>}

      <input type="number" placeholder="Quantity" {...register("quantity")} />
      {errors.quantity && <p>{errors.quantity.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Book"}
      </button>
    </form>
  );
}
