import type { MomentType } from "@/types/memory.types";

export default function MomentCard({ moment }: { moment: MomentType }) {
  return moment.title;
}
