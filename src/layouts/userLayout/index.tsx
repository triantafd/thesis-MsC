import Sidebar from "../../components/Sidebar";
import Footer from "../authLayout/Footer";




export default function UserLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="">
        <Sidebar />
        <div className="flex-grow md:overflow-y-auto">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  )
}