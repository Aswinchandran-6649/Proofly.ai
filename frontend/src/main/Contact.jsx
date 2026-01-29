import { Navbar } from "./Home";

const Contact = ({ dark }) => (
    
    <>
    <Navbar  />
  <div className={`min-h-screen pt-32 pb-20 px-6 $bg-black text-white" : "bg-white text-gray-900"}`}>
    <div className="max-w-3xl mx-auto p-10 rounded-[2rem] border border-black bg-gradient-to-b from-white/5 to-transparent">
      <h1 className="text-4xl font-bold mb-6">Get in Touch</h1>
      <form className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <input type="text" placeholder="Name" className="w-full p-4 rounded-xl border-black  border border-black outline-none focus:border-blue-500" />
          <input type="email" placeholder="Email" className="w-full p-4 rounded-xl bg-white/5 border border-black  outline-none focus:border-blue-500" />
        </div>
        <textarea placeholder="Message" rows="5" className="w-full p-4 rounded-xl bg-white/5 border border-black  outline-none focus:border-blue-500"></textarea>
        <button className="w-full py-4 bg-blue-600 rounded-xl font-bold hover:bg-blue-700 transition">Send Message</button>
      </form>
    </div>
  </div>
  </>
);
export default Contact;