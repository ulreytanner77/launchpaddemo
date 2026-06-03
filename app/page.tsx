"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Submission = {
  id: number;
  name: string;
  created_at: string;
};

export default function Home() {
  const [name, setName] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchSubmissions() {
    const { data } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setSubmissions(data);
  }

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await supabase.from("submissions").insert({ name });
    setName("");
    await fetchSubmissions();
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Submissions</h1>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Submit"}
          </button>
        </form>

        <ul className="space-y-2">
          {submissions.map((row) => (
            <li
              key={row.id}
              className="rounded-md border border-gray-200 bg-white px-4 py-3 text-gray-700"
            >
              {row.name}
            </li>
          ))}
          {submissions.length === 0 && (
            <li className="text-gray-400 text-sm">No submissions yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
