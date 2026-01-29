import ChartBox from "../../components/Admin/ChartBox";

const Analytics = () => {
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">

      {/* Header */}
       <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-slate-800/60 pb-8">
        <div>
          <h2 className="text-3xl font-black text-black tracking-tight flex items-center gap-3">
            System <span className="text-blue-500">Analytics</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium italic">
            Visual trends and performance reports
          </p>
        </div>


      </header>

      {/* Chart Container */}
      <section className="bg-white shadow-sm rounded-xl p-4 sm:p-6 border border-gray-100">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
          System Usage Chart
        </h3>

        <div className="w-full overflow-auto">
          <ChartBox />
        </div>
      </section>

    </div>
  );
};

export default Analytics;

