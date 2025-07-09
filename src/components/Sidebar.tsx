
import { BookOpen, Users, BarChart3, ArrowLeftRight, Home, Database } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "books", label: "Book Management", icon: BookOpen },
    { id: "members", label: "Member Management", icon: Users },
    { id: "borrowing", label: "Borrowing System", icon: ArrowLeftRight },
    { id: "reports", label: "Reports", icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Database className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">SIU Library</h1>
            <p className="text-sm text-gray-500">Sylhet International University</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors hover:bg-blue-50",
                activeSection === item.id
                  ? "bg-blue-100 text-blue-700 border-r-2 border-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
