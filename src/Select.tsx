import React, {useState, useEffect, useRef} from "react";
import styles from './select.module.css';

export type SelectOption = {
    label: string
    value: string | number
}

type SingleSelectProps = {
    multiple?: false
    value?: SelectOption
    onChange: (value: SelectOption | undefined) => void
}

type MultipleSelectProps = {
    multiple: true
    value: SelectOption[]
    onChange: (value: SelectOption[]) => void
}

type SelectProps = {
    options: SelectOption[]
} & (SingleSelectProps | MultipleSelectProps)

export function Select({multiple, value, onChange, options}: SelectProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [highlightedOptionIndex, setHighlightedOptionIndex] = useState(0);
    useEffect(() => {
        if (isOpen) setHighlightedOptionIndex(0);
    }, [isOpen]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target !== containerRef.current) {
                return;
            }
            switch (e.code) {
                case 'Enter':
                case 'Space':
                    setIsOpen(prev => !prev);
                    if (isOpen) {
                        selectOption(options[highlightedOptionIndex]);
                    }
                    break;
                case 'ArrowDown':
                case 'ArrowUp':
                    if (!isOpen) {
                        setIsOpen(true);
                        break;
                    }
                    setHighlightedOptionIndex(prev => {
                        const firstIndex = 0;
                        const lastIndex = options.length - 1;
                        return e.code === 'ArrowDown' ?
                            Math.min(prev + 1, lastIndex) :
                            Math.max(prev - 1, firstIndex);
                    });
                    break;
                case 'Escape':
                    setIsOpen(false);
                    break;
            }
        };
        containerRef.current?.addEventListener('keydown', handler);
        return () => {
            containerRef.current?.removeEventListener('keydown', handler);
        };
    }, [isOpen, highlightedOptionIndex, options]);

    

    function clearOptions() {
        multiple ? onChange([]) : onChange(undefined);
    }

    function selectOption(option: SelectOption) {
        if (multiple) {
            if(value.includes(option)) {
                unselectOption(option);
            } else {
                onChange([...value, option]);
            }
        } else {
            if (option !== value) onChange(option);
        }
    }

    function unselectOption(option: SelectOption) {
        if (multiple) {
            onChange(value.filter(obj => obj !== option));
        }
    }

    function isOptionsSelected(option: SelectOption) {
        if (multiple) {
            return value.includes(option);
        }
        return value === option;
    }

    return (
        <div
            ref={containerRef}
            onClick={() => setIsOpen(prev => !prev)}
            onBlur={() => setIsOpen(false)}
            tabIndex={0}
            className={styles.container}
        >
            <div className={styles.value}>
                {
                    multiple ? (
                        value.map(obj => (
                            <button
                                className={styles['option-badge']}
                                onClick={e => {
                                    e.stopPropagation();
                                    unselectOption(obj);
                                }}
                                key={obj.value}
                            >
                                {obj.label}
                                <span className={styles['remove-btn']}>
                                &times;
                            </span>
                            </button>
                        ))
                    ) : (
                        value?.label
                    )
                }
            </div>
            <button
                className={styles['clear-btn']}
                onClick={e => {
                    e.stopPropagation();
                    clearOptions();
                }}
            >
                &times;
            </button>
            <div className={styles.divider}></div>
            <div className={styles.caret}></div>
            {
                <ul className={`${styles.options} ${isOpen ? styles.show : ''}`}>
                    {options.map((option, idx) => (
                        <li
                            onClick={e => {
                                e.stopPropagation();
                                selectOption(option);
                                setIsOpen(false);
                            }}
                            className={
                                `${styles.option}
                                 ${isOptionsSelected(option) ? styles.selected : ''}
                                 ${idx === highlightedOptionIndex ? styles.highlighted : ''}`
                            }
                            onMouseEnter={() => {
                                setHighlightedOptionIndex(idx);
                            }}
                            key={option.value}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            }
        </div>
    );
}