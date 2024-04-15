'use client'
import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge'

// Adım adım bir formu temsil eden bileşen
const StepByStep = () => {
  // Veri durumu
  const [data, setData] = useState({
    "user": {
    },
    "order": {
    }
  })

  // Adım durumları ve ilerleme
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState([
    {
      id: 0,
      step: 0,
      // İleri gitmek için gereksinimler
      requirements: (dt) => {
        return !!dt.user?.username
      },
      state: "continue",
      title: "Adım 1",
      // Adım bileşenleri
      Component: () => <div className="flex-1 bg-green-500">
        <button onClick={() => setData((prev) => ({ ...prev, user: { ...prev.user, username: "test username" } }))}>
          Set Username
        </button>
      </div>
    },
    {
      id: 0,
      step: 0,
      // İleri gitmek için gereksinimler
      requirements: (dt) => {
        return !!dt.order?.orderId
      },
      state: "complete",
      title: "Adım 2",
      // Adım bileşenleri
      Component: () => <div className="flex-1 bg-red-500">
        <button onClick={() => setData((prev) => ({ ...prev, order: { ...prev.order, orderId: "test order id" } }))}>
          Set Username
        </button>
      </div>
    },
    {
      id: 0,
      step: 0,
      // İleri gitmek için gereksinimler
      requirements: (dt) => {
        return !!dt.order?.complete
      },
      state: "none",
      title: "Adım 3",
      // Adım bileşenleri
      Component: () => <div className="flex-1 bg-orange-500" />
    }
  ])

  // Duruma göre renk döndüren fonksiyon
  const getColor = (state) => {
    if (state === "continue") {
      return "bg-orange-500"
    } else if (state === "none") {
      return "bg-slate-500"
    } else if (state === "complete") {
      return "bg-green-500"
    }
  }

  return (
    <div className='h-screen w-full flex'>
      {/* Adımları içeren yan panel */}
      <div className="flex-[0.2] bg-slate-600 flex flex-col p-4 gap-2">
        {steps.map((step, index) => {
          return (
            <div
              // Tıklanabilirliği ayarlayan ve seçilen adımı güncelleyen işlev
              onClick={() => setCurrentStep(index)}
              // Adım durumuna göre stili ayarlayan ve gereksinimler sağlanmadığında tıklanabilirliği kapatıp opaklık ekleyen sınıf birleştirmesi
              className={twMerge(getColor(step.state), "p-3 font-semibold rounded hover:opacity-75 transition-all duration-200 cursor-pointer", step.requirements(data) && "opacity-25 pointer-events-none")}>
              {step.title}
            </div>
          )
        })}
      </div>

      {/* Seçilen adımın bileşeni */}
      {steps[currentStep].Component()}
    </div>
  )
}

export default StepByStep