import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { parseApiError } from "@/api/axios";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { tToast } from "@/lib/i18n";

const markCommentSubmitted = (comment?: string | null) => {
  const user = useAuthStore.getState().user;
  if (!user) return;
  useAuthStore.getState().setAuth({
    user: {
      ...user,
      hasComment: true,
      ...(comment !== undefined ? { comment: comment ?? user.comment ?? null } : {}),
    },
  });
};

export const useSubmitComment = () => {
  const mutation = useMutation({
    mutationFn: (comment: string) => authService.submitComment(comment),
    onSuccess: (data) => {
      markCommentSubmitted(data.comment);
      toast.success(tToast("toast.comment.success"));
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        markCommentSubmitted();
        return;
      }
    },
  });

  const submitComment = async (comment: string) => {
    try {
      await mutation.mutateAsync(comment);
      return { ok: true as const };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        return { ok: true as const, alreadySubmitted: true as const };
      }
      const message = parseApiError(error, tToast("toast.comment.errorSubmit"));
      return { ok: false as const, message };
    }
  };

  return {
    submitComment,
    isPending: mutation.isPending,
  };
};
