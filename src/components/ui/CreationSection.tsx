export default function CreationSection({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col bg-white p-4 gap-2.5">
      {label && <h3 className="font-medium text-sm">{label}</h3>}
      {children}
    </div>
  );
}
