import RootLayout from "@/layouts/layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Introduction from "../docs-site/pages/index.mdx";
import GettingStarted from "../docs-site/pages/getting-started.mdx";
import NotFound from "./components/not-found";

export default function App() {
  return (
    <BrowserRouter>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Introduction />} />
          <Route path="/getting-started" element={<GettingStarted />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </RootLayout>
    </BrowserRouter>
  );
}
