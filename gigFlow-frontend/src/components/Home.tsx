import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-accent-500/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "1s" }}
      />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Hero Section */}
        <div className="mb-16 animate-fade-in-up">
          <h1 className="text-7xl md:text-8xl font-display font-bold mb-6 gradient-text">
            Welcome to GigFlow
          </h1>
          <p
            className="text-2xl md:text-3xl text-white/90 mb-4 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            The modern freelance marketplace
          </p>
          <p
            className="text-xl text-white/70 mb-12 animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            Where talent meets opportunity in perfect harmony
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-20 animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              to="/signup"
              className="btn-primary text-lg px-10 py-4 shadow-glow"
            >
              Get Started Free
            </Link>
            <Link to="/gigs" className="btn-secondary text-lg px-10 py-4">
              Explore Gigs
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            className="card-interactive group animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
              💼
            </div>
            <h3 className="text-2xl font-display font-semibold mb-3 text-primary-200">
              Post Gigs
            </h3>
            <p className="text-white/70 leading-relaxed">
              Share your project and connect with talented freelancers ready to
              bring your vision to life
            </p>
          </div>

          <div
            className="card-interactive group animate-fade-in-up"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
              🎯
            </div>
            <h3 className="text-2xl font-display font-semibold mb-3 text-accent-200">
              Submit Bids
            </h3>
            <p className="text-white/70 leading-relaxed">
              Showcase your expertise and compete for exciting projects that
              match your skills
            </p>
          </div>

          <div
            className="card-interactive group animate-fade-in-up"
            style={{ animationDelay: "0.7s" }}
          >
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
              🚀
            </div>
            <h3 className="text-2xl font-display font-semibold mb-3 text-emerald-200">
              Get Hired
            </h3>
            <p className="text-white/70 leading-relaxed">
              Receive instant real-time notifications when you're selected for a
              project
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div
          className="mt-20 grid grid-cols-3 gap-8 animate-fade-in-up"
          style={{ animationDelay: "0.8s" }}
        >
          <div className="glass-strong rounded-xl p-6">
            <p className="text-4xl font-bold text-primary-300 mb-2">1000+</p>
            <p className="text-white/60">Active Gigs</p>
          </div>
          <div className="glass-strong rounded-xl p-6">
            <p className="text-4xl font-bold text-accent-300 mb-2">500+</p>
            <p className="text-white/60">Freelancers</p>
          </div>
          <div className="glass-strong rounded-xl p-6">
            <p className="text-4xl font-bold text-emerald-300 mb-2">98%</p>
            <p className="text-white/60">Success Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
