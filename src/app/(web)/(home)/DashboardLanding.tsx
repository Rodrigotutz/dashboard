import { HeroSection } from "./hero-section";
import { FeaturesSection } from "./features-section";
import { StatsSection } from "./stats-section";

export function DashboardLanding() {
  return (
    <div className="text-white pb-20">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
    </div>
  );
}
