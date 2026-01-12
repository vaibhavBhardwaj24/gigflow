import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchGigs, setSearchQuery } from "../../store/slices/gigSlice";
import GigCard from "./GigCard";

const GigFeed = () => {
  const dispatch = useAppDispatch();
  const { gigs, loading, searchQuery } = useAppSelector((state) => state.gigs);
  const [localSearch, setLocalSearch] = useState("");

  useEffect(() => {
    dispatch(fetchGigs(searchQuery));
  }, [dispatch, searchQuery]);

  const handleSearch = () => {
    dispatch(setSearchQuery(localSearch));
    dispatch(fetchGigs(localSearch));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 animate-fade-in">
        <h1 className="text-5xl font-display font-bold mb-4">Browse Gigs</h1>
        <p className="text-white/80 text-lg">Find your next opportunity</p>
      </div>

      <div className="mb-8 flex gap-4">
        <input
          type="text"
          placeholder="Search gigs..."
          className="input-field flex-1"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch} className="btn-primary">
          Search
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card h-48 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : gigs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/60 text-lg">
            No gigs found. Be the first to post one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
          {gigs.map((gig) => (
            <GigCard key={gig._id} gig={gig} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GigFeed;
