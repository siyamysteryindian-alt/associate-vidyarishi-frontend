import { useNavigate, useLocation } from "react-router-dom";

const ShowStudentIdModal = ({ onClose, Show }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    onClose?.();

    // Extract the current path segments
    const pathSegments = location.pathname.split("/");

    // Replace the last segment with "show-lead"
    pathSegments[pathSegments.length - 1] = "show-lead";

    // Join back to form new path
    const newPath = pathSegments.join("/");

    // Navigate to the new path
    navigate(newPath);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all">
      <div className="relative w-[95%] max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
          🎓 Student ID Generated
        </h2>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-6 text-center">
          Your Student ID:{" "}
          <span className="text-blue-600 dark:text-blue-400 font-semibold">
            {Show}
          </span>
        </p>

        <div className="flex justify-center">
          <button
            onClick={handleClick}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200"
          >
            View My Leads
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowStudentIdModal;
