import { useState, type ChangeEvent } from 'react';
import { resolveApiAssetUrl } from '@/api/axios';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { primaryButton } from '@/lib/buttonStyles';

type LogoManagerCardProps = {
  currentLogo?: string | null;
};


const LogoManagerCard = ({ currentLogo }: LogoManagerCardProps) => {
  const { updateLogoMutation, deleteLogoMutation } = useAuth();
  const { lang } = useLanguage();
  const isAr = lang === 'ar';
  const [preview, setPreview] = useState<string | null>(null);
  const activeLogo = preview || currentLogo || '';

  const onChangeLogo = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    try {
      await updateLogoMutation.mutateAsync(file);
    } finally {
      event.currentTarget.value = '';
    }
  };

  return (
    <div className="glass-strong rounded-3xl p-6 glow-border">
      <h3 className="font-heading text-xl font-semibold text-foreground">{isAr ? 'الشعار' : 'Logo'}</h3>
      <p className="text-sm text-muted-foreground mt-1">{isAr ? 'ارفع شعارك أو غيّره أو احذفه.' : 'Upload, change, or delete your logo.'}</p>
      <div className="mt-4 glass rounded-2xl p-4">
        {activeLogo ? (
          <img
            src={resolveApiAssetUrl(activeLogo)}
            alt={isAr ? 'شعاري' : 'My logo'}
            className="w-full h-28 sm:h-36 md:h-40 object-contain rounded-xl bg-background/40"
          />
        ) : (
          <div className="w-full h-28 sm:h-36 md:h-40 rounded-xl bg-background/40 flex items-center justify-center text-sm text-muted-foreground">
            {isAr ? 'لا يوجد شعار مرفوع بعد' : 'No logo uploaded yet'}
          </div>
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <label className={primaryButton('flex-1 cursor-pointer py-2.5 text-center')}>
          {currentLogo ? (isAr ? 'تغيير الشعار' : 'Change logo') : isAr ? 'رفع الشعار' : 'Upload logo'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={updateLogoMutation.isPending}
            onChange={onChangeLogo}
          />
        </label>
        <button
          onClick={() => deleteLogoMutation.mutate()}
          disabled={deleteLogoMutation.isPending || !currentLogo}
          className="flex-1 glass py-2.5 rounded-xl text-sm text-destructive disabled:opacity-50"
        >
          {deleteLogoMutation.isPending ? (isAr ? 'جار الحذف...' : 'Deleting...') : isAr ? 'حذف الشعار' : 'Delete logo'}
        </button>
      </div>
    </div>
  );
};

export default LogoManagerCard;

