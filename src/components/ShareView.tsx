import { fileUrl, getFileKind, type Share, type ShareFile } from "@/lib/shares";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FilePreview({ slug, file }: { slug: string; file: ShareFile }) {
  const url = fileUrl(slug, file.name);
  const kind = getFileKind(file.mimeType);

  if (kind === "image") {
    return (
      <figure className="overflow-hidden rounded-lg border border-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={file.name}
          className="w-full max-h-[70vh] object-contain bg-black/20"
        />
      </figure>
    );
  }

  if (kind === "video") {
    return (
      <video
        controls
        playsInline
        className="w-full max-h-[70vh] rounded-lg border border-border bg-black/20"
        src={url}
      />
    );
  }

  if (kind === "audio") {
    return (
      <audio controls className="w-full" src={url}>
        Your browser does not support audio playback.
      </audio>
    );
  }

  if (kind === "pdf") {
    return (
      <iframe
        src={url}
        title={file.name}
        className="h-[70vh] w-full rounded-lg border border-border bg-white"
      />
    );
  }

  return null;
}

function DownloadLink({ slug, file }: { slug: string; file: ShareFile }) {
  return (
    <a
      href={fileUrl(slug, file.name)}
      download
      className="flex items-center justify-between gap-4 rounded-lg border border-border px-4 py-3 transition-colors hover:border-muted hover:bg-white/5"
    >
      <span className="truncate text-sm">{file.name}</span>
      <span className="shrink-0 text-xs text-muted">{formatSize(file.size)}</span>
    </a>
  );
}

export function ShareView({ share }: { share: Share }) {
  const title = share.meta.title ?? "Shared files";
  const previewable = share.files.filter(
    (f) => getFileKind(f.mimeType) !== "other"
  );
  const downloads = share.files.filter(
    (f) => getFileKind(f.mimeType) === "other"
  );

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
      <header className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-muted">Canusta</p>
        <h1 className="text-2xl font-medium tracking-tight">{title}</h1>
        {share.meta.description && (
          <p className="text-sm leading-relaxed text-muted">
            {share.meta.description}
          </p>
        )}
      </header>

      {previewable.length > 0 && (
        <section className="space-y-6">
          {previewable.map((file) => (
            <FilePreview key={file.name} slug={share.slug} file={file} />
          ))}
        </section>
      )}

      {(downloads.length > 0 || share.files.length > 1) && (
        <section className="space-y-3">
          <h2 className="text-xs uppercase tracking-widest text-muted">
            Downloads
          </h2>
          <div className="space-y-2">
            {(downloads.length > 0 ? downloads : share.files).map((file) => (
              <DownloadLink key={file.name} slug={share.slug} file={file} />
            ))}
          </div>
        </section>
      )}

      {share.files.length === 1 && previewable.length === 1 && (
        <a
          href={fileUrl(share.slug, share.files[0].name)}
          download
          className="text-center text-xs text-muted transition-colors hover:text-foreground"
        >
          Download {share.files[0].name}
        </a>
      )}
    </div>
  );
}
