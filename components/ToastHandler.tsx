"use client";

import { toast } from "sonner"; // or your preferred toast library

const ToastHandler = () => {
  const showToast = (type: "success" | "error", message: string) => {
    if (type === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  return { showToast };
};

export default ToastHandler; 