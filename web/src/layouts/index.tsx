import { UiHeader } from "../components/UiHeader";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <UiHeader />
      <main className="flex-1 py-2 px-4">{children}</main>
      <footer className="bg-blue-800 text-white p-4 text-center">
        &copy; 2026 SendFlow Test. All rights reserved.
      </footer>
    </div>
  );
};
