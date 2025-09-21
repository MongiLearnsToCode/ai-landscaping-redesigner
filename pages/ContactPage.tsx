import React from 'react';
import { useToast } from '../contexts/ToastContext';

export const ContactPage: React.FC = () => {
  const { addToast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    // Here you would typically handle form submission to a backend
    addToast('Thank you for your message!', 'success');
    form.reset();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 sm:text-5xl">
          Get in Touch
        </h2>
        <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
          We’d love to hear from you! Whether you have a question, feedback, or need assistance, our team is ready to help.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Contact Information</h3>
            <p className="text-gray-600 dark:text-gray-400">
                For support or any questions, you can reach us via email. We'll do our best to get back to you within 24-48 hours.
            </p>
             <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">Email Us</h4>
                <a href="mailto:support@example.com" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                    support@example.com
                </a>
            </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input type="text" name="name" id="name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <input type="email" name="email" id="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
            <textarea name="message" id="message" rows={4} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 bg-white dark:bg-gray-700"></textarea>
          </div>
          <div>
            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
