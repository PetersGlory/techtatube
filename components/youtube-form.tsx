"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { showToast } from "@/lib/toast-utils";
import { useEntitlements } from "@/hooks/use-entitlements";
import { EntitlementsResponse } from "@/convex/types";

const formSchema = z.object({
  youtubeUrl: z
    .string()
    .url("Please enter a valid URL")
    .includes("youtube.com", { message: "Please enter a valid YouTube URL" }),
});

export function YoutubeForm() {
  const { user } = useUser();
  const { toast } = useToast();
  const createVideo = useMutation(api.videos.createVideo);
  const [isLoading, setIsLoading] = useState(false);
  const { hasFeatureAccess, entitlements } = useEntitlements();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      youtubeUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      showToast.error("Authentication Required", "Please sign in to continue.");
      return;
    }

    setIsLoading(true);
    showToast.loading("Processing Video", "Submitting video for processing...");

    try {
      const videoId = await createVideo({
        youtubeUrl: values.youtubeUrl,
        userId: user.id,
      });

      // Fetch metadata
      await fetch("/api/videos/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId }),
      });

      // Extract YouTube ID from URL
      const youtubeId = values.youtubeUrl.match(/(?:v=|\/)([\w-]{11})(?:\?|$|&)/)?.[1];
      
      // Fetch transcript
      await fetch("/api/videos/transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, youtubeId }),
      });

      showToast.success(
        "Video Submitted",
        "Your video has been successfully submitted for processing."
      );
      
      form.reset();
    } catch (error) {
      showToast.error(
        "Submission Failed",
        error instanceof Error ? error.message : "Failed to submit video"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="youtubeUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube URL</FormLabel>
              <FormControl>
                <Input placeholder="https://youtube.com/watch?v=..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {entitlements && (
          <p className="text-sm text-muted-foreground">
            {entitlements.current} / {entitlements.limit} videos processed this month
          </p>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
} 