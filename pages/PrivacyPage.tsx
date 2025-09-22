import React from 'react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-8">
    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">{title}</h3>
    <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 space-y-4">
      {children}
    </div>
  </div>
);

const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 sm:p-12 rounded-xl shadow-lg">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 sm:text-5xl">
          Privacy Policy
        </h2>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <Section title="1. Information We Collect">
        <p>
          We collect information to provide and improve our services. This includes:
        </p>
        <ul>
            <li><strong>Images You Provide:</strong> We collect the images you upload to our service to process your redesign requests.</li>
            <li><strong>Usage Information:</strong> We may collect information about how you interact with our service, such as the features you use and the time, frequency, and duration of your activities.</li>
            <li><strong>Account Information:</strong> If you create an account, we collect information such as your email address and payment information to manage your subscription.</li>
        </ul>
      </Section>

      <Section title="2. How We Use Information">
        <p>
          We use the information we collect to:
        </p>
         <ul>
            <li>Provide, operate, and maintain our services.</li>
            <li>Process your transactions and manage your subscription.</li>
            <li>Improve, personalize, and expand our services.</li>
            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes.</li>
            <li>For compliance purposes, including enforcing our Terms of Service, or other legal rights.</li>
         </ul>
      </Section>

      <Section title="3. How We Share Information">
        <p>
          We do not sell your personal information. We may share information with third-party service providers to help us operate our business, such as payment processors and AI model providers. These third parties are contractually obligated to protect your information and are not permitted to use it for any other purpose. Uploaded images are sent to our AI provider (Google Gemini) for processing and are subject to their privacy policies.
        </p>
      </Section>

      <Section title="4. Data Retention">
        <p>
          We retain your information for as long as necessary to provide the service and fulfill the transactions you have requested, or for other essential purposes such as complying with our legal obligations, resolving disputes, and enforcing our agreements. Redesign history is stored in your browser's local storage and is subject to automatic deletion as described in the application.
        </p>
      </Section>

      <Section title="5. Your Rights">
        <p>
          You have the right to access, correct, or delete your personal information. You can manage your redesign history directly within the application. For other requests, please contact us using the information provided on our Contact page.
        </p>
      </Section>
    </div>
  );
};

export const dynamic = 'force-dynamic';

export async function getServerSideProps() {
  return { props: {} };
}

export default PrivacyPage;