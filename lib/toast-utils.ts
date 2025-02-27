import { toast } from "sonner";

export const showToast = {
  success: (title: string, message?: string) => {
    toast.success(title, {
      description: message,
    });
  },
  error: (title: string, message?: string) => {
    toast.error(title, {
      description: message || "Something went wrong. Please try again.",
    });
  },
  loading: (title: string, message?: string) => {
    toast.loading(title, {
      description: message,
    });
  },
  info: (title: string, message?: string) => {
    toast.info(title, {
      description: message,
    });
  },
}; 