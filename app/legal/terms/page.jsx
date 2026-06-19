import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Please read these terms carefully before using our Minecraft rank services
          </p>
          <div className="mt-6 inline-flex items-center px-4 py-2 professional-card rounded-full">
            <span className="text-sm font-medium text-blue-300">
              Last Updated: January 2026
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="professional-card p-8 md:p-12 animate-fade-in-up">
          {/* Introduction */}
          <div className="mb-10 p-6 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to Fade Store</h2>
            <p className="text-gray-300 leading-relaxed">
              These Terms of Service ("Terms") govern your use of our website and the purchase of digital Minecraft server ranks and related services. By accessing our website or making a purchase, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
            </p>
          </div>

          <div className="space-y-10">
            {/* Section 1 */}
            <section className="border-l-4 border-blue-500 pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                Service Description
              </h2>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                  <p><strong>Digital Products:</strong> Fade Store provides digital Minecraft server ranks, permissions, and related virtual items for Minecraft servers.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                  <p><strong>Activation Time:</strong> Rank activation typically occurs instantly after successful payment verification.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></span>
                  <p><strong>Service Modifications:</strong> We reserve the right to modify, suspend, or discontinue any service at any time with reasonable notice.</p>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="border-l-4 border-green-500 pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                Account Requirements
              </h2>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                  <p><strong>Account Accuracy:</strong> You are responsible for ensuring your Minecraft account information is accurate and up-to-date.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                  <p><strong>Non-Transferable:</strong> Ranks cannot be transferred between different Minecraft accounts.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                  <p><strong>Age Requirement:</strong> You must be at least 13 years old or have parental consent to make purchases.</p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="border-l-4 border-purple-500 pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="bg-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                Payment Terms
              </h2>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                  <p><strong>Full Payment Required:</strong> All payments must be made in full before service delivery.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                  <p><strong>Secure Payment Gateways:</strong> We accept payments through secure payment gateways including Razorpay.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                  <p><strong>Currency:</strong> Prices are displayed in Indian Rupees (INR) and may change without prior notice.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                  <p><strong>Failed Payments:</strong> Failed or declined payments may result in automatic order cancellation.</p>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="border-l-4 border-orange-500 pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
                Digital Product Delivery
              </h2>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                  <p><strong>Digital Delivery:</strong> Minecraft ranks are delivered digitally to your specified Minecraft account.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                  <p><strong>Email Confirmation:</strong> Delivery confirmation will be sent to your registered email address.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                  <p><strong>Customer Responsibility:</strong> You are responsible for providing correct account information for delivery.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-orange-500 rounded-full mt-2"></span>
                  <p><strong>Permanent Access:</strong> Ranks are temporary and revoked for Terms violations.</p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="border-l-4 border-red-500 pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">5</span>
                Prohibited Activities
              </h2>
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
                <p className="text-red-300 font-semibold mb-2">The following activities are strictly prohibited:</p>
              </div>
              <div className="space-y-3 text-gray-300">
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                  <p>Using ranks to violate server rules or engage in disruptive behavior</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                  <p>Attempting to resell, transfer, or share purchased ranks with others</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                  <p>Using automated systems or bots to make purchases</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                  <p>Providing false or misleading information during the purchase process</p>
                </div>
              </div>
            </section>

            {/* Additional Sections */}
            <div className="grid md:grid-cols-2 gap-8">
              <section className="professional-card p-6">
                <h3 className="text-xl font-bold text-white mb-4">Intellectual Property</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• All website content and materials are owned by Fade</li>
                  <li>• Minecraft is a trademark of Mojang Studios</li>
                  <li>• We are not affiliated with Mojang or Microsoft</li>
                  <li>• Unauthorized reproduction is prohibited</li>
                </ul>
              </section>

              <section className="professional-card p-6">
                <h3 className="text-xl font-bold text-white mb-4">Limitation of Liability</h3>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• Liability limited to the amount paid for services</li>
                  <li>• Not responsible for server downtime</li>
                  <li>• Digital products provided "as is"</li>
                  <li>• No warranties beyond legal requirements</li>
                </ul>
              </section>
            </div>

            {/* Contact Section */}
            <section className="professional-card p-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30">
              <h3 className="text-2xl font-bold text-white mb-4">Need Help or Have Questions?</h3>
              <p className="mb-6 text-gray-300">
                Our support team is available to help you understand these terms or assist with any concerns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Discord Support</p>
                    <p className="text-sm text-gray-300">Join our server for immediate help</p>
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
                    <p className="text-sm text-gray-300">24-48 hours for all inquiries</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-gray-400">
            By using our services, you acknowledge that you have read, understood, and agree to these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}