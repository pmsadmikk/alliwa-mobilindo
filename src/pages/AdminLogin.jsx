
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { LockKeyhole, LogIn } from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const { login, user, isAdmin, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Memeriksa sesi...
      </div>
    );
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const { error } = await login(email, password);

    if (error) {
      setError(error.message);
    }

    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-5">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#80D927] rounded-xl flex items-center justify-center mx-auto mb-5">
            <LockKeyhole size={26} className="text-black" />
          </div>

          <h1 className="text-2xl font-bold text-[#111111]">
            ALLIWA MOBILINDO
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Admin Dashboard Login
          </p>
        </div>

        {user && !isAdmin && (
          <div className="bg-yellow-50 text-yellow-800 text-sm p-3 rounded-lg mb-5">
            Akun ini tidak memiliki akses administrator.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email admin"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#80D927]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-[#80D927]"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#80D927] hover:bg-[#6fbe20] disabled:opacity-60 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <LogIn size={18} />
            {submitting ? "Memproses..." : "Login Admin"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-8">
          ALLIWA MOBILINDO © 2026
        </p>
      </div>
    </div>
  );
}
