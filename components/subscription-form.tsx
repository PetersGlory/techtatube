"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface SubscriptionFormProps {
  planId: string
  isCurrentPlan: boolean
}

export function SubscriptionForm({ planId, isCurrentPlan }: SubscriptionFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubscribe = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      })

      if (!response.ok) {
        throw new Error("Failed to create subscription")
      }

      const data = await response.json()
      router.push(data.url)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleSubscribe} disabled={isLoading || isCurrentPlan}>
      {isCurrentPlan ? "Current Plan" : isLoading ? "Processing..." : "Subscribe"}
    </Button>
  )
}

