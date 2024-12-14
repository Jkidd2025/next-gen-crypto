export const Roadmap = () => {
  const milestones = [
    {
      phase: "Phase 1",
      title: "Launch & Community Building",
      items: ["Legal/Compliance"],
    },
    {
      phase: "Phase 2",
      title: "Market Expansion",
      items: ["Exchange Listings", "Marketing Campaigns", "Partnership Development"],
    },
    {
      phase: "Phase 3",
      title: "Payment System Platform",
      items: ["Gateway", "In-store", "Mobile"],
    },
  ];

  return (
    <div className="py-20 bg-white" id="roadmap">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-primary">Roadmap</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {milestones.map((milestone, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-8 shadow-lg">
              <div className="text-accent font-bold mb-4">{milestone.phase}</div>
              <h3 className="text-xl font-bold mb-4">{milestone.title}</h3>
              <ul className="space-y-2">
                {milestone.items.map((item, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};