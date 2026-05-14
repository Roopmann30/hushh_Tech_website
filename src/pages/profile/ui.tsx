import React from 'react';
import HushhTechBackHeader from '../../components/hushh-tech-back-header/HushhTechBackHeader';
import HushhTechCta, { HushhTechCtaVariant } from '../../components/hushh-tech-cta/HushhTechCta';
import HushhTechFooter, { HushhFooterTab } from '../../components/hushh-tech-footer/HushhTechFooter';
import { useProfileLogic } from './logic';

const playfair = { fontFamily: "'Playfair Display', serif" };

const ProfilePage: React.FC = () => {
  const {
    onboardingStatus,
    primaryCTA,
    handleDiscoverFundA,
  } = useProfileLogic();

  return (
    <div className="flex flex-col min-h-screen bg-white selection:bg-hushh-blue selection:text-white overflow-x-hidden">
      {/* header */}
      <HushhTechBackHeader rightType="hamburger" />

      {/* scrollable content */}
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-8 sm:px-6 md:px-12 lg:px-20 animate-in fade-in duration-700">
        <div className="w-full max-w-[440px] md:max-w-[560px] lg:max-w-[640px] flex flex-col items-start md:items-center gap-8 md:gap-10">

          {/* pill badge - Added aria-label */}
          <span
            className="inline-flex items-center gap-1.5 rounded-full border border-hushh-blue/20 bg-hushh-blue/5 px-4 py-1.5 transition-colors hover:bg-hushh-blue/10 cursor-default"
            role="status"
          >
            <span className="material-symbols-outlined text-[10px] text-hushh-blue uppercase" aria-hidden="true">person</span>
            <span className="text-[10px] tracking-[0.14em] uppercase text-hushh-blue font-semibold">
              Profile
            </span>
          </span>

          {/* headline */}
          <div className="text-left md:text-center space-y-3 lg:space-y-4">
            <h1
              className="text-[32px] md:text-[42px] lg:text-[52px] leading-[1.1] tracking-tight text-gray-900"
              style={playfair}
            >
              Investing in the{' '}
              <span className="text-gray-400 italic font-light">Future.</span>
            </h1>
            <p className="text-[15px] md:text-[17px] lg:text-[18px] leading-relaxed text-gray-500 max-w-[360px] md:max-w-[480px] lg:max-w-[540px] md:mx-auto">
              The AI-powered Berkshire Hathaway. We combine AI and human expertise to invest in exceptional businesses for long-term value creation.
            </p>
          </div>

          {/* action buttons - Optimized gap for mobile tap targets */}
          <div
            className="w-full max-w-[440px] grid gap-4 mt-2 sm:grid-cols-2 sm:items-stretch"
            data-testid="profile-cta-group"
          >
            <HushhTechCta
              onClick={primaryCTA.action}
              variant={HushhTechCtaVariant.BLACK}
              disabled={onboardingStatus.loading}
              className="w-full h-[52px] sm:h-auto" // Consistent iOS height
            >
              {onboardingStatus.loading ? (
                <span className="flex items-center gap-2">
                  {/* Optional: Add a small spinner here if your component supports it */}
                  Loading...
                </span>
              ) : primaryCTA.text}
            </HushhTechCta>
            <HushhTechCta
              onClick={handleDiscoverFundA}
              variant={HushhTechCtaVariant.WHITE}
              className="w-full h-[52px] sm:h-auto"
            >
              Discover Fund A
            </HushhTechCta>
          </div>

          {/* trust indicators - Improved semantic structure */}
          <div className="flex flex-wrap items-center justify-start md:justify-center gap-6 md:gap-8 mt-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse" aria-hidden="true" />
              <p className="text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-gray-400 font-semibold">
                SEC Registered
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[14px] text-hushh-blue" aria-hidden="true">lock</span>
              <p className="text-[10px] md:text-[11px] tracking-[0.18em] uppercase text-gray-400 font-semibold">
                Bank Level Security
              </p>
            </div>
          </div>

          {/* tagline */}
          <p className="text-[12px] md:text-[13px] text-gray-400 tracking-wide text-left md:text-center mt-2 opacity-80">
            Secure. Private. AI-Powered.
          </p>
        </div>
      </main>

      {/* Footer Nav */}
      <HushhTechFooter activeTab={HushhFooterTab.PROFILE} />
    </div>
  );
};

export default ProfilePage;