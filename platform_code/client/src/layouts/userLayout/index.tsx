import Sidebar from "../../components/Sidebar";
import Footer from "../authLayout/Footer";
import UserNavbar from "./UserNavbar";

export default function UserLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <Sidebar />
        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="hidden md:block">
            {/* todo change userName from Authcontext */}
            <UserNavbar brandText={"Detection App"} userName={"Dimitris"} />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-400">
            {children}
          </div>
        </div>
        {/* Footer */}
      </div>
      <div className="">
        <Footer />
      </div>
    </div>
  );
}
