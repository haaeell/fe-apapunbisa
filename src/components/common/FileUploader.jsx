import { ImagePlus, Trash2, UploadCloud } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

export default function FileUploader({ label, value, onChange, accept = 'image/*', required = false }) {
  // undefined = untouched (show `value` prop), null = user removed, File = user picked a new one
  const [localFile, setLocalFile] = useState(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const localPreviewUrl = useMemo(() => (localFile ? URL.createObjectURL(localFile) : null), [localFile]);
  const preview = localFile === undefined ? value || null : localPreviewUrl;
  const fileName = localFile?.name || (preview ? 'Gambar saat ini' : 'Belum ada gambar');

  function updateFile(file) {
    if (!file) return;

    setLocalFile(file);
    onChange(file);
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    updateFile(file);
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    updateFile(event.dataTransfer.files?.[0]);
  }

  function openFileDialog() {
    inputRef.current?.click();
  }

  function handleRemove() {
    setLocalFile(null);
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-dark">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={openFileDialog}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') openFileDialog();
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`group relative overflow-hidden rounded-2xl border border-dashed bg-white p-3 transition-colors ${
          isDragging ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-border hover:border-primary/50 hover:bg-background/60'
        }`}
      >
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={handleFileChange} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[128px,1fr] sm:items-center">
          <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-background sm:aspect-square">
            {preview ? (
              <img src={preview} alt="Preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted">
                <ImagePlus size={28} strokeWidth={1.8} />
                <span className="text-xs font-medium">Preview</span>
              </div>
            )}

            {preview && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleRemove();
                }}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-red-500 opacity-100 shadow-sm transition-colors hover:bg-red-50"
                aria-label="Hapus gambar"
                title="Hapus gambar"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UploadCloud size={22} strokeWidth={1.9} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-dark">Drag & drop gambar di sini</p>
                <p className="truncate text-xs text-muted">{fileName}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors group-hover:bg-primary/90">
                Pilih Gambar
              </span>
              <span className="text-xs text-muted">JPG, PNG, WebP, atau SVG sesuai validasi backend.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
