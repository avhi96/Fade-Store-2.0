import React from 'react';

const Section = ({ title, children, icon, color = "blue" }) => (
  <section className={`border-l-4 border-${color}-500 pl-6 mb-8`}>
    <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
      <span className={`bg-${color}-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3`}>
        {icon}
      </span>
      {title}
    </h2>
    <div className="text-gray-300 space-y-4">{children}</div>
  </section>
);

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your privacy is important to us. Learn how we collect, use, and protect your personal information.
          </p>
          <div className="mt-6 inline-flex items-center px-4 py-2 professional-card rounded-full">
            <span className="text-sm font-medium text-green-300">
              Last Updated: January 2026
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="professional-card p-8 md:p-12 animate-fade-in-up">
          {/* Introduction */}
          <div className="mb-10 p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
              <svg className="w-6 h-6 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Our Commitment to Your Privacy
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Fade is committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, store, and protect your data when you visit our website and purchase digital Minecraft ranks and services. By using our website or services, you consent to the practices described in this Privacy Policy.
            </p>
          </div>

          <div className="space-y-10">
            <Section title="Information We Collect" icon="1" color="blue">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="professional-card p-4">
                  <h4 className="font-bold text-blue-300 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Account Information
                  </h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Email address for communication</li>
                    <li>• Minecraft username for delivery</li>
                    <li>• Discord username (optional)</li>
                  </ul>
                </div>
                <div className="professional-card p-4">
                  <h4 className="font-bold text-purple-300 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Payment Information
                  </h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Transaction details</li>
                    <li>• Billing information</li>
                    <li>• Order history</li>
                  </ul>
                </div>
                <div className="professional-card p-4">
                  <h4 className="font-bold text-green-300 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Technical Information
                  </h4>
                  <ul className="space-y-1 text-sm">
                    <li>• IP address for security</li>
                    <li>• Browser information</li>
                    <li>• Usage analytics</li>
                  </ul>
                </div>
              </div>
            </Section>

            <Section title="How We Use Your Information" icon="2" color="green">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                    <p><strong>Process Orders:</strong> Deliver your Minecraft rank purchases efficiently</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                    <p><strong>Communication:</strong> Send order confirmations and delivery notifications</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                    <p><strong>Customer Support:</strong> Provide technical assistance and resolve issues</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                    <p><strong>Security:</strong> Prevent fraud and ensure payment security</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                    <p><strong>Improvement:</strong> Enhance our website and services</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                    <p><strong>Updates:</strong> Communicate important service changes</p>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Data Security & Protection" icon="3" color="purple">
              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-bold text-purple-300 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Encryption & Security
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• SSL encryption for all data transmission</li>
                      <li>• Secure payment gateway processing</li>
                      <li>• Regular security updates and monitoring</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-300 mb-3 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Access Control
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li>• Restricted server access</li>
                      <li>• Authorized personnel only</li>
                      <li>• Regular access audits</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Information Sharing" icon="4" color="orange">
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6 mb-4">
                <p className="font-bold text-orange-300 text-lg mb-2">
                  🛡️ We do not sell, rent, or trade your personal information to third parties.
                </p>
              </div>
              <p className="mb-4 font-semibold">We may share limited information only in these specific circumstances:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                    <p>Payment processors for secure transactions</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                    <p>Minecraft server administrators for rank delivery</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                    <p>When required by law or legal protection</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                    <p>With your explicit consent for specific purposes</p>
                  </div>
                </div>
              </div>
            </Section>

            <div className="grid md:grid-cols-2 gap-8">
              <Section title="Your Privacy Rights" icon="5" color="indigo">
                <div className="professional-card p-4">
                  <p className="font-semibold mb-3 text-indigo-300">You have the right to:</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Access your personal information</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Request data corrections</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Request account deletion</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Opt-out of communications</span>
                    </li>
                  </ul>
                </div>
              </Section>

              <Section title="Cookies & Tracking" icon="6" color="teal">
                <div className="professional-card p-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start space-x-2">
                      <span className="flex-shrink-0 w-2 h-2 bg-teal-500 rounded-full mt-2"></span>
                      <span>Enhance browsing experience</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="flex-shrink-0 w-2 h-2 bg-teal-500 rounded-full mt-2"></span>
                      <span>Remember your preferences</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="flex-shrink-0 w-2 h-2 bg-teal-500 rounded-full mt-2"></span>
                      <span>Analyze website usage</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="flex-shrink-0 w-2 h-2 bg-teal-500 rounded-full mt-2"></span>
                      <span>No cross-site tracking</span>
                    </li>
                  </ul>
                </div>
              </Section>
            </div>

            {/* Contact Section */}
            <section className="professional-card p-8 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Privacy Questions or Concerns?
              </h3>
              <p className="mb-6 text-gray-300">
                We're committed to transparency about our privacy practices. Contact us if you have any questions or need to exercise your privacy rights.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Discord Support</p>
                    <p className="text-sm text-gray-300">Privacy inquiries welcome</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Response Time</p>
                    <p className="text-sm text-gray-300">Within 48 hours</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-gray-400">
            This Privacy Policy is designed to help you understand how we handle your personal information with care and respect.
          </p>
        </div>
      </div>
    </div>
  );
}