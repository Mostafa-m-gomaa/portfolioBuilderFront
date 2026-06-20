import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const toastSurfaceClass =
  "group toast !bg-black/80 !text-white !backdrop-blur-md !border !border-white/15 !shadow-xl !shadow-black/30 !rounded-xl !px-4 !py-3.5 !text-sm";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-right"
      dir="auto"
      offset={{ top: "5.75rem", right: "1rem", left: "1rem" }}
      className="toaster group pointer-events-none"
      toastOptions={{
        classNames: {
          toast: toastSurfaceClass,
          title: "group-[.toast]:text-white group-[.toast]:font-semibold",
          description: "group-[.toast]:text-white/75",
          actionButton:
            "group-[.toast]:bg-white/15 group-[.toast]:text-white group-[.toast]:font-semibold group-[.toast]:hover:bg-white/25",
          cancelButton:
            "group-[.toast]:bg-white/10 group-[.toast]:text-white/80 group-[.toast]:hover:bg-white/15",
          closeButton:
            "group-[.toast]:border-white/15 group-[.toast]:bg-white/10 group-[.toast]:text-white/80 group-[.toast]:hover:bg-white/15",
          success: toastSurfaceClass,
          error: toastSurfaceClass,
          warning: toastSurfaceClass,
          info: toastSurfaceClass,
          loading: toastSurfaceClass,
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
