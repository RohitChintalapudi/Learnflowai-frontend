export function isValidAvatarUrl(url?: string | null) {
  if (!url) return false;
  if (url.includes("/undefined") || url.includes("/null")) return false;
  return true;
}

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  className?: string;
  initialClassName?: string;
}

export function Avatar({ src, name, className = "", initialClassName = "" }: AvatarProps) {
  if (isValidAvatarUrl(src)) {
    return (
      <img
        src={src ?? ""}
        alt={name || "Profile"}
        className={className}
      />
    );
  }

  const initial = name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <div className={`bg-gradient-to-br from-[#FF7A18] to-[#FF512F] flex items-center justify-center ${className}`}>
      <span className={`font-bold text-white select-none ${initialClassName}`}>
        {initial}
      </span>
    </div>
  );
}
