const PaymentDetailsCard = ({ UniversityDetails, universityId }) => {
  // Filter the array to find the selected university
  const selectedUniversity = UniversityDetails?.find(
    (u) => u?._id === universityId
  );

  if (!selectedUniversity) {
    return (
      <div className="bg-white p-6 text-gray-500 rounded-2xl shadow border">
        No payment details available for the selected university.
      </div>
    );
  }

  const payment = selectedUniversity?.PaymentDetailsModel;

  return (
    <div className="bg-white shadow-xl border border-gray-200 rounded-2xl mb-8">
      <div className="px-6 py-4 font-bold text-sm text-primary border-b">
        Payment Details
      </div>

      <div className="px-6 py-5 text-sm text-gray-700">
        {selectedUniversity?.universityName && (
          <div className="font-semibold text-base text-gray-900 mb-3">
            {selectedUniversity.universityName}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* Labels */}
          <div className="flex flex-col gap-3 text-gray-500 font-medium">
            <div>Account Holder</div>
            <div>IFSC Code</div>
            <div>Account Number</div>
            <div>Bank Name</div>
            <div>Branch Name</div>
          </div>

          {/* Values */}
          <div className="flex flex-col gap-3 font-semibold text-gray-900">
            <div>{payment?.Name || "N/A"}</div>
            <div>{payment?.IFSC || "N/A"}</div>
            <div>{payment?.AccountNumber || "N/A"}</div>
            <div>{payment?.BankName || "N/A"}</div>
            <div>{payment?.Branch || "N/A"}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsCard;
