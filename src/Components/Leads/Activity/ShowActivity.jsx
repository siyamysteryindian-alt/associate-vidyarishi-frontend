
const activityData = [
  {
    date: "14 Jul, 2025 09:01 AM",
    type: "EmailSent",
    details: [
      "Subject - India's Smartest MBA Choice: MUJ Online. Here's Why?",
      "FromUserName - Online Manipal",
    ],
  },
  {
    date: "12 Jul, 2025 07:02 PM",
    type: "EmailSent",
    details: [
      "Subject - You're About to Miss Out – MUJ MBA Seats Filling Fast",
      "FromUserName - Online Manipal",
    ],
  },
  {
    date: "10 Jul, 2025 05:19 PM",
    type: "WhatsApp Message",
    details: [
      "Event - Update",
      "CreatedByName - System",
      "EventTime - 7/10/2025 11:49:25 AM",
    ],
  },
  // more...
];

const ActivityModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-y-auto p-8">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
          Activity{" "}
          <span className="text-gray-500">({activityData.length})</span>
        </h2>

        {/* Timeline */}
        <div className="relative pl-8">
          {/* vertical line */}
          <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-400"></div>
          <ul className="space-y-8">
            {activityData.map((item, index) => (
              <li key={index} className="relative">
                {/* Dot */}
                <div className="absolute -left-[19px] top-1 bg-blue-600 border-2 border-white rounded-full w-4 h-2 shadow"></div>

                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium mb-1">
                    {item.date}
                  </span>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base font-semibold text-gray-800">
                      {item.type}
                    </span>
                    <svg
                      className="h-3 w-3 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L15.586 10H3a1 1 0 110-2h12.586l-3.293-3.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    {item.details.map((detail, idx) => (
                      <span key={idx} className="text-sm text-gray-600">
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;
