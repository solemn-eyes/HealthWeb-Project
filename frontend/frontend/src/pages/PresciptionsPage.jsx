import React, { useEffect, useState } from "react";
import { getPrescriptions } from "../services/patientApi";

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const load = async () => {
      const p = await getPrescriptions();
      setPrescriptions(p);
    };
    load();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Prescriptions</h2>

      <div className="space-y-3">
        {prescriptions.length === 0 && (
          <div className="text-gray-500">You have no prescriptions yet.</div>
        )}

        {prescriptions.map((pres) => (
          <div
            key={pres.id}
            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
          >
            <div>
              <div className="font-medium">{pres.title}</div>
              <div className="text-sm text-gray-500">
                Issued: {pres.issued_at.substring(0, 10)}
              </div>
              <p className="mt-2 text-gray-600">{pres.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
