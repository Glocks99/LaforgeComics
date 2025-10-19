import { type ReactNode } from "react";
import Sidebar from "../../components/admin/Sidebar";
import Header from "../../components/admin/Header";

type LayoutProps = {
  children: ReactNode;
  title: string;
};

const Layout = ({ children, title }: LayoutProps) => {


  return (
    <div className="flex flex-col sm:flex-row min-h-screen bg-[#f4f6f8]">
      {/* Sidebar */}
      <Sidebar currentActive={title}/> 

      {/* Main Content */}
      <div className="flex-1 flex flex-col sm:h-[100vh] sm:overflow-hidden">
        <Header title={title} />

        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-6 space-y-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
