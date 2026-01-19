import React from "react";

function FeatureGrid({ features }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mt-24 px-6">
      {features.map((item, index) => (
        <div
          key={index}
          className="p-8 rounded-2xl bg-slate-700 hover:bg-slate-600 hover:-translate-y-2 transition-all duration-300 shadow-xl"
        >
          <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
          <p className="text-gray-300">{item.desc}</p>
        </div>
      ))}
    </section>
  );
}

export default FeatureGrid;
