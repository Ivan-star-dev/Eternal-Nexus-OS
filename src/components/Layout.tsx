import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import AmbientParticles from "@/components/AmbientParticles";
import NeuralBridge from "@/components/NeuralBridge";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <AmbientParticles />
      <NavBar />
      <CommandPalette />
      <NeuralBridge />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
