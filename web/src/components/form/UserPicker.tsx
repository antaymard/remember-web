import { api } from "@/../convex/_generated/api";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { useState, useEffect } from "react";
import { TbUsers, TbX } from "react-icons/tb";
import Header from "@/components/nav/Header";
import type { UserType } from "@/types/user.types";
import { ButtonPastel } from "../ui/Button";

export default function UserPicker({
  form,
  name,
  placeholder = "Partager avec des amis",
}: {
  form: any;
  name: string;
  placeholder?: string;
}) {
  const friendList = useQuery(api.users.listMyFriends);

  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState<Array<string>>([]);

  if (!friendList?.length)
    return (
      <p className="input">Ajoutez des amis pour partager un souvenir</p>
    );
  return (
    <form.Field name={name}>
      {(field: { state: { value: any }; handleChange: (value: any) => void; name: string }) => {
        return (
          <>
            {field.state?.value?.length
              ? field.state.value.map((userId: string) => {
                  const user = friendList.find((u) => u._id === userId);
                  if (!user) return null;
                  return <UserItem key={user._id} user={user} hideButton />;
                })
              : null}
            <button
              type="button"
              className={cn(
                "input",
                field.state?.value?.length ? "text-text" : "text-grey"
              )}
              onClick={() => setOpen(true)}
            >
              <TbUsers size={24} />
              {placeholder}
            </button>
            {open && (
              <PickerScreen
                tempValue={tempValue}
                setTempValue={setTempValue}
                form={form}
                name={name}
                friendList={friendList}
                setOpen={setOpen}
              />
            )}
          </>
        );
      }}
    </form.Field>
  );
}

function PickerScreen({
  form,
  name,
  friendList,
  setOpen,
  tempValue,
  setTempValue,
}: {
  form: any;
  name: string;
  friendList?: any[];
  setOpen: (open: boolean) => void;
  tempValue: Array<string>;
  setTempValue: (value: Array<string>) => void;
}) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    setTempValue(form.getFieldValue(name));
    // Bloquer le scroll quand la modale est ouverte
    document.body.style.overflow = "hidden";

    // Restaurer le scroll quand la modale est fermée
    return () => {
      document.body.style.overflow = "";
    };
  }, [setOpen]);

  function renderSuggestions() {
    if (!friendList) return null;
    return (
      <div className="space-y-4">
        <h3>Amis</h3>
        <div className="flex flex-col gap-2">
          {friendList.map((user) => (
            <UserItem
              key={user._id}
              user={user}
              action={tempValue.includes(user._id!) ? "remove" : "add"}
              tempValue={tempValue}
              setTempValue={setTempValue}
            />
          ))}
        </div>
      </div>
    );
  }

  function renderAddedUsers() {
    if (!friendList) return null;
    return (
      <div className="space-y-4">
        <h3>Partagé avec</h3>
        <div className="flex flex-col gap-2">
          {tempValue.map((_id) => {
            const user = friendList.find((u) => u._id === _id);
            if (!user) return null;
            return (
              <UserItem
                key={user._id}
                user={user}
                action="remove"
                tempValue={tempValue}
                setTempValue={setTempValue}
              />
            );
          })}
        </div>
      </div>
    );
  }

  function renderSearchResults() {
    const results = friendList?.filter((user) => {
      const fullName = `${user.firstname || ""} ${user.lastname || ""}`.toLowerCase();
      return fullName.includes(search.toLowerCase());
    });
    return (
      <div className="space-y-4">
        <h3>Résultats de la recherche</h3>
        <div className="flex flex-col gap-2">
          {results?.length ? (
            results.map((user) => (
              <UserItem
                key={user._id}
                user={user}
                action={tempValue.includes(user._id!) ? "remove" : "add"}
                tempValue={tempValue}
                setTempValue={setTempValue}
              />
            ))
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
        title="Partager avec"
        rightContent={
          <ButtonPastel
            color="green"
            icon="check"
            label="OK"
            onClick={() => {
              form.setFieldValue(name, tempValue);
              setOpen(false);
            }}
          />
        }
        showBackArrow
        onArrowBackClick={() => setOpen(false)}
        bottomContent={
          <div className="relative">
            <input
              className="input"
              placeholder="Rechercher un ami"
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
          : tempValue.length === 0
            ? renderSuggestions()
            : renderAddedUsers()}
      </div>
    </div>
  );
}

function UserItem({
  user,
  action,
  tempValue,
  setTempValue,
  hideButton = false,
}: {
  user: UserType;
  action?: "add" | "remove";
  tempValue?: Array<string>;
  setTempValue?: (value: Array<string>) => void;
  hideButton?: boolean;
}) {
  const { firstname, lastname, medias } = user;
  const displayName = firstname && lastname ? `${firstname} ${lastname}` : user.email || "Utilisateur";

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={medias?.[0]?.url || "/default-avatar.png"}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="font-medium">{displayName}</p>
      </div>
      {!hideButton && (
        <ButtonPastel
          color={action === "add" ? "green" : "red"}
          icon={action === "add" ? "plus" : "x"}
          onClick={() => {
            if (!tempValue || !setTempValue) return;
            if (action === "add") {
              // Check if in array
              if (tempValue?.includes(user._id!)) return;
              setTempValue?.([...tempValue, user._id!]);
            }
            if (action === "remove") {
              setTempValue?.(tempValue.filter((id) => id !== user._id));
            }
          }}
        >
          {action === "add" ? "Ajouter" : "Retirer"}
        </ButtonPastel>
      )}
    </div>
  );
}
