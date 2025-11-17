import { useState, useEffect } from "react";
import { getRecords } from "../services/patientApi";
import { motion } from "framer-motion";
import { FileText, Search, ChevronDown } from "lucide-react";

export default function RecordsPage() {
  const [records, setRecords] = useState([]);
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getRecords();
        setRecords(data);
      } catch (err) {
        console.error("Failed to load records:", err);
      }
    };
    load();
  }, []);

  const filtered = records.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Medical Records</h2>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-xl shadow flex items-center gap-2 border">
        <Search className="text-gray-500 w-5" />
        <input
          placeholder="Search records..."
          className="w-full outline-none"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* RECORD CARDS */}
      {filtered.map((record, i) => (
        <motion.div
          key={record.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => setOpenId(openId === record.id ? null : record.id)}
          className="bg-white p-4 rounded-xl border shadow cursor-pointer"
        >
          <div className="flex justify-between">
            <div className="flex items-center gap-3">
              <FileText className="text-teal-600" />
              <div>
                <p className="font-semibold">{record.title}</p>
                <p className="text-gray-500 text-sm">{record.date}</p>
              </div>
            </div>

            <ChevronDown
              className={`transition ${openId === record.id ? "rotate-180" : ""}`}
            />
          </div>

          {openId === record.id && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-gray-700"
            >
              <p>{record.description}</p>

              {record.file && (
                <a href={record.file} className="text-blue-600 underline block mt-2">
                  View File
                </a>
              )}
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
