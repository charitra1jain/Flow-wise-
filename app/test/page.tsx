import DebugTracker from "@/components/debug-tracker"
import SampleDataGenerator from "@/components/sample-data-generator"

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>Test Page</div>

      <div className="mt-8">
        <SampleDataGenerator />
      </div>

      <DebugTracker />
    </main>
  )
}
