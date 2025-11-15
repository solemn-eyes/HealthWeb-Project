import { useState, useEffect } from "react";
import { getRecords } from "../services/patientApi";
import { motion } from "framer-motion";
import { FileText, ChevronDown } from "lucide-react";

export default function RecordsPage() {
  const [records, setRecords] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getRecords();
        setRecords(data);
      } catch (err) {
        console.error("Failed to load records:", err);
      }
    };
    fetch();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Your Medical Records</h2>

      {records.map((record, index) => (
        <motion.div
          key={record.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => setOpenId(openId === record.id ? null : record.id)}
          className="bg-white p-4 rounded-xl border shadow hover:shadow-md cursor-pointer"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FileText className="text-teal-600" />
              <div>
                <p className="font-semibold">{record.title}</p>
                <p className="text-gray-500 text-sm">{record.date}</p>
              </div>
            </div>

            <ChevronDown className={`transition ${openId === record.id ? "rotate-180" : ""}`} />
          </div>

          {openId === record.id && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-gray-700"
            >
              <p>{record.description}</p>
              {record.file && (
                <a
                  href={record.file}
                  target="_blank"
                  className="text-blue-600 underline mt-2 block"
                >
                  View Attached File
                </a>
              )}
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
