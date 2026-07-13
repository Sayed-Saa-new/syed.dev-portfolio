type BorderCardProps = {
  children: React.ReactNode;
};
export function BorderCard({ children }: BorderCardProps) {
  return (
    <div className="flex h-full min-h-[170px] flex-col justify-between gap-4 rounded-[20px] border border-border-primary p-7">
      {children}
    </div>

  );
}
