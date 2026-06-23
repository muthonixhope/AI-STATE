import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarNavigation({ label, onPrev, onNext, onToday }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onPrev}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <p className="min-w-[12rem] text-center text-sm font-bold text-slate-800">{label}</p>
      <button
        onClick={onNext}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      {onToday && (
        <button
          onClick={onToday}
          className="ml-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
        >
          Today
        </button>
      )}
    </div>
  );
}
