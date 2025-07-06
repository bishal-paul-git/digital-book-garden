
import { Card } from "@/components/ui/card";
import { BookOpen, Users, ArrowLeftRight, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { libraryService } from "@/services/libraryService";

export const Dashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: libraryService.getDashboardStats,
  });

  const { data: recentBorrowings } = useQuery({
    queryKey: ['recent-borrowings'],
    queryFn: libraryService.getRecentBorrowings,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Books",
      value: stats?.totalBooks || 0,
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      title: "Total Members",
      value: stats?.totalMembers || 0,
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Books Borrowed",
      value: stats?.booksBorrowed || 0,
      icon: ArrowLeftRight,
      color: "bg-purple-500",
    },
    {
      title: "Overdue Books",
      value: stats?.overdueBooks || 0,
      icon: AlertTriangle,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome to the Library Management System
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Borrowings</h3>
          <div className="space-y-3">
            {recentBorrowings?.map((borrowing: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{borrowing.bookTitle}</p>
                  <p className="text-sm text-gray-600">by {borrowing.memberName}</p>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(borrowing.borrowDate).toLocaleDateString()}
                </div>
              </div>
            )) || (
              <div className="text-center py-4 text-gray-500">
                No recent borrowings
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">System Information</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Database Status</span>
              <span className="text-green-600 font-medium">Connected</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Backup</span>
              <span className="text-gray-900">Today, 2:00 AM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">System Version</span>
              <span className="text-gray-900">v1.0.0</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
