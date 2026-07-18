import { FiChevronUp, FiChevronDown } from 'react-icons/fi';

export default function StepperInput({ value, onChange, min = 0, step = 1, onClick, className = '', ...props }) {
  const handleDecrement = (e) => {
    e.stopPropagation();
    const newVal = Math.max(min, Number(value) - step);
    onChange({ target: { value: newVal } });
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    const newVal = Number(value) + step;
    onChange({ target: { value: newVal } });
  };

  return (
    <div className={`flex items-center rounded-lg border-2 border-slate-200 bg-white overflow-hidden ${className}`} onClick={onClick}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={Number(value) <= min}
        className="flex items-center justify-center w-8 h-8 text-slate-500 hover:text-sky-600 hover:bg-sky-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
      >
        <FiChevronDown size={16} />
      </button>
      <input
        type="number"
        min={min}
        step={step}
        value={value}
        onChange={onChange}
        onClick={(e) => e.stopPropagation()}
        className="w-full min-w-0 text-center text-xs font-bold bg-transparent border-x-2 border-slate-200 py-1 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        {...props}
      />
      <button
        type="button"
        onClick={handleIncrement}
        className="flex items-center justify-center w-8 h-8 text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition-colors flex-shrink-0"
      >
        <FiChevronUp size={16} />
      </button>
    </div>
  );
}