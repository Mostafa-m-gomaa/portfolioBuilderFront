import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSubmitComment } from "@/hooks/useSubmitComment";
import { COMMENT_MAX_LENGTH } from "@/lib/userComment";
import { primaryButton } from "@/lib/buttonStyles";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  open: boolean;
  onStay: () => void;
  onSuccess: () => void;
};

const UserCommentPopup = ({ open, onStay, onSuccess }: Props) => {
  const { t } = useLanguage();
  const { submitComment, isPending } = useSubmitComment();
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);

  const trimmed = comment.trim();
  const charCount = comment.length;
  const isOverLimit = charCount > COMMENT_MAX_LENGTH;
  const canSubmit = trimmed.length > 0 && !isOverLimit && !isPending;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    setError(null);
    const result = await submitComment(trimmed);
    if (result.ok) {
      setComment("");
      onSuccess();
      return;
    }

    setError(result.message ?? t("comment.errorSubmit"));
  };

  const handleStay = () => {
    setError(null);
    onStay();
  };

  return (
    <DialogPrimitive.Root open={open}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-[100] grid w-[calc(100%-2rem)] max-w-md translate-x-[-50%] translate-y-[-50%] gap-4",
            "glass-strong rounded-3xl border border-white/10 p-6 shadow-2xl glow-border",
            "duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          )}
          onPointerDownOutside={(event) => event.preventDefault()}
          onEscapeKeyDown={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogPrimitive.Title className="font-heading text-xl font-bold text-foreground">
            {t("comment.title")}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="text-sm text-muted-foreground">
            {t("comment.description")}
          </DialogPrimitive.Description>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder={t("comment.placeholder")}
                maxLength={COMMENT_MAX_LENGTH}
                rows={5}
                className="min-h-[120px] resize-none glass rounded-xl border-white/10 bg-transparent text-sm focus-visible:ring-primary/50"
                aria-invalid={isOverLimit}
                disabled={isPending}
              />
              <p
                className={cn(
                  "text-xs text-muted-foreground text-end",
                  isOverLimit && "text-destructive",
                )}
              >
                {t("comment.charCount")
                  .replace("{current}", String(charCount))
                  .replace("{max}", String(COMMENT_MAX_LENGTH))}
              </p>
            </div>

            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleStay}
                disabled={isPending}
                className="inline-flex items-center justify-center rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-foreground transition hover:bg-white/5 disabled:opacity-50"
              >
                {t("comment.stay")}
              </button>
              <button
                type="submit"
                disabled={!canSubmit}
                className={primaryButton()}
              >
                {isPending ? t("comment.submitting") : t("comment.submit")}
              </button>
            </div>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default UserCommentPopup;
