import type { Metadata } from 'next';
import Link from 'next/link';
import PlatformNav from '@/components/platform/PlatformNav';
import Footer from '@/components/platform/Footer';

export const metadata: Metadata = {
  title: 'Disclaimer | Sustainability Academy',
  description:
    'Important information regarding the sources, accuracy, copyright, and intended use of the educational content provided by Sustainability Academy.',
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PlatformNav />

      <main id="main-content" className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Disclaimer</h1>
          <p className="text-sm text-gray-400 mb-10">Last updated: March 2026</p>

          <div className="max-w-none space-y-10 text-gray-700 leading-relaxed">

            {/* 1: Purpose */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Purpose of This Platform</h2>
              <p>
                Sustainability Academy is an independent, non-commercial educational platform created with the sole
                purpose of providing free-of-cost, accessible education on sustainability-related topics to learners
                worldwide. The platform does not charge any fees, does not sell any products or services, and does not
                generate revenue from its educational content. Our mission is to democratise knowledge in the fields of
                climate science, carbon markets, environmental reporting, green finance, and related disciplines by
                presenting complex subject matter in a structured, professional, and reader-friendly manner.
              </p>
            </section>

            {/* 2: Sources */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Sources of Content</h2>
              <p>
                The educational material presented on this platform has been researched, compiled, and written with
                reference to publicly available documents, standards, frameworks, guidelines, technical specifications,
                and other publications issued by their respective authors and organisations. These public sources form
                the foundational knowledge base upon which our course content has been developed. We have endeavoured to
                present this information accurately and faithfully, drawing upon the latest publicly available versions
                of these materials at the time of writing.
              </p>
              <p>
                However, standards, frameworks, and guidelines are subject to periodic revision, amendment, and
                reissuance by their respective governing bodies. As such, the content on this platform may not always
                reflect the most current version of any given source document. We strongly recommend that all users
                consult the original source documents directly for the most authoritative, complete, and up-to-date
                information. Reading the original texts in their entirety is essential for achieving the utmost clarity
                and depth of understanding on any subject covered by our courses.
              </p>
            </section>

            {/* 3: Copyright */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Copyright and Intellectual Property</h2>
              <p>
                Sustainability Academy does not claim any copyright, ownership, or proprietary rights over the
                underlying data, methodologies, frameworks, standards, technical specifications, or any other
                intellectual property contained within the original source documents referenced in our course materials.
                All such rights remain the exclusive property of the original authors, publishers, organisations, and
                standard-setting bodies that created them.
              </p>
              <p>
                Where our courses reference, summarise, paraphrase, or explain concepts drawn from these sources, we do
                so purely for educational purposes and in the interest of public learning. Any trademarks, service
                marks, trade names, or other proprietary designations mentioned within our content are the property of
                their respective owners and are used solely for identification and educational reference purposes.
              </p>
              <p>
                The original editorial expression, structure, presentation, and pedagogical design of our course
                materials (including explanatory text, analogies, examples, exercises, and quiz questions that we have
                independently authored) are the work of Sustainability Academy. However, the factual content and
                technical substance drawn from publicly available sources remain attributed to and owned by their
                original creators.
              </p>
            </section>

            {/* 4: No Affiliation */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">No Affiliation or Endorsement</h2>
              <p>
                Sustainability Academy is not affiliated with, endorsed by, sponsored by, licensed by, or in any way
                formally associated with any standard-setting body, regulatory authority, governmental agency,
                international organisation, industry consortium, or any other entity whose publications or frameworks
                are referenced in our educational content. The inclusion of content derived from any particular source
                does not imply any partnership, collaboration, or official relationship between this platform and the
                originating organisation.
              </p>
              <p>
                Any opinions, interpretations, simplifications, or editorial choices reflected in our course materials
                are solely those of Sustainability Academy and its contributors, and should not be attributed to or
                construed as the official position of any referenced organisation or standard-setting body.
              </p>
            </section>

            {/* 5: Accuracy */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Accuracy and Completeness</h2>
              <p>
                While we have made every reasonable effort to ensure the accuracy, completeness, and reliability of the
                information presented on this platform, Sustainability Academy makes no warranties or representations,
                express or implied, regarding the correctness, completeness, adequacy, timeliness, or suitability of
                any content for any particular purpose. Educational content is provided on an &ldquo;as is&rdquo; and
                &ldquo;as available&rdquo; basis.
              </p>
              <p>
                Errors, omissions, or inaccuracies may exist despite our best efforts. If you identify any factual
                errors or outdated information in our materials, we welcome and encourage you to bring them to our
                attention so that we may correct them promptly.
              </p>
            </section>

            {/* 6: Not Professional Advice */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Not Professional Advice</h2>
              <p>
                The content provided on this platform is intended exclusively for general educational and informational
                purposes. It does not constitute, and should not be construed as, professional advice of any kind,
                including but not limited to legal, financial, investment, accounting, tax, regulatory, compliance,
                auditing, environmental consulting, or any other form of professional counsel.
              </p>
              <p>
                Users should not rely solely on the information presented in our courses when making professional
                decisions, regulatory filings, financial disclosures, compliance assessments, or any other actions that
                may have legal, financial, or regulatory consequences. We strongly advise all users to seek the guidance
                of qualified, licensed professionals in the relevant field before acting upon any information obtained
                from this platform.
              </p>
            </section>

            {/* 7: No Certification */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">No Certification or Accreditation</h2>
              <p>
                Completion of any course, module, lesson, or quiz on this platform does not confer any professional
                certification, accreditation, credential, licence, qualification, or formal recognition of any kind.
                Our courses are designed purely as learning aids to help individuals build foundational knowledge and
                understanding of sustainability-related topics. They are not a substitute for formal education,
                professional training programmes, or certification examinations administered by recognised bodies.
              </p>
            </section>

            {/* 8: User Responsibility */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">User Responsibility</h2>
              <p>
                Users of this platform assume full responsibility for how they interpret, apply, and act upon the
                information provided in our courses. Sustainability Academy shall not be held liable for any loss,
                damage, expense, or consequence, whether direct, indirect, incidental, special, or consequential,
                arising from or in connection with the use of, reliance upon, or inability to use the content provided
                on this platform.
              </p>
              <p>
                By accessing and using this platform, users acknowledge and accept that they do so at their own risk and
                discretion, and that they are solely responsible for evaluating the accuracy, completeness, and
                usefulness of any information obtained herein.
              </p>
            </section>

            {/* 9: Third-Party Links */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Third-Party Links and References</h2>
              <p>
                Our course materials may contain references or links to external websites, documents, or resources
                maintained by third parties. These references are provided solely for the convenience of our users and
                for supplementary educational context. Sustainability Academy does not control, endorse, or assume any
                responsibility for the content, accuracy, privacy practices, or availability of any third-party
                resources. The inclusion of any external reference does not imply our endorsement or approval of the
                referenced site or its contents.
              </p>
            </section>

            {/* 10: Data Privacy */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Data and Privacy</h2>
              <p>
                Sustainability Academy respects the privacy of its users. All progress data, quiz responses, and
                learning activity are stored exclusively in your web browser&apos;s local storage on your own device. We
                do not collect, transmit, store, or process any personal data on external servers. No user accounts are
                required, no cookies are set for tracking purposes, and no analytics or advertising services are
                employed. Your learning data remains entirely under your control.
              </p>
            </section>

            {/* 11: Changes */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Changes to This Disclaimer</h2>
              <p>
                Sustainability Academy reserves the right to modify, update, or amend this disclaimer at any time
                without prior notice. Any changes will be effective immediately upon publication on this page. We
                encourage users to review this disclaimer periodically to remain informed of any updates. Continued use
                of the platform following any changes constitutes acceptance of the revised terms.
              </p>
            </section>

            {/* 12: Recommendation */}
            <section className="bg-green-50 border border-green-200 rounded-xl p-6 space-y-4">
              <h2 className="text-xl font-semibold text-green-900">Our Recommendation to Learners</h2>
              <p className="text-green-800">
                We wholeheartedly encourage every user of this platform to treat our courses as a starting point and
                companion to deeper study. For the most comprehensive, authoritative, and nuanced understanding of any
                topic covered in our courses, we strongly recommend reading the original source documents, standards,
                and frameworks in their entirety. Our courses are designed to make complex material more approachable,
                but they are not a replacement for the depth and precision of the original texts. The original sources
                remain the definitive reference for all technical, regulatory, and methodological matters.
              </p>
            </section>

          </div>

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to courses
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
