import { useLanguage } from "@/contexts/LanguageContext";
import {
  FACEBOOK_PAGE_URL,
  LINKEDIN_COMPANY_URL,
  SUPPORT_WHATSAPP_URL,
} from "@/constants/socialLinks";
import {
  FacebookBrandIcon,
  LinkedInBrandIcon,
  WhatsAppBrandIcon,
} from "@/components/icons/SocialBrandIcons";

type Props = {
  className?: string;
  showLabel?: boolean;
};

const SocialLinks = ({ className = "", showLabel = false }: Props) => {
  const { t } = useLanguage();

  return (
    <div className={className}>
      {showLabel && (
        <p className="mb-3 text-sm font-medium text-foreground">
          {t("social.followUs")}
        </p>
      )}
      <div className="flex items-center gap-3">
        <a
          href={FACEBOOK_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("social.facebookAria")}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1877F2] text-white shadow-md transition-transform hover:scale-105 hover:bg-[#166fe0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877F2] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <FacebookBrandIcon />
        </a>
        <a
          href={LINKEDIN_COMPANY_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("social.linkedinAria")}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0A66C2] text-white shadow-md transition-transform hover:scale-105 hover:bg-[#0958ab] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A66C2] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <LinkedInBrandIcon />
        </a>
        <a
          href={SUPPORT_WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("social.whatsappAria")}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366] text-white shadow-md transition-transform hover:scale-105 hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <WhatsAppBrandIcon />
        </a>
      </div>
    </div>
  );
};

export default SocialLinks;
