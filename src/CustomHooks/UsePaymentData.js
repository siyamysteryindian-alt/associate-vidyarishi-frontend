import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const UsePaymentData = () => {
  const [PaymentLoading, setPaymentLoading] = useState(false);
  const [PaymentError, setPaymentError] = useState(null);
  const [Payment, setPayment] = useState([]);

  const [PaymentCurrentPage, setPaymentCurrentPage] = useState(1);
  const [PaymentTotalPages, setPaymentTotalPages] = useState(1);
  const [PaymentLimit, setPaymentLimit] = useState();
  const [PaymentTotalDocs, setPaymentTotalDocs] = useState();

  const UniversityGetDataFromRedux = useSelector((state) => state.university);

  const GetAllPaymentData = async (page, limit = 1000, searchQuery = "") => {
    setPaymentLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/get-payment-by-pagination`,
        {
          params: {
            page,
            limit,
            query: searchQuery,
            university: UniversityGetDataFromRedux?.id,
          },
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        setPayment(response?.data?.data?.payments);
        setPaymentCurrentPage(response?.data?.data?.currentPage);
        setPaymentTotalPages(response?.data?.data?.totalPages);
        setPaymentTotalDocs(response?.data?.data?.totalDocs);
        setPaymentLimit(response?.data?.data?.limit);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      setPaymentError(error.response?.data?.message || "An error occurred.");
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) {
      toast.error("You are already on the first page.");
      return;
    }

    if (pageNumber > PaymentTotalPages) {
      toast.error(`Only Pages ${PaymentTotalPages} Available`);
    } else {
      setPaymentCurrentPage(pageNumber);
    }
  };

  return {
    PaymentLoading,
    PaymentError,
    Payment,
    GetAllPaymentData,

    PaymentCurrentPage,
    PaymentTotalPages,
    PaymentLimit,
    PaymentTotalDocs,
    handlePageChange,
  };
};

export default UsePaymentData;
