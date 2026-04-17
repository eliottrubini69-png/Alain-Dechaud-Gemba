"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { CheckIcon, ArrowRightIcon, Loader2 } from "lucide-react"

type Step = {
  id: number
  label: string
  field: string
  placeholder: string
}

// Étapes adaptées au conseil industriel de Alain Dechaud
const steps: Step[] = [
  { id: 1, label: "Votre Nom & Entreprise", field: "name", placeholder: "ex: Jean Dupont - Usine Acme" },
  { id: 2, label: "Email professionnel", field: "email", placeholder: "jean@acme.com" },
  { id: 3, label: "Votre défi actuel", field: "goal", placeholder: "ex: Réduire les gaspillages, SMED, 5S..." },
]

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isComplete, setIsComplete] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      await submitForm()
    }
  }

  const submitForm = async () => {
    setIsSubmitting(true)
    
    try {
      // Intégration Web3Forms :
      // Remplacez "VOTRE_CLE_D_ACCES_ICI" par la clé reçue sur contact@adgemba.fr
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "c1afce52-438e-40a4-bdbb-4ab16896c595", 
          email: formData.email,
          name: formData.name,
          message: formData.goal,
          subject: "Nouveau lead depuis le site AD Gemba",
          from_name: "Site Web AD Gemba"
        }),
      })
      setIsComplete(true)
    } catch (error) {
      console.error("Erreur lors de l'envoi", error)
      alert("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  // Écran de succès (Une fois le formulaire envoyé)
  if (isComplete) {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-white p-12 shadow-lg">
          <div className="relative flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-700">
            {/* Couleur de la DA : Teal/Cyan (#00B2A9) */}
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#00B2A9]/20 bg-[#00B2A9]/10">
              <CheckIcon
                className="h-8 w-8 text-[#00B2A9] animate-in zoom-in duration-500 delay-200"
                strokeWidth={2.5}
              />
            </div>
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Demande envoyée !</h2>
              <p className="text-sm text-slate-500">
                Merci {formData.name?.split(' ')[0] || formData.name}, Alain Dechaud a bien reçu votre demande et vous recontactera très vite sur {formData.email}.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Formulaire Actif
  return (
    <div className="w-full max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
      
      {/* En-tête du formulaire */}
      <div className="mb-8 text-center">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Passez à l'action sur le terrain</h3>
        <p className="text-slate-500 text-sm">Parlez-nous de vos défis industriels.</p>
      </div>

      {/* Barre de progression des étapes */}
      <div className="mb-10 flex items-center justify-center gap-3">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center gap-3">
            <button
              onClick={() => index < currentStep && setCurrentStep(index)}
              disabled={index > currentStep || isSubmitting}
              className={cn(
                "group relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-700 ease-out",
                "disabled:cursor-not-allowed",
                // Étapes précédentes (en vert clair)
                index < currentStep && "bg-[#00B2A9]/10 text-[#00B2A9]",
                // Étape actuelle (en vert plein)
                index === currentStep && "bg-[#00B2A9] text-white shadow-[0_0_20px_-5px_rgba(0,178,169,0.4)]",
                // Étapes futures (en gris)
                index > currentStep && "bg-slate-100 text-slate-400",
              )}
            >
              {index < currentStep ? (
                <CheckIcon className="h-4 w-4 animate-in zoom-in duration-500" strokeWidth={2.5} />
              ) : (
                <span className="text-sm font-medium tabular-nums">{step.id}</span>
              )}
            </button>
            {/* Ligne de connexion entre les étapes */}
            {index < steps.length - 1 && (
              <div className="relative h-[1.5px] w-12">
                <div className="absolute inset-0 bg-slate-100" />
                <div
                  className="absolute inset-0 bg-[#00B2A9] transition-all duration-700 ease-out origin-left"
                  style={{
                    transform: `scaleX(${index < currentStep ? 1 : 0})`,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Champs de saisie */}
      <div className="space-y-8">
        <div key={currentStepData.id} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
          <div className="flex items-baseline justify-between">
            <Label htmlFor={currentStepData.field} className="text-lg font-medium text-slate-800 tracking-tight">
              {currentStepData.label}
            </Label>
          </div>
          <div className="relative group">
            <Input
              id={currentStepData.field}
              type={currentStepData.field === "email" ? "email" : "text"}
              placeholder={currentStepData.placeholder}
              value={formData[currentStepData.field] || ""}
              onChange={(e) => handleInputChange(currentStepData.field, e.target.value)}
              autoFocus
              className="h-14 text-base transition-all duration-500 border-slate-200 focus:border-[#00B2A9] focus:ring-[#00B2A9]/20"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Bouton de validation (Vert) */}
        <Button
          onClick={handleNext}
          disabled={!formData[currentStepData.field]?.trim() || isSubmitting}
          className="w-full h-12 bg-[#00B2A9] hover:bg-[#00968f] text-white transition-all duration-300 group"
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <span className="flex items-center justify-center gap-2 font-medium">
              {currentStep === steps.length - 1 ? "Envoyer ma demande" : "Continuer"}
              <ArrowRightIcon
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 duration-300"
                strokeWidth={2}
              />
            </span>
          )}
        </Button>

        {/* Bouton Retour */}
        {currentStep > 0 && !isSubmitting && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="w-full text-center text-sm text-slate-400 hover:text-slate-600 transition-all duration-300"
          >
            Retour
          </button>
        )}
      </div>
    </div>
  )
}
