import { cn } from "@/lib/utils";
import { useRouter } from "@tanstack/react-router";
import { TbArrowLeft } from "react-icons/tb";

export default function Header({
  title = "Titre",
  showBackArrow = false,
  onArrowBackClick,
  rightContent,
  bottomContent,
}: {
  title: string;
  showBackArrow?: boolean;
  rightContent?: React.ReactNode;
  onArrowBackClick?: () => void;
  bottomContent?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <header
      className={cn(
        "z-50 w-full bg-white px-4 border-b border-text/10 fixed top-0 left-0 pt-4 space-y-3",
        bottomContent ? "pb-4" : "h-17.5"
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {showBackArrow && (
            <button
              onClick={() =>
                onArrowBackClick ? onArrowBackClick() : router.history.back()
              }
              className="outline-0 flex-shrink-0"
            >
              <TbArrowLeft size={24} className="path-stroke-2" />
            </button>
          )}
          <h1 className="text-2xl font-medium truncate line-clamp-1">
            {title}
          </h1>
        </div>
        {rightContent && <div className="flex-shrink-0">{rightContent}</div>}
      </div>
      {bottomContent && <div className="">{bottomContent}</div>}
    </header>
  );
}
