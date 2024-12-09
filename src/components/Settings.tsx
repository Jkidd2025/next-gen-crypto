import { ProfileSettings } from "./settings/ProfileSettings";
import { NotificationSettings } from "./settings/NotificationSettings";
import { AppearanceSettings } from "./settings/AppearanceSettings";
import { AccountSettings } from "./settings/AccountSettings";

export const Settings = () => {
  return (
    <div className="space-y-6">
      <ProfileSettings />
      <AccountSettings />
      <NotificationSettings />
      <AppearanceSettings />
    </div>
  );
};