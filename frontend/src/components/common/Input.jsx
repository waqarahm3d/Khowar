import { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      icon: Icon,
      iconPosition = 'left',
      fullWidth = false,
      className = '',
      wrapperClassName = '',
      ...props
    },
    ref
  ) => {
    const baseClasses = 'px-4 py-2.5 border rounded-lg text-base transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed';

    const errorClasses = error
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : 'border-gray-300';

    const iconPaddingClasses = Icon
      ? iconPosition === 'left'
        ? 'pl-10'
        : 'pr-10'
      : '';

    const widthClass = fullWidth ? 'w-full' : '';

    const inputClasses = `
      ${baseClasses}
      ${errorClasses}
      ${iconPaddingClasses}
      ${widthClass}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${wrapperClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {Icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <Icon className="w-5 h-5 text-gray-400" />
            </div>
          )}

          <input ref={ref} className={inputClasses} {...props} />

          {Icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Icon className="w-5 h-5 text-gray-400" />
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
