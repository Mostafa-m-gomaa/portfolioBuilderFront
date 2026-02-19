import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { useAllSections, usePortfolioActions, useSection, useSectionItems } from '@/hooks/usePortfolio';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const isObject = (value: unknown): value is Record<string, JsonValue> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const deepClone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const titleCase = (key: string) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (c) => c.toUpperCase());

const imageFromPath = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
  if (path.startsWith('/')) return `http://localhost:5000${path}`;
  return path;
};

const looksLikeImage = (value: unknown) => {
  if (typeof value !== 'string') return false;
  return /(\.png|\.jpe?g|\.gif|\.webp|\.svg)$/i.test(value) || value.includes('/uploads/');
};

const isImageKey = (key: string) => /(image|img|photo|logo|avatar|thumbnail|banner|cover|icon)/i.test(key);

const isDateKey = (key: string) => /(date|from|to|start|end)/i.test(key);

const ensureLocalized = (value?: unknown): JsonValue => {
  if (isObject(value) && ('ar' in value || 'en' in value)) return value;
  return { ar: '', en: '' };
};

const defaultItemTemplateBySection = (sectionName: string): Record<string, JsonValue> => {
  switch (sectionName.toLowerCase()) {
    case 'skills':
      return {
        skillName: ensureLocalized(),
        skillImage: '',
        skillRate: 0,
        skillCategory: ensureLocalized(),
      };
    case 'projects':
      return {
        title: ensureLocalized(),
        desc: ensureLocalized(),
        images: [],
      };
    case 'services':
      return {
        title: ensureLocalized(),
        desc: ensureLocalized(),
        image: '',
      };
    default:
      return {
        title: ensureLocalized(),
        desc: ensureLocalized(),
      };
  }
};

type DynamicFieldProps = {
  fieldKey: string;
  label: string;
  value: JsonValue;
  onChange: (next: JsonValue) => void;
  onUploadImage?: (file: File) => Promise<string | null>;
  compact?: boolean;
};

const DynamicField = ({ fieldKey, label, value, onChange, onUploadImage, compact = false }: DynamicFieldProps) => {
  const shellClass = compact ? 'glass rounded-xl p-3' : 'glass rounded-xl p-4';
  const [uploading, setUploading] = useState(false);

  if (Array.isArray(value)) {
    const sample = value[0];
    const defaultNext: JsonValue =
      sample !== undefined
        ? typeof sample === 'object'
          ? deepClone(sample)
          : typeof sample === 'number'
            ? 0
            : typeof sample === 'boolean'
              ? false
              : ''
        : '';

    const arrayIsImageList =
      isImageKey(fieldKey) &&
      value.every((entry) => typeof entry === 'string');

    return (
      <div className={shellClass}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">{label}</p>
          <div className="flex items-center gap-2">
            {arrayIsImageList && onUploadImage && (
              <label className="text-xs glass px-2 py-1 rounded-lg cursor-pointer">
                {uploading ? 'Uploading...' : 'Upload image'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    try {
                      setUploading(true);
                      const path = await onUploadImage(file);
                      if (path) onChange([...value, path]);
                    } finally {
                      setUploading(false);
                      event.currentTarget.value = '';
                    }
                  }}
                />
              </label>
            )}
            <button
              type="button"
              onClick={() => onChange([...value, defaultNext])}
              className="text-xs glass px-2 py-1 rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {value.map((item, index) => (
            <div key={`${label}-${index}`} className="rounded-xl border border-border p-3">
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={() => onChange(value.filter((_, i) => i !== index))}
                  className="text-xs text-destructive glass px-2 py-1 rounded-lg flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
              <DynamicField
                fieldKey={`${fieldKey}[${index}]`}
                label={`${label} #${index + 1}`}
                value={item}
                compact
                onUploadImage={onUploadImage}
                onChange={(next) => {
                  const clone = [...value];
                  clone[index] = next;
                  onChange(clone);
                }}
              />
              {arrayIsImageList && typeof item === 'string' && item && (
                <img
                  src={imageFromPath(item)}
                  alt=""
                  className="mt-2 w-full max-h-32 object-cover rounded-lg border border-border"
                />
              )}
            </div>
          ))}
          {value.length === 0 && <p className="text-xs text-muted-foreground">No items yet.</p>}
        </div>
      </div>
    );
  }

  if (isObject(value)) {
    return (
      <div className={shellClass}>
        <p className="text-sm font-medium mb-2">{label}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(value).map(([key, nestedValue]) => (
            <DynamicField
              fieldKey={`${fieldKey}.${key}`}
              key={`${label}-${key}`}
              label={titleCase(key)}
              value={nestedValue}
              compact
              onUploadImage={onUploadImage}
              onChange={(next) => onChange({ ...value, [key]: next })}
            />
          ))}
        </div>
      </div>
    );
  }

  if (typeof value === 'boolean') {
    return (
      <div className={`${shellClass} flex items-center justify-between`}>
        <p className="text-sm font-medium">{label}</p>
        <Switch checked={value} onCheckedChange={(checked) => onChange(checked)} />
      </div>
    );
  }

  if (typeof value === 'number') {
    return (
      <div className={shellClass}>
        <label className="block text-sm font-medium mb-2">{label}</label>
        <input
          type="number"
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(Number(e.target.value || 0))}
          className="w-full glass rounded-xl px-3 py-2 text-sm bg-transparent focus:outline-none"
        />
      </div>
    );
  }

  if (typeof value === 'string') {
    const imageLike = isImageKey(fieldKey) || looksLikeImage(value);
    const dateLike = isDateKey(fieldKey);
    const multiline = value.length > 80 || value.includes('\n');
    return (
      <div className={shellClass}>
        <label className="block text-sm font-medium mb-2">{label}</label>
        {dateLike ? (
          <input
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full glass rounded-xl px-3 py-2 text-sm bg-transparent focus:outline-none"
          />
        ) : multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-h-24 glass rounded-xl px-3 py-2 text-sm bg-transparent focus:outline-none"
          />
        ) : (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full glass rounded-xl px-3 py-2 text-sm bg-transparent focus:outline-none"
          />
        )}
        {imageLike && onUploadImage && (
          <label className="inline-block mt-2 text-xs glass px-3 py-1.5 rounded-lg cursor-pointer">
            {uploading ? 'Uploading...' : 'Upload image'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                try {
                  setUploading(true);
                  const path = await onUploadImage(file);
                  if (path) onChange(path);
                } finally {
                  setUploading(false);
                  event.currentTarget.value = '';
                }
              }}
            />
          </label>
        )}
        {imageLike && value && (
          <img
            src={imageFromPath(value)}
            alt=""
            className="mt-2 w-full max-h-40 object-cover rounded-xl border border-border"
          />
        )}
      </div>
    );
  }

  return (
    <div className={shellClass}>
      <p className="text-xs text-muted-foreground">Unsupported value</p>
    </div>
  );
};

const SectionEditor = () => {
  const { sectionName = '' } = useParams();
  const { isAuthenticated } = useAuth();

  const { data: allSectionsMeta } = useAllSections();
  const { data: sectionData, isLoading: sectionLoading } = useSection(sectionName);
  const { data: itemsData, isLoading: itemsLoading } = useSectionItems(sectionName);

  const {
    upsertSectionMutation,
    clearSectionMutation,
    setSectionActiveMutation,
    createItemMutation,
    updateItemMutation,
    deleteItemMutation,
    uploadSingleMutation,
    uploadMultipleMutation,
    deleteUploadedImageMutation,
  } = usePortfolioActions(sectionName);

  const [sectionForm, setSectionForm] = useState<Record<string, JsonValue>>({});
  const [newItemForm, setNewItemForm] = useState<Record<string, JsonValue>>(defaultItemTemplateBySection(sectionName));
  const [editingItemId, setEditingItemId] = useState('');
  const [editingItemForm, setEditingItemForm] = useState<Record<string, JsonValue>>({});
  const [uploadedPaths, setUploadedPaths] = useState<string[]>([]);

  const items = useMemo(
    () => (Array.isArray(itemsData) ? (itemsData as Record<string, JsonValue>[]) : []),
    [itemsData],
  );

  const sectionMeta = useMemo(() => {
    if (!allSectionsMeta || Array.isArray(allSectionsMeta) || !isObject(allSectionsMeta)) return null;
    const raw = allSectionsMeta[sectionName];
    return isObject(raw) ? raw : null;
  }, [allSectionsMeta, sectionName]);

  const requiredKeys = useMemo(() => {
    const candidate = sectionMeta?.required;
    if (!Array.isArray(candidate)) return [];
    return candidate.filter((k): k is string => typeof k === 'string');
  }, [sectionMeta]);

  const isSectionActive = Boolean(
    sectionData &&
      isObject(sectionData) &&
      'active' in sectionData &&
      typeof (sectionData as { active?: unknown }).active === 'boolean' &&
      (sectionData as { active: boolean }).active,
  );

  useEffect(() => {
    if (!sectionData || !isObject(sectionData)) return;
    const cloned = deepClone(sectionData);
    delete cloned._id;
    setSectionForm(cloned);
  }, [sectionData]);

  useEffect(() => {
    if (items.length === 0) {
      setNewItemForm(defaultItemTemplateBySection(sectionName));
      return;
    }
    const template = deepClone(items[0]);
    delete template.id;
    delete template._id;
    setNewItemForm(template);
  }, [items, sectionName]);

  const validateRequired = (payload: Record<string, JsonValue>) => {
    if (requiredKeys.length === 0) return true;
    const missing = requiredKeys.filter((key) => {
      const value = payload[key];
      if (value === undefined || value === null) return true;
      if (typeof value === 'string' && value.trim() === '') return true;
      if (Array.isArray(value) && value.length === 0) return true;
      return false;
    });
    if (missing.length > 0) {
      toast.error(`Required fields missing: ${missing.join(', ')}`);
      return false;
    }
    return true;
  };

  const onSaveSection = async () => {
    if (!validateRequired(sectionForm)) return;
    await upsertSectionMutation.mutateAsync({ sectionName, payload: sectionForm });
  };

  const onCreateItem = async () => {
    await createItemMutation.mutateAsync({ sectionName, payload: newItemForm });
  };

  const onEditItem = (item: Record<string, JsonValue>) => {
    const itemId = String(item.id || item._id || '');
    setEditingItemId(itemId);
    const clone = deepClone(item);
    delete clone.id;
    delete clone._id;
    setEditingItemForm(clone);
  };

  const onUpdateItem = async () => {
    if (!editingItemId) return toast.error('Choose an item first.');
    await updateItemMutation.mutateAsync({
      sectionName,
      itemId: editingItemId,
      payload: editingItemForm,
    });
  };

  const appendUniquePath = (paths: string[]) => {
    setUploadedPaths((prev) => {
      const merged = [...prev];
      paths.forEach((path) => {
        if (path && !merged.includes(path)) merged.push(path);
      });
      return merged;
    });
  };

  const onUploadSingle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const result = await uploadSingleMutation.mutateAsync(file);
    const path = result.filePath || result.url || '';
    appendUniquePath(path ? [path] : []);
    event.currentTarget.value = '';
  };

  const uploadImageAndGetPath = async (file: File) => {
    const result = await uploadSingleMutation.mutateAsync(file);
    const path = result.filePath || result.url || '';
    appendUniquePath(path ? [path] : []);
    return path || null;
  };

  const onUploadMultiple = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    const result = await uploadMultipleMutation.mutateAsync(files);
    const paths = result.filePaths?.length ? result.filePaths : (result.urls ?? []);
    appendUniquePath(paths);
    event.currentTarget.value = '';
  };

  const addImageToSection = (path: string) => {
    setSectionForm((prev) => {
      const images = Array.isArray(prev.images) ? prev.images : [];
      if (images.includes(path)) return prev;
      return { ...prev, images: [...images, path] };
    });
  };

  const addImageToNewItem = (path: string) => {
    setNewItemForm((prev) => {
      const key = Object.keys(prev).find((k) => /image/i.test(k)) || 'image';
      const existing = prev[key];
      if (Array.isArray(existing)) {
        if (existing.includes(path)) return prev;
        return { ...prev, [key]: [...existing, path] };
      }
      return { ...prev, [key]: path };
    });
  };

  const removeImageFromSection = (path: string) => {
    setSectionForm((prev) => {
      const images = Array.isArray(prev.images) ? prev.images : [];
      return { ...prev, images: images.filter((img) => img !== path) };
    });
  };

  const deleteUploaded = async (path: string) => {
    await deleteUploadedImageMutation.mutateAsync(path);
    setUploadedPaths((prev) => prev.filter((p) => p !== path));
    removeImageFromSection(path);
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-16 px-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-3xl font-bold capitalize">{sectionName} section editor</h1>
            <p className="text-muted-foreground text-sm">Simple form editor with uploads, previews, and validation.</p>
          </div>
          <Link to="/dashboard" className="glass px-4 py-2 rounded-xl text-sm">
            Back to dashboard
          </Link>
        </div>

        <section className="glass-strong rounded-3xl p-5">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button
              onClick={onSaveSection}
              disabled={upsertSectionMutation.isPending}
              className="gradient-bg px-4 py-2 rounded-xl text-sm text-primary-foreground disabled:opacity-70"
            >
              {upsertSectionMutation.isPending ? 'Saving...' : 'Save section'}
            </button>
            <div className="flex items-center gap-2 glass px-3 py-2 rounded-xl">
              <span className="text-xs text-muted-foreground">
                {setSectionActiveMutation.isPending ? 'Updating...' : `Active: ${isSectionActive ? 'Open' : 'Closed'}`}
              </span>
              <Switch
                checked={isSectionActive}
                disabled={setSectionActiveMutation.isPending}
                onCheckedChange={(checked) => setSectionActiveMutation.mutate({ sectionName, active: checked })}
              />
            </div>
            <button
              onClick={() => clearSectionMutation.mutate(sectionName)}
              disabled={clearSectionMutation.isPending}
              className="glass px-4 py-2 rounded-xl text-sm disabled:opacity-70"
            >
              {clearSectionMutation.isPending ? 'Clearing...' : 'Clear section'}
            </button>
            {requiredKeys.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Required: {requiredKeys.join(', ')}
              </p>
            )}
          </div>

          {sectionLoading && <p className="text-xs text-muted-foreground mb-3">Loading section data...</p>}

          <div className="space-y-3">
            {Object.entries(sectionForm).map(([key, value]) => (
              <DynamicField
                fieldKey={key}
                key={key}
                label={titleCase(key)}
                value={value}
                onUploadImage={uploadImageAndGetPath}
                onChange={(next) => setSectionForm((prev) => ({ ...prev, [key]: next }))}
              />
            ))}
            {Object.keys(sectionForm).length === 0 && (
              <p className="text-sm text-muted-foreground">No section fields returned yet. Save to initialize.</p>
            )}
          </div>

          {Array.isArray(sectionForm.images) && sectionForm.images.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Section images</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {sectionForm.images.map((imgPath, index) => (
                  <div key={`${imgPath}-${index}`} className="glass rounded-xl p-2">
                    <img src={imageFromPath(String(imgPath))} alt="" className="w-full h-24 object-cover rounded-lg" />
                    <button
                      onClick={() => removeImageFromSection(String(imgPath))}
                      className="w-full mt-2 text-xs glass rounded-lg py-1 text-destructive"
                    >
                      Remove from section
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="glass-strong rounded-3xl p-5">
          <h2 className="font-heading text-xl font-semibold mb-3">Image uploads</h2>
          <div className="flex flex-wrap items-center gap-3">
            <label className="glass px-4 py-2 rounded-xl text-sm cursor-pointer">
              Upload one image
              <input type="file" accept="image/*" onChange={onUploadSingle} className="hidden" />
            </label>
            <label className="glass px-4 py-2 rounded-xl text-sm cursor-pointer">
              Upload many images
              <input type="file" accept="image/*" multiple onChange={onUploadMultiple} className="hidden" />
            </label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {uploadedPaths.map((path) => (
              <div key={path} className="glass rounded-xl p-2">
                <img src={imageFromPath(path)} alt="" className="w-full h-24 object-cover rounded-lg" />
                <div className="mt-2 flex flex-col gap-1">
                  <button onClick={() => addImageToSection(path)} className="text-xs glass rounded-lg py-1">
                    Use in section
                  </button>
                  <button onClick={() => addImageToNewItem(path)} className="text-xs glass rounded-lg py-1">
                    Use in item
                  </button>
                  <button
                    onClick={() => deleteUploaded(path)}
                    className="text-xs glass rounded-lg py-1 text-destructive"
                    disabled={deleteUploadedImageMutation.isPending}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {uploadedPaths.length === 0 && (
              <p className="text-xs text-muted-foreground col-span-full">Upload images and they will appear here with preview.</p>
            )}
          </div>
        </section>

        <section className="glass-strong rounded-3xl p-5">
          <h2 className="font-heading text-xl font-semibold mb-3">Section items</h2>
          {itemsLoading && <p className="text-xs text-muted-foreground mb-3">Loading items...</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {items.map((item) => {
              const itemId = String(item.id || item._id || '');
              return (
                <div key={itemId} className="glass rounded-xl p-3">
                  <p className="text-sm font-medium">Item {itemId.slice(0, 8) || '#'}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Object.keys(item)
                      .filter((k) => !['_id', 'id'].includes(k))
                      .slice(0, 4)
                      .map((k) => titleCase(k))
                      .join(' | ') || 'No fields'}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => onEditItem(item)} className="glass px-3 py-1.5 rounded-lg text-xs">
                      Edit
                    </button>
                    <button
                      onClick={() => deleteItemMutation.mutate({ sectionName, itemId })}
                      disabled={deleteItemMutation.isPending || !itemId}
                      className="glass px-3 py-1.5 rounded-lg text-xs text-destructive disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
            {items.length === 0 && <p className="text-sm text-muted-foreground">No items yet.</p>}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-4">
              <h3 className="font-medium mb-3">Add new item</h3>
              <div className="space-y-3">
                {Object.entries(newItemForm).map(([key, value]) => (
                  <DynamicField
                    fieldKey={key}
                    key={`new-${key}`}
                    label={titleCase(key)}
                    value={value}
                    onUploadImage={uploadImageAndGetPath}
                    onChange={(next) => setNewItemForm((prev) => ({ ...prev, [key]: next }))}
                  />
                ))}
              </div>
              <button
                onClick={onCreateItem}
                disabled={createItemMutation.isPending}
                className="mt-4 gradient-bg px-4 py-2 rounded-xl text-sm text-primary-foreground disabled:opacity-70"
              >
                {createItemMutation.isPending ? 'Creating...' : 'Add item'}
              </button>
            </div>

            <div className="glass rounded-2xl p-4">
              <h3 className="font-medium mb-3">Edit selected item</h3>
              <input
                value={editingItemId}
                onChange={(e) => setEditingItemId(e.target.value)}
                placeholder="Item ID"
                className="w-full glass rounded-xl px-3 py-2 text-xs bg-transparent mb-3 focus:outline-none"
              />
              <div className="space-y-3">
                {Object.entries(editingItemForm).map(([key, value]) => (
                  <DynamicField
                    fieldKey={key}
                    key={`edit-${key}`}
                    label={titleCase(key)}
                    value={value}
                    onUploadImage={uploadImageAndGetPath}
                    onChange={(next) => setEditingItemForm((prev) => ({ ...prev, [key]: next }))}
                  />
                ))}
                {Object.keys(editingItemForm).length === 0 && (
                  <p className="text-xs text-muted-foreground">Select an item from the list to edit.</p>
                )}
              </div>
              <button
                onClick={onUpdateItem}
                disabled={updateItemMutation.isPending || !editingItemId}
                className="mt-4 gradient-bg px-4 py-2 rounded-xl text-sm text-primary-foreground disabled:opacity-70"
              >
                {updateItemMutation.isPending ? 'Updating...' : 'Update item'}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SectionEditor;

