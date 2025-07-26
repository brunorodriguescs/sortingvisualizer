import {useEffect, useState} from "react";

export function useContainerHeight(offset: number = 64) {
    const [containerHeight, setContainerHeight] = useState(() => window.innerHeight - offset);

     useEffect(() => {
         const handleResize = () => {
             setContainerHeight(window.innerHeight - offset);
         };

         window.addEventListener("resize", handleResize);
         return () => {
             window.removeEventListener("resize", handleResize);
         };
     }, []);

    return containerHeight;
}