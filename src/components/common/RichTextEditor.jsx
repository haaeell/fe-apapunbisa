import $ from 'jquery';
import { FileText } from 'lucide-react';
import { useEffect, useRef } from 'react';
import 'summernote/dist/summernote-lite.css';

const TOOLBAR = [
  ['style', ['style']],
  ['font', ['bold', 'italic', 'underline', 'clear']],
  ['para', ['ul', 'ol', 'paragraph']],
  ['insert', ['link', 'picture', 'table']],
  ['view', ['fullscreen', 'codeview', 'help']],
];

export default function RichTextEditor({ label, value, onChange, required = false }) {
  const textareaRef = useRef(null);
  const isReadyRef = useRef(false);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let isMounted = true;
    const textarea = textareaRef.current;

    window.$ = $;
    window.jQuery = $;

    import('summernote/dist/summernote-lite').then(() => {
      if (!isMounted || !textarea) return;

      $(textarea).summernote({
        height: 280,
        minHeight: 220,
        dialogsInBody: true,
        toolbar: TOOLBAR,
        placeholder: 'Tulis konten di sini...',
        callbacks: {
          onChange: (contents) => {
            onChangeRef.current(contents);
          },
        },
      });

      $(textarea).summernote('code', value || '');
      isReadyRef.current = true;
    });

    return () => {
      isMounted = false;
      if (isReadyRef.current && textarea) {
        $(textarea).summernote('destroy');
        isReadyRef.current = false;
      }
    };
    // Summernote must be initialized once for the textarea DOM node.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!isReadyRef.current || !textarea) return;

    const currentValue = $(textarea).summernote('code');
    if ((value || '') !== currentValue) {
      $(textarea).summernote('code', value || '');
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-dark">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      <div className="overflow-hidden rounded-xl border border-border bg-white">
        <div className="flex items-center gap-2 border-b border-border bg-background/70 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted">
          <FileText size={15} />
          Summernote Editor
        </div>
        <textarea ref={textareaRef} defaultValue={value || ''} />
      </div>
    </div>
  );
}
