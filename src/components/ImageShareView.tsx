import { imageUrl, type ImageShare } from "@/lib/shares";

export function ImageShareView({ share }: { share: ImageShare }) {
  return (
    <div className="flex h-[100svh] flex-col overflow-hidden bg-white">
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <div className="flex w-full shrink-0 items-center justify-between gap-4 px-4 py-4 max-sm:px-3">
          <span className="text-[10px] font-medium uppercase tracking-wider text-black/50">
            SHARE.CANUSTA.COM
          </span>
          <a
            href={imageUrl(share.folder, share.file, true)}
            download
            className="shrink-0 rounded-full bg-[#0000FF] px-6 py-2.5 text-sm text-white transition-colors hover:bg-[#0000DD]"
          >
            Download
          </a>
        </div>
        <div className="flex min-h-0 w-full flex-1 items-center justify-center p-4 max-sm:p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl(share.folder, share.file)}
            alt=""
            className="max-h-full w-full max-w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
