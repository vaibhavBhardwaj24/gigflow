import { useState, FormEvent } from "react";
import { useAppDispatch } from "../../store/hooks";
import { submitBid } from "../../store/slices/bidSlice";

interface BidSubmitFormProps {
  gigId: string;
  onSuccess: () => void;
}

const BidSubmitForm = ({ gigId, onSuccess }: BidSubmitFormProps) => {
  const [formData, setFormData] = useState({ message: "", proposedPrice: "" });
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await dispatch(
      submitBid({
        gigId,
        message: formData.message,
        proposedPrice: Number(formData.proposedPrice),
      })
    );

    if (submitBid.fulfilled.match(result)) {
      setFormData({ message: "", proposedPrice: "" });
      onSuccess();
    }
    setLoading(false);
  };

  return (
    <div className="card animate-scale-in">
      <h3 className="text-2xl font-display font-bold mb-6">Submit Your Bid</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Your Proposal
          </label>
          <textarea
            required
            rows={4}
            className="input-field resize-none"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            placeholder="Explain why you're the best fit for this project..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Proposed Price ($)
          </label>
          <input
            type="number"
            required
            min="1"
            className="input-field"
            value={formData.proposedPrice}
            onChange={(e) =>
              setFormData({ ...formData, proposedPrice: e.target.value })
            }
            placeholder="Enter your price"
          />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Submitting..." : "Submit Bid"}
        </button>
      </form>
    </div>
  );
};

export default BidSubmitForm;
