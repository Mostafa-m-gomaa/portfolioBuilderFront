import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import YouTubeEmbed from "@/components/shared/YouTubeEmbed";
import {
  PLATFORM_VIDEO_EMBED_URL,
} from "@/constants/platformVideo";

interface PlatformVideoSectionProps {
  id?: string;
  showQuickStartLink?: boolean;
  className?: string;
}

const PlatformVideoSection = ({
  id = "platform-video",
  showQuickStartLink = true,
  className,
}: PlatformVideoSectionProps) => {
  const { t } = useLanguage();

  return (
    <section id={id} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-3xl text-center"
      >
        <span className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
          {t("video.kicker")}
        </span>
        <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
          {t("video.title")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
          {t("video.subtitle")}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="mx-auto mt-10 max-w-4xl"
      >
        <YouTubeEmbed src={PLATFORM_VIDEO_EMBED_URL} title={t("video.title")} />
      </motion.div>

      {showQuickStartLink && (
        <div className="mt-8 text-center">
          <Link
            to="/quickstart"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition hover:text-primary/80"
          >
            {t("video.quickStartLink")}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  );
};

export default PlatformVideoSection;
