
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download, FileText, TrendingUp, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { libraryService } from "@/services/libraryService";

export const ReportsSection = () => {
  const { data: reportData, isLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: libraryService.getReportData,
  });

  const borrowingTrends = [
    { month: 'Jan', borrowings: 45 },
    { month: 'Feb', borrowings: 52 },
    { month: 'Mar', borrowings: 48 },
    { month: 'Apr', borrowings: 61 },
    { month: 'May', borrowings: 55 },
    { month: 'Jun', borrowings: 67 },
  ];

  const genreDistribution = [
    { name: 'Fiction', value: 35, color: '#3B82F6' },
    { name: 'Science', value: 25, color: '#10B981' },
    { name: 'History', value: 20, color: '#F59E0B' },
    { name: 'Technology', value: 15, color: '#EF4444' },
    { name: 'Others', value: 5, color: '#8B5CF6' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold">67 Borrowings</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Borrowings</p>
              <p className="text-2xl font-bold">34</p>
              <p className="text-sm text-blue-600">Currently borrowed</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue Books</p>
              <p className="text-2xl font-bold text-red-600">5</p>
              <p className="text-sm text-red-600">Need attention</p>
            </div>
            <FileText className="h-8 w-8 text-red-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Borrowing Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={borrowingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="borrowings" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Book Genre Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genreDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {genreDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: "Book borrowed", details: "Python Programming by John Doe", time: "2 hours ago" },
            { action: "New member registered", details: "Alice Johnson (Student)", time: "4 hours ago" },
            { action: "Book returned", details: "Data Structures by Jane Smith", time: "1 day ago" },
            { action: "Book added", details: "Machine Learning Basics", time: "2 days ago" },
            { action: "Member updated", details: "Bob Wilson contact info", time: "3 days ago" },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.details}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
