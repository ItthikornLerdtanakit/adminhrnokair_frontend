import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

type SelectSize = 'small' | 'medium' | 'large';
export interface CustomSelectProps<T> {
    value: T;
    onChange: (value: T) => void;
    options: Option<T>[];
    size?: SelectSize;
    width?: string | number;
    dot: boolean;
    error?: boolean;
}

export interface Option<T> {
    value: T;
    label: string;
    color?: string;
}

export const CustomSelect = <T,>({ value, onChange, options, size = 'large', width = '100%', dot, error }: CustomSelectProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    const sizeClasses: Record<SelectSize, string> = {
        small: 'px-3 py-2 text-sm',
        medium: 'px-3 py-2 text-base',
        large: 'px-3 py-2',
    };

    if (options.length === 0) {
        return (
            <div className='position-relative custom-select-wrapper w-100' style={{ width, minWidth: width, maxWidth: width }}>
                <button type='button' disabled className={`custom-select-btn d-flex align-items-center justify-content-between gap-2 border rounded bg-light text-secondary ${sizeClasses[size]}`} style={{ fontSize: 15, width: '100%', minWidth: '100%', maxWidth: '100%', cursor: 'not-allowed', opacity: 0.7 }}>
                    <span className='fw-medium text-muted text-truncate'>No Select</span>
                    <ChevronDown size={size === 'small' ? 16 : 18} className='text-muted' />
                </button>
            </div>
        );
    }

    return (
        <div className='position-relative custom-select-wrapper w-100' ref={dropdownRef} style={{ width, minWidth: width, maxWidth: width }}>
            <button type='button' onClick={() => setIsOpen(!isOpen)} className={`custom-select-btn d-flex align-items-center justify-content-between gap-2 rounded bg-white ${sizeClasses[size]}`} style={{ fontSize: 15, width: '100%', minWidth: '100%', maxWidth: '100%', flexShrink: 0, flexGrow: 1, border: error ? '2px solid red' : '1px solid rgb(222, 226, 230)' }}>
                <div className='d-flex align-items-center gap-2 flex-grow-1 overflow-hidden'>
                    {selectedOption?.color && dot === true && (
                        <div className='status-dot flex-shrink-0' style={{ backgroundColor: selectedOption.color, width: '10px', height: '10px', borderRadius: '50%' }}></div>
                    )}
                    <span className={`fw-medium text-truncate d-block ${selectedOption ? 'text-dark' : 'text-muted'}`} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {selectedOption ? selectedOption.label : 'Choose select'}
                    </span>
                </div>
                <ChevronDown size={size === 'small' ? 16 : 18} className={`text-secondary chevron-rotate ${isOpen ? 'open' : ''}`} />
            </button>
            {isOpen && (
                <div className='dropdown-menu-custom position-absolute mt-2 w-100 bg-white shadow-sm rounded show' style={{ zIndex: 1050, overflowY: 'auto', maxHeight: '300px' }}>
                    {options.map(option => (
                        <button key={String(option.value)} onClick={() => { onChange(option.value); setIsOpen(false); }} className={`dropdown-item-custom d-flex justify-content-between align-items-center w-100 border-0 bg-transparent px-3 py-2 ${value === option.value ? 'active' : ''}`} title={option.label}>
                            <div className='d-flex align-items-center gap-2 flex-grow-1 overflow-hidden'>
                                {option.color && dot === true && (
                                    <div className='status-dot flex-shrink-0' style={{ backgroundColor: option.color, width: '10px', height: '10px', borderRadius: '50%' }}></div>
                                )}
                                <span className='fw-medium text-dark text-truncate d-block' style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {option.label}
                                </span>
                            </div>
                            {value === option.value && <Check size={16} className='text-primary flex-shrink-0' />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
