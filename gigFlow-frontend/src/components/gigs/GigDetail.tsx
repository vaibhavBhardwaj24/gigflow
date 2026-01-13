import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchGigById } from "../../store/slices/gigSlice";
import { fetchBidsForGig } from "../../store/slices/bidSlice";
import BidSubmitForm from "../bids/BidSubmitForm";
import BidCard from "../bids/BidCard";
import NotificationToast from "../common/NotificationToast";

const GigDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentGig } = useAppSelector((state) => state.gigs);
  const { bids } = useAppSelector((state) => state.bids);
  const { user } = useAppSelector((state) => state.auth);
  const [showBidForm, setShowBidForm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchGigById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentGig && user && currentGig.ownerId._id === user.id) {
      dispatch(fetchBidsForGig(currentGig._id));
    }
  }, [currentGig, user, dispatch]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!currentGig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  const isOwner = user && currentGig.ownerId._id === user.id;
  const canBid =
    user && currentGig.ownerId._id !== user.id && currentGig.status === "open";

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="card animate-scale-in mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-display font-bold mb-2">
              {currentGig.title}
            </h1>
            <p className="text-white/70">Posted by {currentGig.ownerId.name}</p>
          </div>
          <span
            className={`badge ${
              currentGig.status === "open" ? "badge-open" : "badge-assigned"
            }`}
          >
            {currentGig.status}
          </span>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-white/80 whitespace-pre-wrap">
            {currentGig.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/10">
          <div>
            <p className="text-white/60 text-sm mb-1">Budget</p>
            <p className="text-3xl font-bold text-primary-300">
              ${currentGig.budget}
            </p>
          </div>
          {canBid && !showBidForm && (
            <button
              onClick={() => setShowBidForm(true)}
              className="btn-primary"
            >
              Submit Bid
            </button>
          )}
        </div>
      </div>

      {showBidForm && canBid && (
        <div className="mb-8">
          <BidSubmitForm
            gigId={currentGig._id}
            onSuccess={() => {
              showToast("Bid submitted successfully! 🎉");
              setTimeout(() => navigate("/dashboard"), 1000);
            }}
          />
        </div>
      )}

      {isOwner && (
        <div className="card animate-slide-up">
          <h2 className="text-2xl font-display font-bold mb-6">
            Received Bids ({bids.length})
          </h2>
          {bids.length === 0 ? (
            <p className="text-white/60 text-center py-8">No bids yet</p>
          ) : (
            <div className="space-y-4">
              {bids.map((bid) => (
                <BidCard
                  key={bid._id}
                  bid={bid}
                  isOwner={isOwner}
                  onHireSuccess={() => {
                    showToast("Freelancer hired successfully! 🎉");
                    setTimeout(() => navigate("/dashboard"), 1000);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {toastMessage && (
        <NotificationToast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default GigDetail;
