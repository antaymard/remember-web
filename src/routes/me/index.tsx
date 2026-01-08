import Header from "@/components/nav/Header";
import Navbar from "@/components/nav/Navbar";
import { ButtonPastel } from "@/components/ui/Button";
import { useUser } from "@/contexts/userContext";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { api } from "@/../convex/_generated/api";
import { useQuery } from "convex/react";
import {
  TbUsersGroup,
  TbAirBalloon,
  TbWindmill,
  TbChevronRight,
  TbBooks,
  TbPlayerPauseFilled,
  TbUserPlus,
} from "react-icons/tb";

export const Route = createFileRoute("/me/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { user, unfinishedMemoriesCount } = useUser();

  const { momentsCount } = useQuery(api.users.getMyStats) || {};

  const slots = [
    {
      icon: TbUsersGroup,
      label: "amis",
      value: 0,
    },
    {
      icon: TbWindmill,
      label: "souvenirs",
      value: momentsCount || 0,
    },
    {
      icon: TbAirBalloon,
      label: "rêves",
      value: 0,
    },
  ];

  const links = [
    {
      label: "Souvenirs à terminer",
      to: "/me/unfinished-memories",
      icon: TbPlayerPauseFilled,
      value: unfinishedMemoriesCount || 0,
    },
    { label: "Mes amis", to: "/me/friends", icon: TbUsersGroup },
    { label: "Inviter des amis", to: "/me/invite-friends", icon: TbUserPlus },
    { label: "Mes rêves", to: "/me/dreams", icon: TbAirBalloon },
    { label: "Chapitres de ma vie", to: "/me/chapters", icon: TbBooks },
  ];

  return (
    <>
      <Header
        title="Profil"
        rightContent={
          <ButtonPastel
            icon="settings"
            color="green"
            onClick={() => navigate({ to: "/me/edit" })}
          />
        }
      />
      <div className="pt-17.5 pb-5 flex flex-col gap-2.5 bg-bg">
        <div className="flex flex-col items-center justify-center py-4">
          <img
            src={user?.medias?.[0]?.url}
            className="rounded-full object-cover w-32 aspect-square border-2 border-white"
          />
          <div className="grid grid-cols-3 gap-5 mt-6">
            {slots.map((slot) => (
              <div
                key={slot.label}
                className="flex flex-col items-center justify-center gap-2"
              >
                <div className="rounded-full text-text bg-white flex items-center justify-center h-12 aspect-square">
                  <slot.icon className="text-2xl mb-1" />
                </div>
                <div className="">{`${slot.value} ${slot.label}`}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white py-4 ">
        <h3 className="px-4 mb-2">Plus d'infos</h3>
        <div className="flex flex-col">
          {links.map((link) => (
            <div
              key={link.label}
              className="flex items-center justify-between py-3 cursor-pointer px-4"
              onClick={() => navigate({ to: link.to })}
            >
              <div className="flex items-center gap-2">
                <link.icon size={20} />
                <div className="font-medium">{link.label}</div>
                {link.value !== undefined && link.value > 0 && (
                  <div className="bg-red/10 text-red text-xs font-medium px-2 py-0.5 rounded-full">
                    {link.value}
                  </div>
                )}
              </div>
              <TbChevronRight size={20} />
            </div>
          ))}
        </div>
      </div>
      <Navbar />
    </>
  );
}
