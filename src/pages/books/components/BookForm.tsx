import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Title"
          placeholder="Clean Code"
          error={errors.title?.message}
          {...register("title")}
        />

        <Input
          label="Author"
          placeholder="Robert C. Martin"
          error={errors.author?.message}
          {...register("author")}
        />

        <Input
          label="Category"
          placeholder="Software Engineering"
          error={errors.category?.message}
          {...register("category")}
        />

        <Input
          label="ISBN"
          placeholder="9780132350884"
          error={errors.isbn?.message}
          {...register("isbn")}
        />

        <Input
          label="Cover URL"
          placeholder="https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg"
          error={errors.coverUrl?.message}
          {...register("coverUrl")}
          className="md:col-span-2"
        />

        <Input
          label="Quantity"
          type="number"
          placeholder="5"
          error={errors.quantity?.message}
          {...register("quantity")}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Book"}
        </Button>
      </div>
    </form>
  );
}