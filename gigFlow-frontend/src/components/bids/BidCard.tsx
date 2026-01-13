import { useState } from "react";
import { useAppDispatch } from "../../store/hooks";
import { hireBid } from "../../store/slices/bidSlice";

interface Bid {
  _id: string;
  freelancerId: {
    _id: string;
    name: string;
    email: string;
  };
  message: string;
  proposedPrice: number;
  status: "pending" | "hired" | "rejected";
  createdAt: string;
}

interface BidCardProps {
  bid: Bid;
  isOwner: boolean;
  onHireSuccess?: () => void;
}

const BidCard = ({ bid, isOwner, onHireSuccess }: BidCardProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleHire = async () => {
    setLoading(true);
    await dispatch(hireBid(bid._id));
    setLoading(false);
    setShowConfirm(false);
    // Navigate to dashboard on success
    if (onHireSuccess) {
      onHireSuccess();
    }
  };

  return (
    <div className="glass-dark rounded-lg p-6 transition-all hover:bg-white/10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-lg font-semibold">{bid.freelancerId.name}</h4>
          <p className="text-sm text-white/60">{bid.freelancerId.email}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-accent-300">
            ${bid.proposedPrice}
          </p>
          <span
            className={`badge ${
              bid.status === "pending"
                ? "badge-pending"
                : bid.status === "hired"
                ? "badge-hired"
                : "badge-rejected"
            }`}
          >
            {bid.status}
          </span>
        </div>
      </div>

      <p className="text-white/80 mb-4">{bid.message}</p>

      {isOwner && bid.status === "pending" && (
        <div className="mt-4 pt-4 border-t border-white/10">
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="btn-primary w-full"
            >
              Hire This Freelancer
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-yellow-300 text-sm">
                Are you sure? This will reject all other bids.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleHire}
                  disabled={loading}
                  className="btn-primary flex-1"
                >
                  {loading ? "Hiring..." : "Confirm"}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BidCard;
