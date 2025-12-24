import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./Pages/HomePage";
import AttendanceCalculator from "./Pages/AttendanceCalculator";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import PdfTools from "./Pages/pdf/PdfTools";
import PdfMerge from "./Pages/pdf/PdfMerge";
import PdfSplit from "./Pages/pdf/PdfSplit";
import PdfRotate from "./Pages/pdf/PdfRotate";
import JpgToPdf from "./Pages/pdf/jpgtoPdf";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tools/attendance" element={<AttendanceCalculator />} />
        <Route path="/tools/pdf" element={<PdfTools />} />
        <Route path="/tools/pdf/merge" element={<PdfMerge />} />
        <Route path="/tools/pdf/split" element={<PdfSplit />} />
        <Route path="/tools/pdf/rotate" element={<PdfRotate />} />
        <Route path="/tools/pdf/jpg-to-pdf" element={<JpgToPdf />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </Layout>
  );
}
