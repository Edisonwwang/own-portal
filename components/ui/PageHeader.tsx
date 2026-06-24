type PageHeaderProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-stone-50">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm text-stone-400">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </header>
  );
}
