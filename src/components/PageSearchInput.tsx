import { Search } from "lucide-react";

interface PageSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function PageSearchInput({
  value,
  onChange,
  placeholder,
}: PageSearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-300 rounded-lg 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
}
