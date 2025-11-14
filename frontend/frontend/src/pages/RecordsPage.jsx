import React, { useEffect, useState } from "react";
import { getRecords } from "../services/patientApi";

export default function RecordsPage() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const load = async () => {
      const r = await getRecords();
      setRecords(r);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Medical Records</h2>

      <div className="space-y-3">
        {records.length === 0 && (
          <div className="text-gray-500">You have no medical records yet.</div>
        )}

        {records.map((rec) => (
          <div
            key={rec.id}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <div className="font-medium">{rec.title}</div>
              <div className="text-sm text-gray-500">
                {rec.created_at.substring(0, 10)}
              </div>
              <div className="mt-1 text-gray-600 text-sm">{rec.notes}</div>
            </div>

            {rec.file && (
              <a
                href={rec.file}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Download
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
