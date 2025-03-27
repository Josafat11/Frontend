"use client";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/authContext";
import { CONFIGURACIONES } from "../config/config";
import { Chart } from 'chart.js/auto';
import { 
  FiSun, FiMoon, FiEye, FiBarChart2, FiTrendingUp, 
  FiPieChart, FiDollarSign, FiCalendar, FiShoppingBag,
  FiPackage, FiAlertTriangle , FiLayers,
  FiTruck, FiTag, FiGrid, FiClock, FiInfo
} from "react-icons/fi";

export default function VentasHoyPage() {
  const { user, isAuthenticated, theme, toggleTheme } = useAuth();
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [metrics, setMetrics] = useState({
    topProducts: [],
    leastSold: null,
    lowStock: null,
    totals: { unidades: 0, transacciones: 0 }
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  
  // Datos para gráficos
  const [salesDistribution, setSalesDistribution] = useState(null);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [stockComparison, setStockComparison] = useState([]);
  const [categoryMonthlySales, setCategoryMonthlySales] = useState([]);
  
  // Referencias para los gráficos
  const distributionChartRef = useRef(null);
  const topProductsChartRef = useRef(null);
  const monthlyTrendChartRef = useRef(null);
  const stockChartRef = useRef(null);
  const categoryMonthlyChartRef = useRef(null);

  // Verificar autenticación
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      window.location.href = "/login";
    }
  }, [isAuthenticated, user]);

  // Cargar todos los datos
  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      const fetchAllData = async () => {
        try {
          setLoading(true);
          
          // URLs para las peticiones
          const baseUrl = `${CONFIGURACIONES.BASEURL2}/predicciones`;
          
          const [
            ventasRes, 
            topRes, 
            leastRes, 
            stockRes,
            distributionRes,
            topSellingRes,
            monthlyTrendRes,
            stockComparisonRes,
            categoryMonthlyRes
          ] = await Promise.all([
            fetch(`${baseUrl}/ventas?todayOnly=true`, { credentials: "include" }),
            fetch(`${baseUrl}/top-products`, { credentials: "include" }),
            fetch(`${baseUrl}/least-sold`, { credentials: "include" }),
            fetch(`${baseUrl}/low-stock`, { credentials: "include" }),
            // Nuevas peticiones para gráficos
            fetch(`${baseUrl}/charts/sales-distribution`, { credentials: "include" }),
            fetch(`${baseUrl}/charts/top-products?limit=5`, { credentials: "include" }),
            fetch(`${baseUrl}/charts/monthly-trend`, { credentials: "include" }),
            fetch(`${baseUrl}/charts/stock-comparison`, { credentials: "include" }),
            fetch(`${baseUrl}/charts/category-monthly`, { credentials: "include" })
          ]);

          // Verificar respuestas
          const responses = [ventasRes, topRes, leastRes, stockRes, distributionRes, 
                           topSellingRes, monthlyTrendRes, stockComparisonRes, categoryMonthlyRes];
          
          const hasError = responses.some(res => !res.ok);
          if (hasError) throw new Error("Error al obtener datos");

          // Procesar todas las respuestas
          const [
            ventasData, 
            topData, 
            leastData, 
            stockData,
            distributionData,
            topSellingData,
            monthlyTrendData,
            stockComparisonData,
            categoryMonthlyData
          ] = await Promise.all(responses.map(res => res.json()));

          // Actualizar estados
          setVentas(ventasData.data || []);
          setMetrics({
            topProducts: Array.isArray(topData) ? topData : [],
            leastSold: leastData || null,
            lowStock: stockData || null,
            totals: {
              unidades: ventasData.summary?.totalUnitsSold || 0,
              transacciones: ventasData.summary?.totalTransactions || 0
            }
          });

          // Datos para gráficos
          setSalesDistribution(distributionData || []);
          setTopSellingProducts(topSellingData || []);
          setMonthlyTrend(monthlyTrendData || []);
          setStockComparison(stockComparisonData || []);
          setCategoryMonthlySales(categoryMonthlyData || []);

        } catch (err) {
          console.error("Error:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      
      fetchAllData();
    }
  }, [isAuthenticated, user]);

  // Inicializar gráfico de distribución de ventas
  useEffect(() => {
    if (!salesDistribution || !distributionChartRef.current) return;
    
    const ctx = distributionChartRef.current.getContext('2d');
    if (!ctx) return;

    // Destruir gráfico anterior si existe
    if (distributionChartRef.current.chart) {
      distributionChartRef.current.chart.destroy();
    }

    // Preparar datos para el gráfico de torta
    const data = {
      labels: salesDistribution.map(item => item.category),
      datasets: [{
        data: salesDistribution.map(item => parseFloat(item.percentage)),
        backgroundColor: [
          '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56'
        ],
        borderWidth: 1
      }]
    };

    // Crear nuevo gráfico
    distributionChartRef.current.chart = new Chart(ctx, {
      type: 'pie',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: theme === 'dark' ? '#e2e8f0' : '#4a5568'
            }
          },
          title: {
            display: true,
            text: 'Distribución de Ventas por Categoría (%)',
            color: theme === 'dark' ? '#e2e8f0' : '#2d3748',
            font: {
              size: 16,
              weight: '600'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const item = salesDistribution[context.dataIndex];
                return `${label}: ${value}% (${item.quantity} unidades)`;
              }
            }
          }
        }
      }
    });

    return () => {
      if (distributionChartRef.current?.chart) {
        distributionChartRef.current.chart.destroy();
      }
    };
  }, [salesDistribution, theme]);

  // Inicializar gráfico de productos más vendidos
  useEffect(() => {
    if (!topSellingProducts || !topProductsChartRef.current) return;
    
    const ctx = topProductsChartRef.current.getContext('2d');
    if (!ctx) return;

    if (topProductsChartRef.current.chart) {
      topProductsChartRef.current.chart.destroy();
    }

    const data = {
      labels: topSellingProducts.map(item => item.productName),
      datasets: [{
        label: 'Unidades Vendidas',
        data: topSellingProducts.map(item => item.totalSold),
        backgroundColor: '#4299e1',
        borderColor: '#2b6cb0',
        borderWidth: 1
      }]
    };

    topProductsChartRef.current.chart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Top 5 Productos Más Vendidos',
            color: theme === 'dark' ? '#e2e8f0' : '#2d3748',
            font: {
              size: 16,
              weight: '600'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: theme === 'dark' ? '#e2e8f0' : '#4a5568'
            },
            grid: {
              color: theme === 'dark' ? 'rgba(226, 232, 240, 0.1)' : 'rgba(74, 85, 104, 0.1)'
            }
          },
          x: {
            ticks: {
              color: theme === 'dark' ? '#e2e8f0' : '#4a5568'
            },
            grid: {
              display: false
            }
          }
        }
      }
    });

    return () => {
      if (topProductsChartRef.current?.chart) {
        topProductsChartRef.current.chart.destroy();
      }
    };
  }, [topSellingProducts, theme]);

  // Inicializar gráfico de tendencia mensual
  useEffect(() => {
    if (!monthlyTrend || !monthlyTrendChartRef.current) return;
    
    const ctx = monthlyTrendChartRef.current.getContext('2d');
    if (!ctx) return;

    if (monthlyTrendChartRef.current.chart) {
      monthlyTrendChartRef.current.chart.destroy();
    }

    const labels = monthlyTrend.map(item => item.month);
    const data = monthlyTrend.map(item => item.totalSold);

    monthlyTrendChartRef.current.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Unidades Vendidas',
          data: data,
          borderColor: '#9B59B6',
          backgroundColor: 'rgba(155, 89, 182, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Tendencia de Ventas Mensuales',
            color: theme === 'dark' ? '#e2e8f0' : '#2d3748',
            font: {
              size: 16,
              weight: '600'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: theme === 'dark' ? '#e2e8f0' : '#4a5568'
            },
            grid: {
              color: theme === 'dark' ? 'rgba(226, 232, 240, 0.1)' : 'rgba(74, 85, 104, 0.1)'
            }
          },
          x: {
            ticks: {
              color: theme === 'dark' ? '#e2e8f0' : '#4a5568'
            },
            grid: {
              display: false
            }
          }
        }
      }
    });

    return () => {
      if (monthlyTrendChartRef.current?.chart) {
        monthlyTrendChartRef.current.chart.destroy();
      }
    };
  }, [monthlyTrend, theme]);

  // Inicializar gráfico de comparación de stock
  useEffect(() => {
    if (!stockComparison || !stockChartRef.current) return;
    
    const ctx = stockChartRef.current.getContext('2d');
    if (!ctx) return;

    if (stockChartRef.current.chart) {
      stockChartRef.current.chart.destroy();
    }

    // Tomar solo los primeros 5 productos para mejor visualización
    const displayData = stockComparison.slice(0, 5);

    const data = {
      labels: displayData.map(item => item.productName),
      datasets: [
        {
          label: 'Stock Inicial',
          data: displayData.map(item => item.initialStock),
          backgroundColor: '#4299e1',
          borderColor: '#2b6cb0',
          borderWidth: 1
        },
        {
          label: 'Stock Actual',
          data: displayData.map(item => item.currentStock),
          backgroundColor: '#48bb78',
          borderColor: '#2f855a',
          borderWidth: 1
        }
      ]
    };

    stockChartRef.current.chart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: theme === 'dark' ? '#e2e8f0' : '#4a5568'
            }
          },
          title: {
            display: true,
            text: 'Comparación Stock Inicial vs Actual',
            color: theme === 'dark' ? '#e2e8f0' : '#2d3748',
            font: {
              size: 16,
              weight: '600'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: theme === 'dark' ? '#e2e8f0' : '#4a5568'
            },
            grid: {
              color: theme === 'dark' ? 'rgba(226, 232, 240, 0.1)' : 'rgba(74, 85, 104, 0.1)'
            }
          },
          x: {
            ticks: {
              color: theme === 'dark' ? '#e2e8f0' : '#4a5568'
            },
            grid: {
              display: false
            }
          }
        }
      }
    });

    return () => {
      if (stockChartRef.current?.chart) {
        stockChartRef.current.chart.destroy();
      }
    };
  }, [stockComparison, theme]);

  // Ver detalles del producto
  const viewProductDetails = async (productId) => {
    try {
      const response = await fetch(
        `${CONFIGURACIONES.BASEURL2}/predicciones/productos/${productId}/details`,
        { credentials: "include" }
      );
      const data = await response.json();
      setProductDetails(data);
      setShowModal(true);
    } catch (err) {
      console.error("Error al obtener detalles:", err);
      setError("Error al cargar detalles del producto");
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Función para truncar texto largo
  const truncateText = (text, maxLength = 20) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="container mx-auto py-8 pt-36 text-center">
        <p>Redirigiendo...</p>
      </div>
    );
  }

  return (
    <div className={`container mx-auto py-8 pt-36 min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header con botón de tema */}
      <div className="flex justify-between items-center mb-8 px-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Panel de Gestión - Refaccionaria
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Resumen de ventas y análisis de inventario
          </p>
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-yellow-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Cambiar tema"
        >
          {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-300 mt-4">Cargando datos...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mx-4 mb-6 rounded">
          <div className="flex items-center">
            <FiInfo className="mr-2" />
            <strong>Error:</strong> {error}
          </div>
        </div>
      ) : (
        <div className="space-y-8 px-4">
          {/* Sección de Métricas Clave */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Resumen de ventas */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mr-4">
                  <FiDollarSign size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Resumen de Ventas
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Hoy
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Transacciones:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {metrics.totals.transacciones}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Unidades vendidas:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {metrics.totals.unidades}
                  </span>
                </div>
              </div>
            </div>

            {/* Producto más vendido por categoría */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 mr-4">
                  <FiBarChart2 size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Más Vendidos
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Por categoría
                  </p>
                </div>
              </div>
              {metrics.topProducts.length > 0 ? (
                <ul className="space-y-3">
                  {metrics.topProducts
                    .filter((item) => item.product)
                    .map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">
                          {truncateText(item.category || "Sin categoría")}:
                        </span>
                        <div className="text-right">
                          <span className="font-medium text-gray-700 dark:text-gray-300 block">
                            {truncateText(item.product?.name || "N/A")}
                          </span>
                          <span className="text-sm text-green-600 dark:text-green-400">
                            {item.totalSold || 0} uds
                          </span>
                        </div>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No hay datos de productos más vendidos
                </p>
              )}
            </div>

            {/* Productos con stock crítico */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 mr-4">
                  <FiAlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Stock Crítico
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Necesitan reabastecimiento
                  </p>
                </div>
              </div>
              {metrics.lowStock ? (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Producto:</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {truncateText(metrics.lowStock.product?.name || "No disponible")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Stock:</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      {metrics.lowStock.remainingStock ?? "N/A"} uds
                    </span>
                  </div>
                  {metrics.lowStock.daysUntilOut < 10 && (
                    <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-yellow-700 dark:text-yellow-300 text-sm">
                      <FiAlertTriangle className="inline mr-1" />
                      ¡Se agotará en ~{metrics.lowStock.daysUntilOut} días!
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No hay productos con stock crítico
                </p>
              )}
            </div>
          </div>

          {/* Sección de Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de distribución de ventas */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 mr-3">
                  <FiPieChart size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Distribución de Ventas
                </h3>
              </div>
              <div className="w-full h-80">
                <canvas ref={distributionChartRef}></canvas>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Porcentaje de ventas por categoría
              </p>
            </div>

            {/* Gráfico de productos más vendidos */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mr-3">
                  <FiShoppingBag size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Top Productos
                </h3>
              </div>
              <div className="w-full h-80">
                <canvas ref={topProductsChartRef}></canvas>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Los 5 productos con mayor volumen de ventas
              </p>
            </div>

            {/* Gráfico de tendencia mensual */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 mr-3">
                  <FiCalendar size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Tendencia Mensual
                </h3>
              </div>
              <div className="w-full h-80">
                <canvas ref={monthlyTrendChartRef}></canvas>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Evolución de ventas en los últimos meses
              </p>
            </div>

            {/* Gráfico de comparación de stock */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 mr-3">
                  <FiPackage size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Stock Inicial vs Actual
                </h3>
              </div>
              <div className="w-full h-80">
                <canvas ref={stockChartRef}></canvas>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Comparación del stock inicial con el actual
              </p>
            </div>
          </div>

          {/* Resumen de ventas del día */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    Ventas del Día
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <div className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg text-blue-600 dark:text-blue-400 text-sm">
                    <span className="font-medium">{metrics.totals.transacciones}</span> transacciones
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-lg text-green-600 dark:text-green-400 text-sm">
                    <span className="font-medium">{metrics.totals.unidades}</span> unidades
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de ventas */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiTag className="mr-1" /> Producto
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiGrid className="mr-1" /> Categoría
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <div className="flex items-center justify-end">
                        <FiLayers className="mr-1" /> Cantidad
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <div className="flex items-center justify-end">
                        <FiDollarSign  className="mr-1" /> Precio
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <div className="flex items-center justify-end">
                        <FiDollarSign className="mr-1" /> Total
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <div className="flex items-center">
                        <FiClock className="mr-1" /> Fecha
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {ventas.length > 0 ? (
                    ventas.map((venta) => (
                      <tr key={venta.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                              <FiPackage />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {truncateText(venta.product?.name || "N/A", 15)}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {venta.product?.partNumber || "Sin número"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap capitalize text-gray-700 dark:text-gray-300">
                          {truncateText(venta.product?.category || "N/A", 15)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700 dark:text-gray-300">
                          {venta.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700 dark:text-gray-300">
                          ${venta.salePrice?.toFixed(2) || "0.00"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-green-600 dark:text-green-400">
                          ${venta.total?.toFixed(2) || "0.00"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(venta.saleDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => viewProductDetails(venta.productId)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors inline-flex items-center"
                          >
                            <FiEye className="mr-1" /> Detalles
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        <div className="flex flex-col items-center justify-center">
                          <FiShoppingBag size={32} className="text-gray-400 dark:text-gray-500 mb-2" />
                          No hay ventas registradas hoy
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles del producto */}
      {showModal && productDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'dark-scrollbar' : ''}`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {productDetails.product.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 capitalize">
                    {productDetails.product.category} • {productDetails.product.brand}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                      <FiInfo className="mr-2 text-blue-500" /> Información Básica
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Precio:</span>
                        <span className="font-medium">${productDetails.product.price.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Stock actual:</span>
                        <span className={`font-medium ${productDetails.product.stock < 5 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                          {productDetails.product.stock} unidades
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Número de parte:</span>
                        <span className="font-medium">{productDetails.product.partNumber || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                      <FiBarChart2 className="mr-2 text-green-500" /> Métricas de Ventas
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Ventas este mes:</span>
                        <span className="font-medium">{productDetails.metrics.soldCurrentMonth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Ventas mes anterior:</span>
                        <span className="font-medium">{productDetails.metrics.soldLastMonth}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Total vendido:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">{productDetails.metrics.totalSold}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                      <FiTruck className="mr-2 text-purple-500" /> Compatibilidades
                    </h4>
                    {productDetails.product.compatibilities?.length > 0 ? (
                      <ul className="space-y-2">
                        {productDetails.product.compatibilities.map((comp, i) => (
                          <li key={i} className="text-sm bg-white dark:bg-gray-600 p-2 rounded">
                            {[comp.make, comp.model, comp.year].filter(Boolean).join(' ')}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No hay compatibilidades registradas</p>
                    )}
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                      <FiPackage className="mr-2 text-yellow-500" /> Imágenes
                    </h4>
                    {productDetails.product.images?.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {productDetails.product.images.map((img) => (
                          <img 
                            key={img.id} 
                            src={img.url} 
                            alt={`Producto ${productDetails.product.name}`}
                            className="w-full h-auto rounded border border-gray-200 dark:border-gray-600 object-cover"
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-sm">No hay imágenes disponibles</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );  
};