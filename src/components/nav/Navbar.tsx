import {
  TbHome,
  TbHomeFilled,
  TbAirBalloon,
  TbPlus,
  TbSearch,
  TbMessage,
  TbMessageFilled,
} from "react-icons/tb";
import { Link, useLocation } from "@tanstack/react-router";
import TbAirBalloonFilled from "@/assets/svg/TbAirBalloonFilled.svg";
import TbSearchFilled from "@/assets/svg/TbSearchFilled.svg";
import { useUser } from "@/contexts/userContext";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const location = useLocation();

  const options = [
    {
      iconInactive: <TbHome />,
      iconActive: <TbHomeFilled />,
      label: "Feed",
      url: "/feed",
    },
    {
      iconInactive: <TbAirBalloon />,
      iconActive: <img src={TbAirBalloonFilled} alt="" className="w-6 h-6" />,
      label: "Explorer",
      url: "/explore",
    },
    {
      iconInactive: <TbPlus size={18} />,
      iconActive: <TbPlus size={28} />,
      label: "",
      url: "/create-memory",
    },
    {
      iconInactive: <TbSearch />,
      iconActive: <img src={TbSearchFilled} alt="" className="w-6 h-6" />,
      label: "Chercher",
      url: "/search",
    },
    {
      iconInactive: <ProfilePicture />,
      iconActive: <ProfilePicture active={true} />,
      label: "Profil",
      url: "/me",
    },
  ] as const;

  return (
    <nav className="w-full h-20 bg-white px-4 border-t border-gray-200 fixed bottom-0 left-0 flex items-center justify-between">
      {options.map((option, i) => {
        const isActive = location.pathname === option.url;

        return (
          <Link
            key={option.url}
            to={option.url as any}
            className="flex flex-col items-center justify-center gap-1 min-w-15"
          >
            <div
              className={`text-2xl ${isActive ? "text-green" : "text-grey"}`}
            >
              {i === 2 ? (
                <span className="bg-green/10 text-green flex items-center justify-center p-3 rounded-full">
                  {option.iconActive}
                </span>
              ) : isActive ? (
                option.iconActive
              ) : (
                option.iconInactive
              )}
            </div>

            {option.label && (
              <span
                className={`text-xs font-medium ${isActive ? "text-green" : "text-grey"}`}
              >
                {option.label}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function ProfilePicture({ active = false }: { active?: boolean }) {
  const { user, unfinishedMemoriesCount } = useUser();

  return (
    <div className="relative">
      <img
        src={user?.medias?.[0]?.url || ""}
        alt="profile_pic"
        className={cn(
          "rounded-full h-6 w-6 object-cover",
          active && "ring-2 ring-green"
        )}
      />
      {unfinishedMemoriesCount ? (
        <span className="absolute -top-1 -right-2 bg-red text-white text-xs border-white border-2 rounded-full h-4 w-4 flex items-center justify-center">
          {unfinishedMemoriesCount}
        </span>
      ) : null}
    </div>
  );
}
