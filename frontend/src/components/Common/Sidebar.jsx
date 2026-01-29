
const Sidebar = ({ links }) => {
  return (
    <div className="w-60 bg-gray-100 h-screen p-4 shadow">
      <ul className="space-y-3">
        {links.map((link, i) => (
          <li key={i} className="cursor-pointer hover:bg-gray-300 p-2 rounded">{link}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
