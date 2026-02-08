import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DirectoryPreview from "@/components/DirectoryPreview";

const Annuaire = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <DirectoryPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Annuaire;
