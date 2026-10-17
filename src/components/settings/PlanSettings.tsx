import { SettingsCard, SettingsSectionHeader } from './shared';
import { PricingSection } from '../PricingSection';

export function PlanSettings() {
  return (
    <div className="w-full">
      <SettingsCard>
        <SettingsSectionHeader
          title="Plan & Billing"
          description="View your current plan and upgrade to Pro for unlimited simulations, mind maps, analogies, and full analytics."
        />
        <PricingSection embedded />
      </SettingsCard>
    </div>
  );
}
