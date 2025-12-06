import { cn } from "../../lib/utils";

const Button = ({
  className,
  variant = "default",
  size = "default",
  ...props
}) => {
  const variants = {
    default: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    outline:
      "border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-100",
    ghost: "hover:bg-slate-800 text-slate-300 hover:text-white",
    danger:
      "bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-900",
    primary:
      "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.3)]",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
};

export default Button;
