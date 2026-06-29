import React from "react";

const LandscapeGuard = () => {
  return (
    <div className="landscape-guard-overlay">
      <style>{`
        .landscape-guard-overlay {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 99999;
          background: radial-gradient(ellipse at 50% 40%, #1e1136 0%, #0d071a 70%, #04020a 100%);
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 25px;
          padding: 30px;
          text-align: center;
          font-family: 'Poppins', sans-serif;
          user-select: none;
        }

        @media (orientation: landscape) and (max-width: 1024px) and (max-height: 768px) {
          .landscape-guard-overlay {
            display: flex !important;
          }
        }

        /* Animations */
        @keyframes lg-rotate-phone {
          0%, 15% {
            transform: rotate(90deg);
          }
          50%, 65% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(90deg);
          }
        }

        @keyframes lg-pulse-glow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.1);
          }
        }

        @keyframes lg-fade-in {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes lg-badge-glow {
          0%, 100% {
            box-shadow: 0 0 0 1.5px rgba(148, 60, 231, 0.2);
            border-color: rgba(148, 60, 231, 0.3);
          }
          50% {
            box-shadow: 0 0 15px rgba(148, 60, 231, 0.5);
            border-color: rgba(148, 60, 231, 0.8);
          }
        }

        /* Visual Elements */
        .lg-glow-orb {
          position: absolute;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(148, 60, 231, 0.15), transparent 70%);
          animation: lg-pulse-glow 3s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
        }

        .lg-phone-container {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 120px;
          height: 120px;
        }

        .lg-phone {
          width: 48px;
          height: 84px;
          border: 3px solid #943ce7;
          border-radius: 12px;
          position: relative;
          box-shadow: 0 0 20px rgba(148, 60, 231, 0.3);
          animation: lg-rotate-phone 3.5s cubic-bezier(0.645, 0.045, 0.355, 1) infinite;
          background: rgba(255, 255, 255, 0.02);
        }

        .lg-phone::before {
          content: '';
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 3px;
          background: #943ce7;
          border-radius: 2px;
        }

        .lg-phone::after {
          content: '';
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 8px;
          border: 1px solid #943ce7;
          border-radius: 50%;
        }

        .lg-text-container {
          position: relative;
          z-index: 2;
          animation: lg-fade-in 0.6s ease both;
          animation-delay: 0.1s;
        }

        .lg-title {
          font-size: 1.7rem;
          font-weight: 800;
          margin: 0 0 10px 0;
          letter-spacing: 0.5px;
          background: linear-gradient(90deg, #ee7752 0%, #943ce7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 10px rgba(148, 60, 231, 0.2));
        }

        .lg-subtitle {
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          line-height: 1.6;
          max-width: 320px;
        }

        .lg-subtitle strong {
          color: #ee7752;
          font-weight: 600;
        }

        .lg-divider {
          position: relative;
          z-index: 2;
          width: 120px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(148, 60, 231, 0.4), transparent);
          animation: lg-fade-in 0.6s ease both;
          animation-delay: 0.2s;
        }

        .lg-badge {
          position: relative;
          z-index: 2;
          animation: lg-fade-in 0.6s ease both, lg-badge-glow 3s ease-in-out infinite;
          animation-delay: 0.3s, 0s;
          padding: 8px 20px;
          border-radius: 30px;
          border: 1.5px solid rgba(148, 60, 231, 0.3);
          background: rgba(148, 60, 231, 0.05);
          color: #a29bfe;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 1.5px;
        }
      `}</style>

      {/* Ambient glow orb */}
      <div className="lg-glow-orb" />

      {/* Rotating phone representation */}
      <div className="lg-phone-container">
        <div className="lg-phone" />
      </div>

      {/* Text message block */}
      <div className="lg-text-container">
        <h2 className="lg-title">Rotate Your Device</h2>
        <p className="lg-subtitle">
          This game is optimized for <strong>portrait mode</strong>.<br />
          Please rotate your device upright to continue.
        </p>
      </div>

      {/* Decorative divider */}
      <div className="lg-divider" />

      {/* Portrait mode indicator badge */}
      <div className="lg-badge">
        ↕ PORTRAIT ONLY
      </div>
    </div>
  );
};

export default LandscapeGuard;
