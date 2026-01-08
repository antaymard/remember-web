import type { MomentWithCreator } from "@/types/memory.types";
import Header from "../nav/Header";
import { useRouter } from "@tanstack/react-router";
import { ButtonPastel } from "../ui/Button";
import { useUser } from "@/contexts/userContext";

export default function MomentViewScreen({
  moment,
}: {
  moment: MomentWithCreator;
}) {
  const router = useRouter();
  const { user } = useUser();
  return (
    <>
      <Header
        title={moment.title || "Untitled Moment"}
        showBackArrow
        onArrowBackClick={() => router.history.back()}
        rightContent={
          moment.creator_id === user?._id && (
            <ButtonPastel icon="pen" color="green" />
          )
        }
      />

      <div className="p-4"></div>
    </>
  );
}
