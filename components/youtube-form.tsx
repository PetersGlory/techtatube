"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQuery } from "convex/react";
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
import { showToast } from "@/lib/toast-utils";

const formSchema = z.object({
  youtubeUrl: z
    .string()
    .min(1, "YouTube URL is required")
    .regex(
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/,
      "Invalid YouTube URL"
    ),
});

export function YoutubeForm() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const createVideo = useMutation(api.videos.createVideo);
  
  // Get usage stats
  const usage = useQuery(api.usage.getUsage, {
    userId: user?.id ?? "skip",
  });

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

    try {
      setIsLoading(true);
      
      // Check if user has reached their limit
      if (usage && usage.current >= usage.limit) {
        showToast.error(
          "Usage Limit Reached", 
          "Please upgrade your plan to process more videos."
        );
        return;
      }

      // Create video
      await createVideo({
        youtubeUrl: values.youtubeUrl,
        userId: user.id,
      });

      showToast.success("Success", "Video processing started");
      form.reset();

    } catch (error) {
      console.error("Error processing video:", error);
      showToast.error(
        "Processing Error",
        "Failed to process video. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="youtubeUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>YouTube URL</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://youtube.com/watch?v=..." 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {usage && (
          <p className="text-sm text-muted-foreground">
            {usage.current} / {usage.limit} videos processed this month
          </p>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="animate-pulse">Processing...</span>
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
} 