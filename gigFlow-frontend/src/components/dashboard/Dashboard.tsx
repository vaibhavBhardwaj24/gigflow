import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { fetchMyBids } from "../../store/slices/bidSlice";
import { fetchGigs } from "../../store/slices/gigSlice";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { gigs } = useAppSelector((state) => state.gigs);
  const { myBids } = useAppSelector((state) => state.bids);

  useEffect(() => {
    dispatch(fetchGigs());
    dispatch(fetchMyBids());
  }, [dispatch]);

  console.log("Dashboard - User:", user);
  console.log("Dashboard - My Bids:", myBids);
  console.log("Dashboard - My Bids Length:", myBids.length);

  const myGigs = gigs.filter((gig) => {
    return gig.ownerId._id === user?.id;
  });
  const openGigs = myGigs.filter((gig) => gig.status === "open");

  const hiredBids = myBids.filter((bid) => bid.status === "hired");

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12 animate-fade-in">
        <h1 className="text-5xl font-display font-bold mb-2">Dashboard</h1>
        <p className="text-white/80 text-lg">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-slide-up">
        <div className="card">
          <p className="text-white/60 text-sm mb-1">My Gigs</p>
          <p className="text-4xl font-bold text-primary-300">{myGigs.length}</p>
        </div>
        <div className="card">
          <p className="text-white/60 text-sm mb-1">Open Gigs</p>
          <p className="text-4xl font-bold text-green-300">{openGigs.length}</p>
        </div>
        <div className="card">
          <p className="text-white/60 text-sm mb-1">My Bids</p>
          <p className="text-4xl font-bold text-accent-300">{myBids.length}</p>
        </div>
        <div className="card">
          <p className="text-white/60 text-sm mb-1">Hired</p>
          <p className="text-4xl font-bold text-emerald-300">
            {hiredBids.length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h2 className="text-2xl font-display font-bold mb-6">
            My Posted Gigs
          </h2>
          {myGigs.length === 0 ? (
            <p className="text-white/60 text-center py-8">No gigs posted yet</p>
          ) : (
            <div className="space-y-4">
              {myGigs.map((gig) => (
                <div key={gig._id} className="glass-dark rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{gig.title}</h3>
                    <span
                      className={`badge ${
                        gig.status === "open" ? "badge-open" : "badge-assigned"
                      }`}
                    >
                      {gig.status}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm line-clamp-2">
                    {gig.description}
                  </p>
                  <p className="text-primary-300 font-bold mt-2">
                    ${gig.budget}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="text-2xl font-display font-bold mb-6">My Bids</h2>
          {myBids.length === 0 ? (
            <p className="text-white/60 text-center py-8">
              No bids submitted yet
            </p>
          ) : (
            <div className="space-y-4">
              {myBids.map((bid) => {
                const gigData =
                  typeof bid.gigId === "object" ? bid.gigId : null;
                return (
                  <div key={bid._id} className="glass-dark rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">
                        {gigData?.title || "Gig"}
                      </h3>
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
                    <p className="text-white/70 text-sm line-clamp-2">
                      {bid.message}
                    </p>
                    <p className="text-accent-300 font-bold mt-2">
                      ${bid.proposedPrice}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
