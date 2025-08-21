import Table from "~/components/Table";

export default function Home() {
  return (
    <main className="max-w-[1280px] w-full mx-auto flex flex-col gap-4 py-6 px-4 overflow-auto">
      <h2>
        Results of automated GitHub Actions workflows testing React Native
        ecosystem libraries against nightly builds:
      </h2>
      <Table />
    </main>
  );
}
