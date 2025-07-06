
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { libraryService } from "@/services/libraryService";
import { toast } from "sonner";

interface BorrowFormProps {
  onClose: () => void;
}

export const BorrowForm = ({ onClose }: BorrowFormProps) => {
  const [formData, setFormData] = useState({
    bookId: "",
    memberId: "",
    dueDate: "",
  });

  const queryClient = useQueryClient();

  const { data: books } = useQuery({
    queryKey: ['available-books'],
    queryFn: libraryService.getAvailableBooks,
  });

  const { data: members } = useQuery({
    queryKey: ['all-members'],
    queryFn: () => libraryService.getMembers(""),
  });

  const mutation = useMutation({
    mutationFn: libraryService.borrowBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowings'] });
      toast.success("Book borrowed successfully");
      onClose();
    },
    onError: () => {
      toast.error("Failed to borrow book");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Set default due date to 14 days from now
  const defaultDueDate = new Date();
  defaultDueDate.setDate(defaultDueDate.getDate() + 14);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">New Borrowing</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="bookId">Select Book *</Label>
              <Select 
                value={formData.bookId} 
                onValueChange={(value) => setFormData({ ...formData, bookId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a book" />
                </SelectTrigger>
                <SelectContent>
                  {books?.map((book: any) => (
                    <SelectItem key={book.id} value={book.id.toString()}>
                      {book.title} - {book.author} ({book.availableCopies} available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="memberId">Select Member *</Label>
              <Select 
                value={formData.memberId} 
                onValueChange={(value) => setFormData({ ...formData, memberId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a member" />
                </SelectTrigger>
                <SelectContent>
                  {members?.map((member: any) => (
                    <SelectItem key={member.id} value={member.id.toString()}>
                      {member.name} (#{member.memberId}) - {member.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate || defaultDueDate.toISOString().split('T')[0]}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Processing..." : "Borrow Book"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};
