import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DirectoryPreview from "@/components/DirectoryPreview";
import QRScanner from "@/components/QRScanner";

const Annuaire = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-end mb-4">
            <QRScanner />
          </div>
        </div>
        <DirectoryPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Annuaire;
