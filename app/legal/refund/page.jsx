import React from 'react';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen flex flex-col py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Refund Policy
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Important information about refunds for digital Minecraft rank purchases
          </p>
          <div className="mt-6 inline-flex items-center px-4 py-2 professional-card rounded-full">
            <span className="text-sm font-medium text-red-300">
              Last Updated: January 2026
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="professional-card p-8 md:p-12 animate-fade-in-up">
          {/* Important Notice */}
          <div className="mb-10 p-6 bg-red-500/10 border border-red-500/20 rounded-xl">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-3">Important Notice</h2>
                <p className="text-gray-300 leading-relaxed">
                  At Fade, we provide digital Minecraft server ranks and virtual items. Due to the nature of digital products, our refund policy is designed to be fair while protecting against abuse of our services.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-10">
            {/* No Refund Policy */}
            <section className="border-l-4 border-red-500 pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                No Refund Policy
              </h2>
              
              <div className="bg-red-500/10 border-2 border-red-500/20 rounded-xl p-6 mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-bold text-red-300">All Sales Are Final</h3>
                </div>
                <p className="text-red-300 font-semibold text-lg">
                  We do not offer refunds for digital Minecraft ranks and virtual items after purchase completion.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                    <p>Digital products are delivered instantly and cannot be returned</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                    <p>Once activated, the transaction is considered complete</p>
                  </div>
                </div>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                    <p>No refunds for change of mind or dissatisfaction</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2"></span>
                    <p>No refunds for server rule violations or bans</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Company Fault Exceptions */}
            <section className="border-l-4 border-orange-500 pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                Exceptions - Company Fault Only
              </h2>
              
              <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-6">
                <p className="text-orange-300 font-semibold">
                  Refunds will <strong>only</strong> be considered when the fault lies with Fade Store:
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="professional-card p-4 border border-gray-600">
                    <h4 className="font-bold text-white mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Technical Failure
                    </h4>
                    <p className="text-sm text-gray-300">System fails to deliver your code due to our technical error</p>
                  </div>
                  
                  <div className="professional-card p-4 border border-gray-600">
                    <h4 className="font-bold text-white mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Incorrect Delivery
                    </h4>
                    <p className="text-sm text-gray-300">You receive a different rank than purchased due to our error</p>
                  </div>

                  <div className="professional-card p-4 border border-gray-600">
                    <h4 className="font-bold text-white mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Duplicate Charges
                    </h4>
                    <p className="text-sm text-gray-300">Multiple charges for the same purchase due to payment errors</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="professional-card p-4 border border-gray-600">
                    <h4 className="font-bold text-white mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
                      </svg>
                      Server Discontinuation
                    </h4>
                    <p className="text-sm text-gray-300">We permanently shut down the server within 30 days of purchase</p>
                  </div>

                  <div className="professional-card p-4 border border-gray-600">
                    <h4 className="font-bold text-white mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Unauthorized Transactions
                    </h4>
                    <p className="text-sm text-gray-300">Payment method used without authorization (subject to verification)</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Refund Process */}
            <section className="border-l-4 border-blue-500 pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                Refund Request Process
              </h2>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                <p className="text-blue-300 font-semibold">
                  If you believe you qualify for a refund under our company fault exceptions:
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { step: 1, title: "Contact Support", desc: "Reach out through Discord within 7 days of purchase", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
                  { step: 2, title: "Provide Details", desc: "Include order ID, Minecraft username, and detailed explanation", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
                  { step: 3, title: "Submit Evidence", desc: "Include screenshots or evidence of the problem", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
                  { step: 4, title: "Investigation", desc: "Our team will investigate within 48-72 hours", icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" },
                  { step: 5, title: "Processing", desc: "If approved, refunds processed within 5-7 business days", icon: "M5 13l4 4L19 7" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 professional-card border border-gray-600">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-300">{item.desc}</p>
                    </div>
                    <svg className="w-5 h-5 text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                  </div>
                ))}
              </div>
            </section>

            {/* What We Don't Refund */}
            <section className="border-l-4 border-yellow-500 pl-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
                What We Do NOT Refund
              </h2>
              
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <p className="text-sm">Incorrect Minecraft username (your responsibility)</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <p className="text-sm">Dissatisfaction with rank features or gameplay</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <p className="text-sm">Account bans or suspensions for rule violations</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <p className="text-sm">Server maintenance or temporary downtime</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <p className="text-sm">Changes in server rules or rank permissions</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <p className="text-sm">Technical issues on your end (internet, etc.)</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <p className="text-sm">Purchases by minors without parental consent</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <p className="text-sm">Requests made after 7 days from purchase</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Prevention Tips */}
            <section className="professional-card p-8 bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Prevention Tips
              </h3>
              <p className="mb-6 text-gray-300">
                To avoid issues with your purchase and ensure a smooth experience:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm">Double-check your Minecraft rank before purchasing</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm">Read rank descriptions and features carefully</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm">Understand server rules and rank responsibilities</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm">Contact support if you have questions before buying</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm">Keep your order confirmation email safe</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm">Join our Discord for support and updates</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Final Notice */}
        <div className="mt-12 p-6 professional-card bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-xl font-bold text-white mb-2">Remember</h3>
          <p className="text-gray-300">
            By making a purchase, you acknowledge that you have read, understood, and agree to this refund policy. 
            <strong className="text-red-300"> All sales are final unless there is a verified fault on our part.</strong>
          </p>
        </div>
      </div>
    </div>
  );
}