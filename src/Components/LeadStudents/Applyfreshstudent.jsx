import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import StudentApplicationForm from "./Components/LeadStudentApplicationForm";
import StudentIdModal from "./Components/GetStudentIdModal";

const Applyfreshstudent = () => {
  const [studentId, setStudentId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const LoggedUser = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Redirect if studentId was never set
    if (!studentId) {
      const GeneratedRoute = `/${
        LoggedUser.role === "subCenter" ? "sub-center" : LoggedUser.role
      }/show-application-forms`;
      navigate(GeneratedRoute);
    }
  };

  const handleFormSubmit = async (enteredStudentId) => {
    setIsLoading(true);

    try {
      // Simulate API call: replace this with actual call later
      console.log("Checking student ID:", enteredStudentId);
      await new Promise((resolve) => setTimeout(resolve, 1200)); // fake delay

      const isValidId = enteredStudentId && enteredStudentId.length >= 4; // Example validation

      if (isValidId) {
        setStudentId(enteredStudentId);
        setIsModalOpen(false);
      } else {
        alert("Invalid Student ID. Please try again.");
      }
    } catch (error) {
      console.error("Error validating student ID:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 dark:text-gray-200">
              Loading student details...
            </p>
          </div>
        </div>
      ) : (
        <>
          {isModalOpen && (
            <StudentIdModal
              isOpen={isModalOpen}
              onClose={handleModalClose}
              onSubmit={handleFormSubmit}
            />
          )}

          {!isModalOpen && studentId ? (
            <StudentApplicationForm studentId={studentId} />
          ) : null}
        </>
      )}
    </div>
  );
};

export default Applyfreshstudent;
