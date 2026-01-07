import { api } from "@/../convex/_generated/api";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { useState, useEffect } from "react";
import { TbUserHexagon, TbX } from "react-icons/tb";
import Header from "@/components/nav/Header";
import type { PersonType } from "@/types/memory.types";
import { ButtonPastel } from "../ui/Button";

export default function PersonPicker({
  form,
  name,
  placeholder = "Ajouter des personnes",
}: {
  form: any;
  name: string;
  placeholder?: string;
}) {
  const personList = useQuery(api.persons.list);

  const [open, setOpen] = useState(false);
  const [tempValue, setTempValue] = useState<Array<string>>([]);

  if (!personList?.length)
    return (
      <p className="input">Créez des personnes pour les lier à un souvenir</p>
    );
  return (
    <form.Field name={name}>
      {(field: { state: { value: any }; handleChange: (value: any) => void; name: string }) => {
        return (
          <>
            {field.state?.value?.length
              ? field.state.value.map((personId: string) => {
                  const person = personList.find((p) => p._id === personId);
                  if (!person) return null;
                  return <PersonItem person={person} hideButton />;
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
              <TbUserHexagon size={24} />
              {placeholder}
            </button>
            {open && (
              <PickerScreen
                tempValue={tempValue}
                setTempValue={setTempValue}
                form={form}
                name={name}
                personList={personList}
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
  personList,
  setOpen,
  tempValue,
  setTempValue,
}: {
  form: any;
  name: string;
  personList?: any[];
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
    if (!personList) return null;
    return (
      <div className="space-y-4">
        <h3>Suggestions</h3>
        <div className="flex flex-col gap-2">
          {personList.map((person) => (
            <PersonItem
              key={person._id}
              person={person}
              action={tempValue.includes(person._id!) ? "remove" : "add"}
              tempValue={tempValue}
              setTempValue={setTempValue}
            />
          ))}
        </div>
      </div>
    );
  }

  function renderAddedPersons() {
    if (!personList) return null;
    return (
      <div className="space-y-4">
        <h3>Ajouté(s)</h3>
        <div className="flex flex-col gap-2">
          {tempValue.map((_id) => {
            const person = personList.find((p) => p._id === _id);
            if (!person) return null;
            return (
              <PersonItem
                key={person._id}
                person={person}
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
    const results = personList?.filter((person) => {
      const fullName = `${person.firstname} ${person.lastname}`.toLowerCase();
      return fullName.includes(search.toLowerCase());
    });
    return (
      <div className="space-y-4">
        <h3>Résultats de la recherche</h3>
        <div className="flex flex-col gap-2">
          {results?.length ? (
            results.map((person) => (
              <PersonItem
                key={person._id}
                person={person}
                action={tempValue.includes(person._id!) ? "remove" : "add"}
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
        title="Personnes"
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
              placeholder="Rechercher des personnes"
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
            : renderAddedPersons()}
      </div>
    </div>
  );
}

function PersonItem({
  person,
  action,
  tempValue,
  setTempValue,
  hideButton = false,
}: {
  person: PersonType;
  action?: "add" | "remove";
  tempValue?: Array<string>;
  setTempValue?: (value: Array<string>) => void;
  hideButton?: boolean;
}) {
  const { firstname, lastname, medias } = person;
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={medias?.[0]?.url}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="font-medium">{`${firstname} ${lastname}`}</p>
      </div>
      {!hideButton && (
        <ButtonPastel
          color={action === "add" ? "green" : "red"}
          icon={action === "add" ? "plus" : "x"}
          onClick={() => {
            if (!tempValue || !setTempValue) return;
            if (action === "add") {
              // Check if in array
              if (tempValue?.includes(person._id!)) return;
              setTempValue?.([...tempValue, person._id!]);
            }
            if (action === "remove") {
              setTempValue?.(tempValue.filter((id) => id !== person._id));
            }
          }}
        >
          {action === "add" ? "Ajouter" : "Retirer"}
        </ButtonPastel>
      )}
    </div>
  );
}
