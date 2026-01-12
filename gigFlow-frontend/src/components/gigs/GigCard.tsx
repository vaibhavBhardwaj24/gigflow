import { useNavigate } from "react-router-dom";

interface Gig {
  _id: string;
  title: string;
  description: string;
  budget: number;
  status: "open" | "assigned";
  ownerId: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface GigCardProps {
  gig: Gig;
}

const GigCard = ({ gig }: GigCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/gigs/${gig._id}`)}
      className="group relative card-interactive overflow-hidden"
    >
      {/* Gradient Border Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-xl" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-display font-semibold line-clamp-2 group-hover:text-primary-200 transition-colors">
            {gig.title}
          </h3>
          <span
            className={`badge ml-2 flex-shrink-0 ${
              gig.status === "open" ? "badge-open" : "badge-assigned"
            }`}
          >
            {gig.status}
          </span>
        </div>

        <p className="text-white/70 mb-4 line-clamp-3 leading-relaxed">
          {gig.description}
        </p>

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/10">
          <div>
            <p className="text-sm text-white/60 mb-1">Budget</p>
            <p className="text-2xl font-bold text-primary-300 group-hover:text-primary-200 transition-colors">
              ${gig.budget}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/60 mb-1">Posted by</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-sm font-semibold">
                {gig.ownerId.name.charAt(0).toUpperCase()}
              </div>
              <p className="text-sm font-medium">{gig.ownerId.name}</p>
            </div>
          </div>
        </div>

        {/* View Details Indicator */}
        <div className="mt-4 flex items-center text-primary-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-sm font-medium">View Details</span>
          <svg
            className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default GigCard;
