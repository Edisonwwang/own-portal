import { BackupButton } from "@/components/settings/BackupButton";
import { PageHeader } from "@/components/ui/PageHeader";

const linkClass =
  "inline-flex items-center rounded-lg border border-[#2a2a2a] px-4 py-2 text-sm text-[#e5e5e5] transition-colors hover:border-[#c9a84c]";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" />

      <section className="space-y-3">
        <h2 className="text-lg font-medium text-stone-100">Export data</h2>
        <div className="flex flex-wrap gap-3">
          <a href="/api/export/json" className={linkClass}>
            Download JSON
          </a>
          <a href="/api/export/markdown" className={linkClass}>
            Download Markdown
          </a>
        </div>
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-medium text-stone-100">Backup</h2>
        <BackupButton />
      </section>

      <section className="mt-10 space-y-3">
        <h2 className="text-lg font-medium text-stone-100">About</h2>
        <p className="text-sm text-stone-400">Personal Portal v1</p>
      </section>
    </>
  );
}
