
import React, { useState } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("resume", file);
    setLoading(true);

    const payment = await axios.post("/api/pay"); // simulate Razorpay
    if (!payment.data.success) return;

    const res = await axios.post("/api/analyze", formData);
    setResult(res.data);
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Resume Analyzer</h1>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
      >
        Analyze
      </button>
      {loading && <p>Analyzing...</p>}
      {result && (
        <div className="mt-6 p-4 border rounded">
          <p><strong>ATS Score:</strong> {result.score}/100</p>
          <p><strong>Tips:</strong> {result.tips}</p>
        </div>
      )}
    </div>
  );
}
