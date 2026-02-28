import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const useLeads = (initialPage = 1, limit = 10) => {
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(0);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [loading, setLoading] = useState(false);

  const ReduxUniversity = useSelector((state) => state.university);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/get-all-lead-students`,
        {
          params: {
            page,
            limit,
            university: ReduxUniversity?.id,
          },
          withCredentials: true,
        }
      );
      const { data, pagination } = res.data;
      setLeads(data);
      setTotal(pagination.total);
      setFrom(pagination.from);
      setTo(pagination.to);
      setHasNextPage(pagination.hasNextPage);
      setHasPrevPage(pagination.hasPrevPage);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ReduxUniversity?.id) {
      fetchLeads();
    }
  }, [page, limit, ReduxUniversity?.id]);

  return {
    leads,
    page,
    setPage,
    limit,
    total,
    from,
    to,
    hasNextPage,
    hasPrevPage,
    loading,
    refetchLeads: fetchLeads,
  };
};

export default useLeads;
