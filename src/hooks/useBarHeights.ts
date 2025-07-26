import {useLayoutEffect, useState} from "react";

export const useBarHeights = (barRefs: (HTMLDivElement | null)[], bars: number[]) => {
    const [barHeights, setBarHeights] = useState<number[]>([]);

    useLayoutEffect(() => {
        if (barRefs.some(ref => ref === null)) return;

        const newHeights = barRefs.map(ref => ref!.offsetHeight);
        setBarHeights(newHeights);
    }, [barRefs.map(ref => ref?.offsetHeight).join("-"), bars]);

    return barHeights;
};
