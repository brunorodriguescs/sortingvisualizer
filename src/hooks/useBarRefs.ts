import {useEffect, useRef} from "react";

export function useBarRefs(length: number) {
    const refs = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        refs.current = Array.from({ length }, (_, i) => refs.current[i] ?? null);
    }, [length]);

    const setBarRef = (index: number) => (el: HTMLDivElement | null) => {
        if (el !== null) {
            refs.current[index] = el;
        }
    };

    return {refs: refs.current, setBarRef};
}