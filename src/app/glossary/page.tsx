import { getGlossary } from '@/lib/glossary';
import GlossaryClient from './_components/GlossaryClient';
import PlatformNav from '@/components/platform/PlatformNav';
import Footer from '@/components/platform/Footer';

export const metadata = {
  title: 'Glossary - Green Tryst',
  description: 'Key sustainability, carbon markets, and ESG terms defined.',
};

export default function GlossaryPage() {
  const glossary = getGlossary();

  return (
    <>
      <PlatformNav />
      <main id="main-content" className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Glossary</h1>
        <p className="text-gray-500 mb-8">
          Key terms across climate science, carbon markets, GHG accounting, and ESG.
        </p>
        <GlossaryClient entries={glossary} />
      </main>
      <Footer />
    </>
  );
}
