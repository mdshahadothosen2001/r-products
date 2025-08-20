import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cancelOrder } from "../api/api";
import LoadingSpinner from "../components/LoadingSpinner";

export default function OrderCancel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cancelOrder(id).then(() => navigate("/orders")).finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <LoadingSpinner />;

  return <p>Order cancelled successfully.</p>;
}
