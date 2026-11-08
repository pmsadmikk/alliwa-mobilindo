
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

import { supabase } from "../lib/supabase";

const VehicleContext = createContext(null);

export function VehicleProvider({ children }) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshVehicles = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Gagal mengambil data kendaraan:", error.message);
      setError(error.message);
      setLoading(false);
      return;
    }

    setVehicles(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshVehicles();
  }, [refreshVehicles]);

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        setVehicles,
        loading,
        error,
        refreshVehicles,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
}

export function useVehicles() {
  const context = useContext(VehicleContext);

  if (!context) {
    throw new Error(
      "useVehicles harus digunakan di dalam VehicleProvider"
    );
  }

  return context;
}
