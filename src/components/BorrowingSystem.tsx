
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BorrowForm } from "@/components/BorrowForm";
import { Plus, Search, Calendar, User, Book } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { libraryService } from "@/services/libraryService";
import { toast } from "sonner";

export const BorrowingSystem = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  
  const queryClient = useQueryClient();

  const { data: borrowings, isLoading } = useQuery({
    queryKey: ['borrowings', searchTerm],
    queryFn: () => libraryService.getBorrowings(searchTerm),
  });

  const returnMutation = useMutation({
    mutationFn: libraryService.returnBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowings'] });
      toast.success("Book returned successfully");
    },
    onError: () => {
      toast.error("Failed to return book");
    },
  });

  const handleReturn = (borrowingId: number) => {
    if (window.confirm("Are you sure you want to mark this book as returned?")) {
      returnMutation.mutate(borrowingId);
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !borrowings?.find((b: any) => b.dueDate === dueDate)?.returnDate;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Borrowing System</h1>
        <Button onClick={() => setShowBorrowForm(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          New Borrowing
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by book title, member name, or borrowing ID..."
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
                  <th className="text-left py-3 px-4 font-semibold">Borrowing ID</th>
                  <th className="text-left py-3 px-4 font-semibold">Book</th>
                  <th className="text-left py-3 px-4 font-semibold">Member</th>
                  <th className="text-left py-3 px-4 font-semibold">Borrow Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Due Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {borrowings?.map((borrowing: any) => (
                  <tr key={borrowing.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">#{borrowing.id}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Book className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{borrowing.bookTitle}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{borrowing.memberName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{new Date(borrowing.borrowDate).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(borrowing.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        borrowing.returnDate 
                          ? 'bg-green-100 text-green-800' 
                          : isOverdue(borrowing.dueDate)
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {borrowing.returnDate 
                          ? 'Returned' 
                          : isOverdue(borrowing.dueDate)
                          ? 'Overdue'
                          : 'Borrowed'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {!borrowing.returnDate && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReturn(borrowing.id)}
                        >
                          Return Book
                        </Button>
                      )}
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No borrowings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {showBorrowForm && (
        <BorrowForm onClose={() => setShowBorrowForm(false)} />
      )}
    </div>
  );
};
