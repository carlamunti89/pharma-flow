import { useState, useEffect, useMemo } from "react";
import type { Medicamento } from "./types";
import { apiService } from "./services/api";
import { reportService } from "./services/reportService";
import { calculateStats } from "./core/analytics";
import { StatsDashboard } from "./components/StatsDashboard";
import { SearchBar } from "./components/SearchBar";
import { InventoryForm } from "./components/InventoryForm";
import { InventoryList } from "./components/InventoryList";
import { differenceInDays } from "date-fns";
import {
  Download,
  Sun,
  Moon,
  AlertCircle,
  Lock,
  LogOut,
  Mail,
  Key,
} from "lucide-react";
import { useDarkMode } from "./hooks/useDarkMode";

function App() {
  // --- LÓGICA DE LOGIN ---
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("pharma_auth") === "true";
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ADMIN_EMAIL = "admin@pharmaflow.com";
    const ADMIN_PASS = "admin123";

    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      setIsLoggedIn(true);
      localStorage.setItem("pharma_auth", "true");
      setLoginError("");
    } else {
      setLoginError(
        "Credenciales incorrectas. Revisa el email o la contraseña."
      );
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("pharma_auth");
  };

  // --- ESTADOS DE INVENTARIO Y FILTROS ---
  const [inventario, setInventario] = useState<Medicamento[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { isDark, toggle } = useDarkMode();
  const [filterStatus, setFilterStatus] = useState<
    "todos" | "riesgo" | "caducados"
  >("todos");

  useEffect(() => {
    if (isLoggedIn) {
      apiService.getMedicamentos().then((res) => setInventario(res.data));
    }
  }, [isLoggedIn]);

  const stats = useMemo(() => calculateStats(inventario), [inventario]);

  // --- handleAdd Simplificado (Confía en el tipado de InventoryForm) ---
  // --- handleAdd Mejorado ---
  const handleAdd = async (nuevoMed: Omit<Medicamento, "id">) => {
    try {
      const res = await apiService.saveMedicamento(nuevoMed);
      if (res.status === 201) {
        // 1. Refrescamos datos
        const updated = await apiService.getMedicamentos();
        setInventario(updated.data);
        // 2. IMPORTANTE: Resetear filtros para que el item sea visible
        setFilterStatus("todos");
        setSearchTerm("");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Eliminar medicamento?")) return;
    await apiService.deleteMedicamento(id);
    setInventario((prev) => prev.filter((item) => item.id !== id));
  };

  // --- LÓGICA DE FILTRADO ---
  const filteredItems = useMemo(() => {
    const s = searchTerm.toLowerCase();
    const hoy = new Date();

    return inventario.filter((item) => {
      const diffDias = differenceInDays(new Date(item.fechaCaducidad), hoy);

      const matchesSearch =
        item.nombre.toLowerCase().includes(s) ||
        item.cn.includes(s) ||
        item.lote.toLowerCase().includes(s) ||
        item.fechaCaducidad.includes(s);

      let matchesStatus = true;
      if (filterStatus === "riesgo")
        matchesStatus = diffDias > 0 && diffDias <= 90;
      if (filterStatus === "caducados") matchesStatus = diffDias <= 0;

      return matchesSearch && matchesStatus;
    });
  }, [inventario, searchTerm, filterStatus]);

  const sortedItems = [...filteredItems].sort((a, b) =>
    a.fechaCaducidad.localeCompare(b.fechaCaducidad)
  );

  // --- INTERFAZ DE LOGIN ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800">
          <div className="text-center mb-8">
            <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-3">
              <Lock className="text-blue-600 dark:text-blue-400" size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white italic tracking-tighter">
              PHARMAFLOW
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
              Gestión de Inventario Profesional
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">
                Email Corporativo
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-3 text-slate-400"
                  size={18}
                />
                <input
                  type="email"
                  required
                  placeholder="ejemplo@farmacia.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase ml-1">
                Contraseña
              </label>
              <div className="relative">
                <Key
                  className="absolute left-3 top-3 text-slate-400"
                  size={18}
                />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {loginError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-xs font-bold">
                <AlertCircle size={14} /> {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-200 dark:shadow-none transition-all transform hover:-translate-y-1 active:scale-95"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-slate-400 text-xs tracking-tight">
              Acceso: <b>admin@pharmaflow.com</b> / <b>admin123</b>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDERIZADO PRINCIPAL ---
  return (
    // EL CAMBIO ESTÁ AQUÍ: Eliminamos bg-slate-50 porque el fondo lo controla ahora el body vía index.css
    <div className="min-h-screen transition-colors duration-300 p-4 sm:p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-blue-700 dark:text-blue-500 tracking-tighter italic">
              PHARMAFLOW{" "}
              <span className="text-slate-400 dark:text-slate-500 font-light">
                | FEFO System
              </span>
            </h1>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
              Conectado como:{" "}
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {email}
              </span>
            </p>
          </div>

          <div className="flex w-full md:w-auto gap-3">
            <button
              onClick={() =>
                reportService.downloadInventoryReport(
                  inventario,
                  stats.valorTotalGlobal
                )
              }
              className="flex-1 md:flex-none flex gap-2 justify-center items-center bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition shadow-sm"
            >
              <Download size={16} /> <span>Reporte PDF</span>
            </button>
            <button
              onClick={toggle}
              className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-yellow-400 transition hover:ring-2 hover:ring-blue-500"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 transition"
              title="Cerrar Sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <main className="space-y-6">
          <StatsDashboard stats={stats} />
          <InventoryForm onAdd={handleAdd} />

          <div className="space-y-4">
            <SearchBar value={searchTerm} onSearch={setSearchTerm} />
            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={() => setFilterStatus("todos")}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border ${
                  filterStatus === "todos"
                    ? "bg-slate-800 text-white border-slate-800"
                    : "bg-white text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterStatus("riesgo")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border ${
                  filterStatus === "riesgo"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/20 dark:text-orange-400"
                }`}
              >
                <AlertCircle size={14} /> En Riesgo
              </button>
              <button
                onClick={() => setFilterStatus("caducados")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border ${
                  filterStatus === "caducados"
                    ? "bg-red-600 text-white border-red-600"
                    : "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400"
                }`}
              >
                Caducados
              </button>

              {(filterStatus !== "todos" || searchTerm) && (
                <button
                  onClick={() => {
                    setFilterStatus("todos");
                    setSearchTerm("");
                  }}
                  className="text-xs text-red-500 font-bold hover:text-red-700 hover:underline ml-4 transition-all"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md border border-transparent dark:border-slate-700 overflow-hidden">
            <InventoryList items={sortedItems} onDelete={handleDelete} />
          </div>

          <footer className="py-6 text-center space-y-4">
            <p className="text-slate-400 dark:text-slate-500 text-sm italic">
              Mostrando {sortedItems.length} de {inventario.length} registros |
              Sistema FEFO v2.0
            </p>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <a
                href="https://www.flaticon.es/iconos-gratis/farmacia"
                title="farmacia iconos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-slate-400 hover:text-blue-500 transition-colors"
              >
                Farmacia iconos creados por Freepik - Flaticon
              </a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
