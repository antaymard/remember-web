export default function Header({
  title = "Titre",
  showBackArrow = false,
  rightContent,
}: {
  title: string;
  showBackArrow?: boolean;
  rightContent?: React.ReactNode;
}) {
  return (
    <header className="w-full h-17.5 bg-white px-4 border-b border-text/10 fixed top-0 left-0 flex items-center justify-between">
      <h1 className="text-3xl font-medium">{title}</h1>
    </header>
  );
}
