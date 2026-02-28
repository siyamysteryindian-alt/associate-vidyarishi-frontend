import React, { useEffect, useState } from "react";

const Stepper = ({ steps, currentStep }) => {
  const [newSteps, setNewSteps] = useState([]);

  const updateStep = (stepNumber, stepsArray) => {
    return stepsArray.map((step, index) => ({
      ...step,
      completed: index < stepNumber,
      selected: index === stepNumber,
      highlighted: index <= stepNumber,
    }));
  };

  useEffect(() => {
    const initialSteps = steps.map((step, index) => ({
      description: step,
      completed: false,
      highlighted: index === 0,
      selected: index === 0,
    }));

    const current = updateStep(currentStep - 1, initialSteps);
    setNewSteps(current);
  }, [steps, currentStep]);

  return (
    <div className="w-full py-4">
      <div className="w-full overflow-x-auto">
        <div className="flex items-center justify-center gap-4 md:gap-8 min-w-max px-2">
          {newSteps.map((step, index) => (
            <div key={index} className="flex items-center">
              {/* Circle + Label */}
              <div className="relative flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`h-11 w-11 md:h-11 md:w-11 rounded-full flex items-center justify-center border text-xs md:text-sm
                    transition-all duration-300
                    ${
                      step.completed
                        ? "bg-green-600 border-green-600 text-white shadow-md shadow-green-400/40 scale-100"
                        : step.selected
                        ? "bg-pink-600 border-pink-600 text-white shadow-md shadow-pink-400/40 scale-100"
                        : "bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-700 text-gray-400"
                    }
                  `}
                >
                  {step.completed ? (
                    <span className="text-base md:text-lg font-bold">✓</span>
                  ) : (
                    <span className="font-semibold">{index + 1}</span>
                  )}
                </div>

                {/* Label */}
                <p
                  className={`mt-2 text-[10px] md:text-xs font-medium text-center px-1 max-w-[88px] md:max-w-[110px] truncate
                    transition-all duration-300
                    ${
                      step.selected || step.completed
                        ? "text-slate-900 dark:text-slate-50"
                        : "text-slate-400 dark:text-slate-500"
                    }
                  `}
                  title={step.description}
                >
                  {step.description}
                </p>
              </div>

              {/* Connector Line */}
              {index !== newSteps.length - 1 && (
                <div
                  className={`h-[2px] md:h-[3px] w-10 md:w-16 mx-2 rounded-full transition-all duration-500
                    ${
                      step.completed
                        ? "bg-gradient-to-r from-green-500 to-green-600"
                        : "bg-slate-200 dark:bg-slate-700"
                    }
                  `}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stepper;
