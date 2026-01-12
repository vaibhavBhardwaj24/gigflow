import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { createGig } from "../../store/slices/gigSlice";

const CreateGigForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await dispatch(
      createGig({
        title: formData.title,
        description: formData.description,
        budget: Number(formData.budget),
      })
    );

    if (createGig.fulfilled.match(result)) {
      navigate("/gigs");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="card animate-scale-in">
        <h2 className="text-3xl font-display font-bold mb-8">Post a New Gig</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              required
              className="input-field"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Build a responsive website"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              required
              rows={6}
              className="input-field resize-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the project requirements..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Budget ($)</label>
            <input
              type="number"
              required
              min="1"
              className="input-field"
              value={formData.budget}
              onChange={(e) =>
                setFormData({ ...formData, budget: e.target.value })
              }
              placeholder="500"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? "Posting..." : "Post Gig"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/gigs")}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGigForm;
