"use client";

import { useSubscription } from "@/hooks/use-subscription";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export function SubscriptionManagement() {
  const { subscription, isActive, isPro, isEnterprise } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
      });
      if (!response.ok) throw new Error("Failed to cancel subscription");
      
      toast({
        title: "Subscription cancelled",
        description: "Your subscription will end at the current billing period",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Subscription Status</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Current Plan</p>
          <p className="font-medium">
            {isEnterprise ? "Enterprise" : isPro ? "Pro" : "Basic"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Status</p>
          <p className="font-medium">
            {isActive ? "Active" : "Inactive"}
          </p>
        </div>
        {subscription?.currentPeriodEnd && (
          <div>
            <p className="text-sm text-gray-500">Next Billing Date</p>
            <p className="font-medium">
              {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
          </div>
        )}
        {isActive && (
          <Button 
            variant="destructive" 
            onClick={handleCancel}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Cancel Subscription"
            )}
          </Button>
        )}
      </div>
    </Card>
  );
} 