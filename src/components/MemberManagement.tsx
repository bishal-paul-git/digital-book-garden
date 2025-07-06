
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MemberForm } from "@/components/MemberForm";
import { Plus, Search, Edit, Trash2, User } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { libraryService } from "@/services/libraryService";
import { toast } from "sonner";

export const MemberManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  
  const queryClient = useQueryClient();

  const { data: members, isLoading } = useQuery({
    queryKey: ['members', searchTerm],
    queryFn: () => libraryService.getMembers(searchTerm),
  });

  const deleteMutation = useMutation({
    mutationFn: libraryService.deleteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success("Member deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete member");
    },
  });

  const handleDelete = (memberId: number) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      deleteMutation.mutate(memberId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Member Management</h1>
        <Button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Member
        </Button>
      </div>

      <Card className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search members by name, email, or member ID..."
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
                  <th className="text-left py-3 px-4 font-semibold">Member ID</th>
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Phone</th>
                  <th className="text-left py-3 px-4 font-semibold">Member Type</th>
                  <th className="text-left py-3 px-4 font-semibold">Join Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members?.map((member: any) => (
                  <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>#{member.memberId}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{member.name}</td>
                    <td className="py-3 px-4 text-gray-600">{member.email}</td>
                    <td className="py-3 px-4 text-gray-600">{member.phone}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        member.memberType === 'Student' 
                          ? 'bg-blue-100 text-blue-800' 
                          : member.memberType === 'Faculty'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.memberType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(member.joinDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingMember(member)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No members found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {(showAddForm || editingMember) && (
        <MemberForm
          member={editingMember}
          onClose={() => {
            setShowAddForm(false);
            setEditingMember(null);
          }}
        />
      )}
    </div>
  );
};
