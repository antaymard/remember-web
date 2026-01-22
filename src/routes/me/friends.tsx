import { api } from "@/../convex/_generated/api";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "convex/react";
import { useState, useEffect } from "react";
import { TbUserHeart, TbX } from "react-icons/tb";
import Header from "@/components/nav/Header";
import Navbar from "@/components/nav/Navbar";
import { ButtonPastel } from "@/components/ui/Button";
import { createFileRoute } from "@tanstack/react-router";
import type { Id } from "@/../convex/_generated/dataModel";
import type { UserType } from "@/types/user.types";

export const Route = createFileRoute("/me/friends")({
  component: RouteComponent,
});

function RouteComponent() {
  const [open, setOpen] = useState(false);
  const myFriends = useQuery(api.users.listMyFriends);

  return (
    <div>
      <Header title="Amis" showBackArrow />
      <div className="py-17.5 px-4">
        <div className="space-y-4">
          <button
            type="button"
            className={cn("input", "text-text")}
            onClick={() => setOpen(true)}
          >
            <TbUserHeart size={24} />
            Rechercher et ajouter des amis
          </button>
          {myFriends && myFriends.length > 0 && (
            <div className="space-y-2">
              <h3>Mes amis</h3>
              {myFriends.map((friend) => {
                if (!friend) return null;
                return <FriendItem key={friend._id} user={friend} hideButton />;
              })}
            </div>
          )}
        </div>
        {open && <PickerScreen setOpen={setOpen} />}
      </div>
      <Navbar />
    </div>
  );
}

function PickerScreen({ setOpen }: { setOpen: (open: boolean) => void }) {
  const [search, setSearch] = useState("");
  const allUsers = useQuery(api.users.listAllUsers);
  const myFriends = useQuery(api.users.listMyFriends);
  const addFriend = useMutation(api.users.addFriend);
  const removeFriend = useMutation(api.users.removeFriend);

  const myFriendIds = myFriends?.map((f) => f?._id).filter(Boolean) || [];

  useEffect(() => {
    // Bloquer le scroll quand la modale est ouverte
    document.body.style.overflow = "hidden";

    // Restaurer le scroll quand la modale est fermée
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleAddFriend = async (friendId: Id<"users">) => {
    await addFriend({ friendId });
  };

  const handleRemoveFriend = async (friendId: Id<"users">) => {
    await removeFriend({ friendId });
  };

  function renderSuggestions() {
    if (!allUsers) return null;
    // Filtrer pour ne montrer que ceux qui ne sont pas encore amis
    const suggestions = allUsers.filter(
      (user) => !myFriendIds.includes(user._id)
    );

    if (suggestions.length === 0) {
      return (
        <div className="space-y-4">
          <h3>Suggestions</h3>
          <p>Vous avez déjà ajouté tous les utilisateurs disponibles !</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h3>Suggestions</h3>
        <div className="flex flex-col gap-2">
          {suggestions.map((user) => (
            <FriendItem
              key={user._id}
              user={user}
              action="add"
              onAction={handleAddFriend}
            />
          ))}
        </div>
      </div>
    );
  }

  function renderMyFriends() {
    if (!myFriends || myFriends.length === 0) return null;

    return (
      <div className="space-y-4">
        <h3>Mes amis</h3>
        <div className="flex flex-col gap-2">
          {myFriends.map((friend) => {
            if (!friend) return null;
            return (
              <FriendItem
                key={friend._id}
                user={friend}
                action="remove"
                onAction={handleRemoveFriend}
              />
            );
          })}
        </div>
      </div>
    );
  }

  function renderSearchResults() {
    const results = allUsers?.filter((user) => {
      const fullName =
        `${user.firstname || ""} ${user.lastname || ""}`.toLowerCase();
      const email = user.email?.toLowerCase() || "";
      const searchLower = search.toLowerCase();
      return fullName.includes(searchLower) || email.includes(searchLower);
    });

    return (
      <div className="space-y-4">
        <h3>Résultats de la recherche</h3>
        <div className="flex flex-col gap-2">
          {results?.length ? (
            results.map((user) => {
              const isFriend = myFriendIds.includes(user._id);
              return (
                <FriendItem
                  key={user._id}
                  user={user}
                  action={isFriend ? "remove" : "add"}
                  onAction={isFriend ? handleRemoveFriend : handleAddFriend}
                />
              );
            })
          ) : (
            <p>Aucun résultat</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-100 bg-bg">
      <Header
        title="Amis"
        showBackArrow
        onArrowBackClick={() => setOpen(false)}
        bottomContent={
          <div className="relative">
            <input
              className="input"
              placeholder="Rechercher des amis"
              autoComplete="off"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search.length > 0 && (
              <button
                className="text-red absolute right-4 top-1/2 -translate-y-1/2"
                onClick={() => setSearch("")}
              >
                <TbX size={20} />
              </button>
            )}
          </div>
        }
      />
      <div className="pt-38 px-4">
        {search.length > 0
          ? renderSearchResults()
          : myFriends && myFriends.length > 0
            ? renderMyFriends()
            : renderSuggestions()}
      </div>
    </div>
  );
}

function FriendItem({
  user,
  action,
  onAction,
  hideButton = false,
}: {
  user: UserType;
  action?: "add" | "remove";
  onAction?: (userId: Id<"users">) => void;
  hideButton?: boolean;
}) {
  const { firstname, lastname, email, medias } = user;
  const displayName =
    firstname && lastname
      ? `${firstname} ${lastname}`
      : email || "Utilisateur sans nom";

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {medias?.[0]?.url ? (
          <img
            src={medias[0].url}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-grey flex items-center justify-center">
            <TbUserHeart size={20} className="text-text/50" />
          </div>
        )}
        <div>
          <p className="font-medium">{displayName}</p>
          {email && firstname && lastname && (
            <p className="text-sm text-grey">{email}</p>
          )}
        </div>
      </div>
      {!hideButton && action && onAction && (
        <ButtonPastel
          color={action === "add" ? "green" : "red"}
          icon={action === "add" ? "plus" : "x"}
          onClick={() => onAction(user._id)}
        >
          {action === "add" ? "Ajouter" : "Retirer"}
        </ButtonPastel>
      )}
    </div>
  );
}
