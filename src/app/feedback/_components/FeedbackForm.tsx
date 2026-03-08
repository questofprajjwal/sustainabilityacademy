'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeOHtGd02gb85gHYGPtLZGEVCD_lfBZKUKpWdDIDdEDSFDNrg/formResponse';

const ENTRY_IDS = {
  firstName: 'entry.627252975',
  lastName: 'entry.688624906',
  email: 'entry.1249463396',
  feedback: 'entry.2006502108',
} as const;

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function FeedbackForm() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('submitting');

    const params = new URLSearchParams();
    params.append(ENTRY_IDS.firstName, firstName);
    params.append(ENTRY_IDS.lastName, lastName);
    params.append(ENTRY_IDS.email, email);
    params.append(ENTRY_IDS.feedback, feedback);

    try {
      await fetch(GOOGLE_FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      // Google Forms returns opaque response with no-cors, so we assume success
      setStatus('success');
      setFirstName('');
      setLastName('');
      setEmail('');
      setFeedback('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-12 px-6 bg-green-50 border border-green-200 rounded-xl">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-green-900 mb-2">Thank you!</h2>
        <p className="text-green-700 mb-6">Your feedback has been submitted successfully.</p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setStatus('idle')}
            className="text-sm font-medium text-green-700 hover:text-green-800 underline underline-offset-2 transition-colors"
          >
            Submit another response
          </button>
          <Link
            href="/"
            className="text-sm font-medium text-green-700 hover:text-green-800 underline underline-offset-2 transition-colors"
          >
            Back to courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
            placeholder="Your first name"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">
            Last Name
          </label>
          <input
            id="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
            placeholder="Your last name"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow"
          placeholder="you@example.com"
        />
      </div>

      {/* Feedback */}
      <div>
        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1.5">
          Feedback / Course Request <span className="text-red-500">*</span>
        </label>
        <textarea
          id="feedback"
          required
          rows={5}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow resize-y"
          placeholder="Tell us what you think, report an error, or suggest a course topic..."
        />
      </div>

      {/* Error message */}
      {status === 'error' && (
        <p className="text-sm text-red-600">
          Something went wrong. Please try again or use the{' '}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeOHtGd02gb85gHYGPtLZGEVCD_lfBZKUKpWdDIDdEDSFDNrg/viewform"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Google Form directly
          </a>.
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
      >
        {status === 'submitting' ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting...
          </>
        ) : (
          'Submit Feedback'
        )}
      </button>

      {/* Back link */}
      <div className="pt-4 border-t border-gray-100">
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
    </form>
  );
}
