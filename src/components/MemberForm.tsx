
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { libraryService } from "@/services/libraryService";
import { toast } from "sonner";

interface MemberFormProps {
  member?: any;
  onClose: () => void;
}

export const MemberForm = ({ member, onClose }: MemberFormProps) => {
  const [formData, setFormData] = useState({
    name: member?.name || "",
    email: member?.email || "",
    phone: member?.phone || "",
    address: member?.address || "",
    memberType: member?.memberType || "",
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: member 
      ? (data: any) => libraryService.updateMember(member.id, data)
      : libraryService.addMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success(member ? "Member updated successfully" : "Member added successfully");
      onClose();
    },
    onError: () => {
      toast.error(member ? "Failed to update member" : "Failed to add member");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {member ? "Edit Member" : "Add New Member"}
            </h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="memberType">Member Type *</Label>
                <Select 
                  value={formData.memberType} 
                  onValueChange={(value) => setFormData({ ...formData, memberType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select member type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Faculty">Faculty</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                    <SelectItem value="Public">Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : member ? "Update Member" : "Add Member"}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};
