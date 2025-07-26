import type {Dispatch, SetStateAction} from "react";
import {motion} from "framer-motion";
import * as slider from "@radix-ui/react-slider";
import "./Slider.css";

interface SliderProps {
    value: number[];
    min: number;
    max: number;
    step: number;
    setValue: Dispatch<SetStateAction<number[]>>;
}

export const Slider = ({value, min, max, step, setValue}: SliderProps) => {
    return (
        <slider.Root
            className="slider-root mr-4"
            defaultValue={value}
            min={min}
            max={max}
            step={step}
            onValueChange={setValue}
        >
            <slider.Track className="slider-track"/>
            <slider.Thumb asChild>
                <motion.div
                    className="slider-thumb"
                    initial={{scale: 1}}
                    whileHover={{scale: 1.15}}
                    whileTap={{scale: 1}}
                    transition={{type: "spring", stiffness: 300}}
                />
            </slider.Thumb>
        </slider.Root>
    );
};