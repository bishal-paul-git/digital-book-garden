
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookForm } from "@/components/BookForm";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { libraryService } from "@/services/libraryService";
import { toast } from "sonner";

export const BookManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  
  const queryClient = useQueryClient();

  const { data: books, isLoading } = useQuery({
    queryKey: ['books', searchTerm],
    queryFn: () => libraryService.getBooks(searchTerm),
  });

  const deleteMutation = useMutation({
    mutationFn: libraryService.deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      toast.success("Book deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete book");
    },
  });

  const handleDelete = (bookId: number) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      deleteMutation.mutate(bookId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Book Management</h1>
        <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Book
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search books by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">Title</th>
                  <th className="text-left py-3 px-4 font-semibold">Author</th>
                  <th className="text-left py-3 px-4 font-semibold">ISBN</th>
                  <th className="text-left py-3 px-4 font-semibold">Genre</th>
                  <th className="text-left py-3 px-4 font-semibold">Available</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books?.map((book: any) => (
                  <tr key={book.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{book.title}</td>
                    <td className="py-3 px-4 text-gray-600">{book.author}</td>
                    <td className="py-3 px-4 text-gray-600">{book.isbn}</td>
                    <td className="py-3 px-4 text-gray-600">{book.genre}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        book.availableCopies > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingBook(book)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(book.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No books found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {(showAddForm || editingBook) && (
        <BookForm
          book={editingBook}
          onClose={() => {
            setShowAddForm(false);
            setEditingBook(null);
          }}
        />
      )}
    </div>
  );
};
