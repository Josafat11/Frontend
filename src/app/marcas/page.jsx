"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "../../context/authContext";
import Image from "next/image";

const CarBrandsPage = () => {
  const { theme } = useAuth(); 
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef(null)
  const itemsPerPage = 3

  const carBrands = [
    { id: 1, name: "Toyota", image: "/assets/toyota-logo.png"},
    { id: 2, name: "Honda", image: "/assets/honda-logo.png" },
    { id: 3, name: "Ford", image: "/assets/ford-logo.png" },
    { id: 4, name: "Chevrolet", image: "/assets/chevrolet-logo.png" },
    { id: 5, name: "Nissan", image: "/assets/nissan-logo.png" },
    { id: 6, name: "BMW", image: "/assets/bmw-logo.png" },
    { id: 7, name: "Mercedes-Benz", image: "/assets/mercedes-logo.png" },
    { id: 8, name: "Audi", image: "/assets/audi-logo.png" },
    { id: 9, name: "Volkswagen", image: "/assets/volkswagen-logo.png" },
    { id: 10, name: "Hyundai", image: "/assets/hyundai-logo.png" },
    { id: 11, name: "Kia", image: "/assets/kia-logo.png" },
    { id: 12, name: "Mazda", image: "/assets/mazda-logo.png" },
  ]

  // Componente Button
  const Button = ({ children, onClick, disabled, className = "", ...props }) => (
    <button onClick={onClick} disabled={disabled} className={`${className}`} {...props}>
      {children}
    </button>
  )

  // Componente Card
  const Card = ({ children, className = "", style = {} }) => (
    <div className={className} style={style}>
      {children}
    </div>
  )

  // Componente CardContent
  const CardContent = ({ children, className = "" }) => <div className={className}>{children}</div>

  // Iconos SVG
  const ChevronLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15,18 9,12 15,6"></polyline>
    </svg>
  )

  const ChevronRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9,18 15,12 9,6"></polyline>
    </svg>
  )

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex + 1
          return nextIndex >= carBrands.length ? 0 : nextIndex
        })
      }, 3000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying, carBrands.length])

  const nextSlide = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1
      return nextIndex >= carBrands.length ? 0 : nextIndex
    })
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const prevSlide = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prevIndex) => {
      return prevIndex === 0 ? carBrands.length - 1 : prevIndex - 1
    })
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const goToSlide = (index) => {
    setIsAutoPlaying(false)
    setCurrentIndex(index)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  // Calcular las marcas visibles con efecto infinito
  const getVisibleBrands = () => {
    const brands = []
    for (let i = 0; i < itemsPerPage; i++) {
      const index = (currentIndex + i) % carBrands.length
      brands.push({ ...carBrands[index], displayIndex: i })
    }
    return brands
  }

  const visibleBrands = getVisibleBrands()
  const centerIndex = Math.floor(itemsPerPage / 2)

  return (
    <div className={`min-h-screen py-12 font-sans ${theme === "dark"
          ? "bg-gray-800 text-gray-100"
          : "bg-gray-50 text-gray-900"
    }`}>
      <style>
        {`
          @keyframes pulse-center {
            0%, 100% {
              transform: scale(1.1);
            }
            50% {
              transform: scale(1.15);
            }
          }
          
          @keyframes glow-yellow {
            0%, 100% {
              box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
            }
            50% {
              box-shadow: 0 0 30px rgba(251, 191, 36, 0.5);
            }
          }
          
          .center-card {
            animation: pulse-center 3s ease-in-out infinite, glow-yellow 2s ease-in-out infinite;
          }
        `}
      </style>

      <div className="px-4 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="relative inline-block">
            <h1 className={`relative mb-4 text-4xl font-bold md:text-5xl ${
                theme === "dark"
                ? "bg-gray-800 text-gray-100"
                : "bg-gray-50 text-slate-800"
            }`}>
              Nuestras Marcas
              <div className="absolute w-24 h-1 transform -translate-x-1/2 rounded-full -bottom-2 left-1/2 bg-gradient-to-r from-yellow-400 to-amber-500"></div>
            </h1>
          </div>
          <p className={`max-w-2xl mx-auto text-lg leading-relaxed ${
                theme === "dark"
                ? "bg-gray-800 text-gray-100"
                : "bg-gray-50 text-slate-600"
            }`}>
            Descubre la amplia gama de marcas en refacciones para automóviles que manejamos. Calidad, confianza y excelencia en cada vehículo.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Carousel Content */}
          <div className={`overflow-hidden border shadow-xl rounded-2xl backdrop-blur-sm pt-16 pb-16 border-yellow-100/50 ${
                theme === "dark"
                ? "bg-gray-800 text-gray-100"
                : "bg-gray-400/50 text-gray-900"
            }`}>
            <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2 lg:grid-cols-3">
              {visibleBrands.map((brand, index) => {
                const isCenterCard = index === centerIndex
                return (
                  <Card
                    key={`${brand.id}-${currentIndex}`}
                    className={`
                      group cursor-pointer transition-all duration-700 rounded-2xl shadow-lg hover:shadow-2xl
                      ${
                        isCenterCard
                          ? "center-card scale-110 ring-2 ring-yellow-400/60 shadow-2xl border-2 border-yellow-300/30 z-10"
                          : "hover:-translate-y-2 hover:ring-2 hover:ring-yellow-200/50"
                      }
                      ${
                        theme === "dark"
                        ? "bg-gray-800 text-gray-100"
                        : "bg-gray-50 text-gray-900"
                      }
                    `}
                  >
                    <CardContent className="p-6">
                      <div className="aspect-[3/2] relative mb-4 overflow-hidden rounded-xl bg-slate-50 border border-slate-100">
                        {/* Borde amarillo sutil en imagen central */}
                        {isCenterCard && (
                          <div className="absolute inset-0 z-10 border-2 border-yellow-300/40 rounded-xl"></div>
                        )}
                          <Image
                            src={brand.image}
                            alt={`Logo de ${brand.name}`}
                            fill
                            className={`
                            object-contain transition-transform duration-700
                            ${isCenterCard ? "scale-110" : "group-hover:scale-110"}
                            `}
                        />
                      </div>

                      <h3
                        className={`
                        text-xl font-semibold text-center transition-colors duration-300 mb-2
                        ${
                          isCenterCard
                            ? "text-yellow-600 font-bold text-2xl"
                            : " group-hover:text-yellow-600"
                        }
                        ${
                        theme === "dark"
                        ? "bg-gray-800 text-gray-100"
                        : "bg-gray-50 text-gray-900"
                        }
                      `}
                      >
                        {brand.name}
                      </h3>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {carBrands.map((_, index) => (
              <button
                key={index}
                className={`
                  w-3 h-3 rounded-full transition-all duration-300 border-2
                  ${
                    currentIndex === index
                      ? "bg-yellow-400 border-yellow-500 scale-125 shadow-lg shadow-yellow-400/50"
                      : "bg-slate-200 border-slate-300 hover:bg-yellow-200 hover:border-yellow-300"
                  }
                `}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid max-w-4xl grid-cols-1 gap-8 mx-auto mt-20 md:grid-cols-3">
          {[
            { number: "10+", label: "Marcas Disponibles", icon: "🚗" },
            { number: "500+", label: "Modelos en Stock", icon: "📦" },
            { number: "20", label: "Años de Experiencia", icon: "🎂" },
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="p-8 transition-all duration-300 bg-white border shadow-lg rounded-2xl hover:shadow-xl border-slate-100 hover:border-yellow-200/50 hover:-translate-y-1">
                <div className="mb-3 text-4xl">{stat.icon}</div>
                <div className="mb-2 text-3xl font-bold transition-colors text-slate-800 group-hover:text-yellow-600">
                  {stat.number}
                </div>
                <div className="font-medium text-slate-600">{stat.label}</div>
                <div className="w-12 h-1 mx-auto mt-3 transition-opacity duration-300 rounded-full opacity-0 bg-gradient-to-r from-yellow-400 to-amber-500 group-hover:opacity-100"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CarBrandsPage
