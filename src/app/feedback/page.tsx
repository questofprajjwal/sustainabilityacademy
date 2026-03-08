import type { Metadata } from 'next';
import PlatformNav from '@/components/platform/PlatformNav';
import Footer from '@/components/platform/Footer';
import FeedbackForm from './_components/FeedbackForm';

export const metadata: Metadata = {
  title: 'Feedback & Course Requests | Sustainability Academy',
  description:
    'Share your feedback, suggest improvements, or request new courses on Sustainability Academy.',
};

export default function FeedbackPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PlatformNav />

      <main id="main-content" className="flex-1">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Feedback & Course Requests
          </h1>
          <p className="text-gray-500 mb-10">
            Have a suggestion, spotted an error, or want us to cover a new topic? We'd love to hear from you.
          </p>

          <FeedbackForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
