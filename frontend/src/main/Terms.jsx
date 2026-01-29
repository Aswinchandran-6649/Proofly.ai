const Terms = ({ title, content, dark }) => (
  <div className={`min-h-screen pt-32 pb-20 px-6 ${dark ? "bg-black text-white" : "bg-white text-gray-900"}`}>
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold mb-12">{title}</h1>
      <div className="prose prose-invert opacity-70 space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-blue-500">1. Introduction</h2>
          <p>Welcome to Proofly. By using our platform, you agree to these terms. Please read them carefully.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4 text-blue-500">2. Usage Rights</h2>
          <p>Proofly provides a decentralized service for warranty management. You own your data, but must use the platform legally.</p>
        </section>
        {/* Add more sections as needed */}
      </div>
    </div>
  </div>
);   
export default Terms