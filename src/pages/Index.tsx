
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { BookManagement } from "@/components/BookManagement";
import { MemberManagement } from "@/components/MemberManagement";
import { BorrowingSystem } from "@/components/BorrowingSystem";
import { ReportsSection } from "@/components/ReportsSection";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "books":
        return <BookManagement />;
      case "members":
        return <MemberManagement />;
      case "borrowing":
        return <BorrowingSystem />;
      case "reports":
        return <ReportsSection />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
