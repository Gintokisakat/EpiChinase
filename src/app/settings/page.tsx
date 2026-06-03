import { getSettings } from "./actions";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage() {
  const settings = await getSettings();

  if (!settings) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-rice">
        <p className="text-ink/50">Redirigiendo...</p>
      </div>
    );
  }

  return <SettingsClient settings={settings} />;
}
