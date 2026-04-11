import Navbar from './dashboard/components/Navbar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="text-center mt-24 px-6">
        <h1 className="text-5xl font-bold leading-tight">
          Manage Customers Smarter 🚀
        </h1>

        <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
          CRM Pro helps you track leads, manage customers, automate workflows,
          and boost your sales with powerful analytics.
        </p>

        <div className="mt-8 space-x-4">
          <a
            href="/register"
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Get Started
          </a>

          <a
            href="/auth/login"
            className="px-6 py-3 border border-gray-400 rounded-lg hover:bg-gray-800"
          >
            Login
          </a>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="mt-24 px-6 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-[#1e293b] p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold">📊 Dashboard Analytics</h3>
          <p className="mt-3 text-gray-400">
            Get real-time insights into your leads, customers, and sales
            performance.
          </p>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold">🎯 Lead Management</h3>
          <p className="mt-3 text-gray-400">
            Track and manage leads efficiently with status updates and filters.
          </p>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold">🤖 AI Insights</h3>
          <p className="mt-3 text-gray-400">
            Get smart suggestions and improve conversion rates using AI.
          </p>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="mt-24 text-center">
        <h2 className="text-3xl font-bold">Trusted by Teams</h2>

        <div className="mt-8 flex justify-center gap-10 flex-wrap">
          <div>
            <h3 className="text-4xl font-bold text-blue-500">500+</h3>
            <p className="text-gray-400">Customers</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold text-blue-500">1200+</h3>
            <p className="text-gray-400">Leads Managed</p>
          </div>

          <div>
            <h3 className="text-4xl font-bold text-blue-500">95%</h3>
            <p className="text-gray-400">Satisfaction</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="mt-24 text-center mb-20">
        <h2 className="text-3xl font-bold">Ready to Grow Your Business?</h2>

        <p className="mt-4 text-gray-400">
          Start managing your customers smarter today.
        </p>

        <a
          href="/register"
          className="inline-block mt-6 px-8 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Start Free
        </a>
      </section>
    </div>
  );
}
