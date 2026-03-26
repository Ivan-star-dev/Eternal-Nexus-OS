import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import GlobalBackground from "@/components/GlobalBackground";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen relative" style={{ background: "#060c14" }}>
      <GlobalBackground />
      <div className="relative" style={{ zIndex: 1 }}>
        <NavBar />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
