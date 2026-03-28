import { cn } from "@/lib/utils";

interface CardProps {
  title: string;
  description: string;
  className?: string;
}

export function Card({ title, description, className }: CardProps) {
  return (
    <div className={cn("rounded-xl border border-neutral-200 bg-white p-6 shadow-sm", className)}>
      <h3 className="text-base font-semibold text-neutral-900">{title}</h3>
      <p className="mt-1 text-sm text-neutral-500">{description}</p>
    </div>
  );
}
