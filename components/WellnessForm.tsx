"use client"

import { useActionState, useEffect, useState } from "react"
import { saveWellnessLog, type WellnessState } from "@/actions/wellness"
import { CheckCircle2, Loader2 } from "lucide-react"

export function WellnessForm() {
  const [pain, setPain] = useState(5)
  const [energy, setEnergy] = useState(5)
  const [state, formAction, isPending] = useActionState<WellnessState, FormData>(
    saveWellnessLog,
    null
  )

  useEffect(() => {
    if (state?.success) {
      setPain(5)
      setEnergy(5)
    }
  }, [state])

  const painColor =
    pain <= 3 ? "text-teal" : pain <= 6 ? "text-gold" : "text-coral"
  const energyColor =
    energy >= 7 ? "text-teal" : energy >= 4 ? "text-gold" : "text-coral"

  return (
    <form
      action={formAction}
      className="bg-white rounded-2xl p-6 border border-gray-light shadow-sm space-y-6"
    >
      <h2
        className="text-xl text-navy"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
      >
        ¿Cómo te sientes hoy?
      </h2>

      {state?.success && (
        <div className="flex items-center gap-3 bg-teal/10 border border-teal/20 text-teal-dark rounded-xl p-4">
          <CheckCircle2 size={20} className="shrink-0" />
          <span className="font-medium">¡Registro guardado! Gracias por tu constancia.</span>
        </div>
      )}

      {state?.error && (
        <p className="text-coral text-sm">{state.error}</p>
      )}

      <input type="hidden" name="painLevel" value={pain} />
      <input type="hidden" name="energy" value={energy} />

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-navy font-medium text-base">Nivel de dolor</label>
          <span
            className={`text-2xl font-semibold ${painColor}`}
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {pain}
            <span className="text-base text-gray font-normal">/10</span>
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={pain}
          onChange={(e) => setPain(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-teal"
          style={{
            background: `linear-gradient(to right, #2a9d8f ${(pain - 1) * 11.1}%, #f0ede8 ${(pain - 1) * 11.1}%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray mt-1">
          <span>Sin dolor</span>
          <span>Dolor severo</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="text-navy font-medium text-base">Nivel de energía</label>
          <span
            className={`text-2xl font-semibold ${energyColor}`}
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {energy}
            <span className="text-base text-gray font-normal">/10</span>
          </span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={energy}
          onChange={(e) => setEnergy(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer accent-teal"
          style={{
            background: `linear-gradient(to right, #2a9d8f ${(energy - 1) * 11.1}%, #f0ede8 ${(energy - 1) * 11.1}%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray mt-1">
          <span>Sin energía</span>
          <span>Llena de energía</span>
        </div>
      </div>

      <div>
        <label className="block text-navy font-medium mb-2 text-base">
          Notas (opcional)
        </label>
        <textarea
          name="notes"
          rows={3}
          placeholder="¿Algo que quieras registrar sobre tu día?"
          className="w-full px-4 py-3 rounded-xl border border-gray-light bg-cream focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 text-navy placeholder:text-gray resize-none transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-teal hover:bg-teal-dark text-white font-semibold text-lg py-4 rounded-xl transition-all duration-200 shadow-sm shadow-teal/30 disabled:opacity-60 flex items-center justify-center gap-2 min-h-[56px]"
      >
        {isPending ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Guardando...
          </>
        ) : (
          "Guardar registro"
        )}
      </button>
    </form>
  )
}
