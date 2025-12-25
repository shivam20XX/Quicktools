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
import PdfCompress from "./Pages/pdf/PdfCompress";
import ImageTools from "./Pages/image/ImageTools";
import ImageCompress from "./Pages/image/ImageCompress";
import ImageResize from "./Pages/image/ImageResize";
import ImageConvert from "./Pages/image/ImageConvert";
import PdfToJpg from "./Pages/image/PdfToJpg";

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
        <Route path="/tools/pdf/compress" element={<PdfCompress />} />
        <Route path="/tools/image" element={<ImageTools />} />
        <Route path="/tools/image/compress" element={<ImageCompress />} />
        <Route path="/tools/image/resize" element={<ImageResize />} />
        <Route path="/tools/image/convert" element={<ImageConvert />} />
        <Route path="/tools/image/pdf-to-jpg" element={<PdfToJpg />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </Layout>
  );
}
