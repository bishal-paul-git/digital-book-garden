
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { libraryService } from "@/services/libraryService";
import { toast } from "sonner";

interface BookFormProps {
  book?: any;
  onClose: () => void;
}

export const BookForm = ({ book, onClose }: BookFormProps) => {
  const [formData, setFormData] = useState({
    title: book?.title || "",
    author: book?.author || "",
    isbn: book?.isbn || "",
    genre: book?.genre || "",
    publicationYear: book?.publicationYear || "",
    totalCopies: book?.totalCopies || "",
    description: book?.description || "",
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: book 
      ? (data: any) => libraryService.updateBook(book.id, data)
      : libraryService.addBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success(book ? "Book updated successfully" : "Book added successfully");
      onClose();
    },
    onError: () => {
      toast.error(book ? "Failed to update book" : "Failed to add book");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {book ? "Edit Book" : "Add New Book"}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="publicationYear">Publication Year</Label>
                <Input
                  id="publicationYear"
                  name="publicationYear"
                  type="number"
                  value={formData.publicationYear}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="totalCopies">Total Copies *</Label>
                <Input
                  id="totalCopies"
                  name="totalCopies"
                  type="number"
                  value={formData.totalCopies}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : book ? "Update Book" : "Add Book"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};
