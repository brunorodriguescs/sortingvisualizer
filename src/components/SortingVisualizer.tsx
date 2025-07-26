import {useEffect, useRef, useState} from "react";
import {motion, useAnimation} from "framer-motion";
import {useContainerHeight} from "../hooks/useContainerHeight";
import {useBarRefs} from "../hooks/useBarRefs";
import {useBarHeights} from "../hooks/useBarHeights";
import {Slider} from "./Slider.tsx";
import {Dropdown} from "./Dropdown.tsx";
import {PlayIcon, StopIcon} from "@radix-ui/react-icons";
import * as sort from "../utils/algorithms.ts";
import "./SortingVisualizer.css";


export const SortingVisualizer = () => {
    const [listSize, setListSize] = useState<number[]>([100]);
    const [sortAlgo='', setSortAlgo] = useState<string>();
    const [bars, setBars] = useState<number[]>([]);
    const containerHeight = useContainerHeight(64);
    const {refs: barRefs, setBarRef} = useBarRefs(bars.length);
    const barHeights = useBarHeights(barRefs, bars);
    const maxHeight = Math.max(...bars);
    const barWidth = (100 / bars.length);
    const fadeDiv = useAnimation();
    const [_, _setStopped] = useState(false);
    const stoppedRef = useRef(false);
    const setStopped = (value: boolean) => {stoppedRef.current = value; _setStopped(value);};
    const [sorted, setSorted] = useState(false);
    const [sorting, setSorting] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [animationSpeed, setSpeed] = useState<number[]>([0]);
    const duration = 100 - animationSpeed[0];

    useEffect(() => {generateList().then();}, []);

    const colorBar = (bar: HTMLDivElement, color: string) => {
        if (bar) switch (color) {
            case "red":
                bar.style.backgroundColor = "#f87171";
                bar.style.boxShadow = "0 0 12px 4px rgba(248, 113, 113, 0.8)";
                break;
            case "green":
                bar.style.backgroundColor = "#34d399";
                bar.style.boxShadow = "0 0 12px 4px rgba(52, 211, 153, 0.8)";
                break;
            case "blue":
                bar.style.backgroundColor = "#2b7fff";
                bar.style.boxShadow = "0 0 12px 4px rgba(40, 110 , 225, 0.8)";
                break;
            case "":
                bar.style.backgroundColor = "";
                bar.style.boxShadow = "";
                break;
        }
    };

    const generateList = async () => {
        if (!generating && !sorting) {
            setGenerating(true);
            setSorted(false);
            const array: number[] = Array.from({length: listSize[0]}, () => Math.floor(Math.random() * (containerHeight - 8 + 1)) + 8);
            await fadeDiv.start({opacity: 0, transition: {duration: 0.25}});
            setBars([]);
            await new Promise(resolve => setTimeout(resolve, 0));
            setBars(array);
            await fadeDiv.start({opacity: 1, transition: {duration: 0.25}});
            setGenerating(false);
        }
    };

    const sortList = async () => {
        if (sortAlgo !== '' && !sorting && !sorted) {
            setSorting(true);
            setStopped(false);
            const array: number[] = barHeights;
            const actions: [string, number, number][] = [];
            switch (sortAlgo) {
                case "bubble":
                    await sort.bubbleSort(array, actions);
                    break;
                case "heap":
                    await sort.heapSort(array, actions);
                    break;
                case "insertion":
                    await sort.insertionSort(array, actions);
                    break;
                case "merge":
                    await sort.mergeSort(array, [...array], actions);
                    break;
                case "quick":
                    await sort.quickSort(array, actions);
                    break;
                case "selection":
                    await sort.selectionSort(array, actions);
                    break;
            }
            const newBars = [...bars];
            for (let i = 0; i < actions.length; i++) {
                if (stoppedRef.current) break;
                const [type, a, b] = actions[i];
                const barA = barRefs[a];
                const barB = barRefs[b];
                if (type === "compare") {
                    colorBar(barA, "red");
                    if (a !== b) colorBar(barB, "red");
                    await new Promise(res => setTimeout(res, duration));
                    colorBar(barA, "");
                    if (a !== b) colorBar(barB, "");
                } else if (type === "swap") {
                    colorBar(barA, "green");
                    colorBar(barB, "green");
                    [newBars[a], newBars[b]] = [newBars[b], newBars[a]];
                    setBars([...newBars]);
                    await new Promise(res => setTimeout(res, duration));
                    colorBar(barA, "");
                    colorBar(barB, "");
                } else if (type === "insert" || type === "shift") {
                    colorBar(barA, "green");
                    if (type === "insert") newBars[a] = b;
                    else if (type === "shift") newBars[a] = newBars[b];
                    await new Promise(res => setTimeout(res, duration));
                    setBars([...newBars]);
                    colorBar(barA, "");
                }
            }
            for (let i = 0; i < barRefs.length; i++) {
                if (stoppedRef.current) break;
                const bar = barRefs[i];
                if (bar) {
                    bar.animate([
                        { transform: "scaleY(1)" },
                        { transform: "scaleY(1.2)" },
                        { transform: "scaleY(1)" }
                    ], {
                        duration: 600,
                        easing: "ease-in-out",
                        delay: i * 20
                    });
                }
            }
            setSorting(false);
            setSorted(true);
        }
    };

    return (<>
        <div className="top-bar">
            <div className="division mr-2">
                <motion.button
                    initial={{scale: 1}}
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.95}}
                    transition={{duration: 0.2}}
                    disabled={sorting || generating}
                    className={`btn-generate btn-glow ${sorting ? 'btn-disabled' : ''}`}
                    onClick={generateList}
                >
                    Generate List
                </motion.button>
                <div className="flex flex-col items-center">
                    <span className="text-white font-medium text-sm mb-1">
                        List Size: {listSize[0]}
                    </span>
                    <Slider value={listSize} min={10} max={200} step={5} setValue={setListSize}/>
                </div>
            </div>
            <div className="division m-4">
                <Dropdown
                    placeholder="Sorting Algorithm"
                    options={[
                        {label: "Bubble Sort", onSelect: () => setSortAlgo("bubble")},
                        {label: "Heap Sort", onSelect: () => setSortAlgo("heap")},
                        {label: "Insertion Sort", onSelect: () => setSortAlgo("insertion")},
                        {label: "Merge Sort", onSelect: () => setSortAlgo("merge")},
                        {label: "Quick Sort", onSelect: () => setSortAlgo("quick")},
                        {label: "Selection Sort", onSelect: () => setSortAlgo("selection")},
                    ]}
                />
                <div className="flex flex-col items-center">
                    <span className="text-white font-medium text-sm mb-1">
                        Animation Speed: {animationSpeed[0] + 100}%
                    </span>
                    <Slider value={animationSpeed} min={0} max={100} step={50} setValue={setSpeed}/>
                </div>
            </div>
            <div className="division ml-2">
                <span className="text-white font-medium text-lg mb-1 mr-2">
                    {sorting ? "Stop:" : "Play:"}
                </span>
                <motion.button
                        initial={{scale: 1.2}}
                        whileHover={{scale: 1.4}}
                        whileTap={{scale: 1.1}}
                        transition={{type: "spring", stiffness: 500, duration: 0.2}}
                        disabled={sorted}
                        className={`btn-sort btn-glow ${sorted ? 'btn-disabled' : ''}`}
                        onClick={() => {
                            if (sorting) {
                                setStopped(true);
                            } else {
                                setStopped(false);
                                sortList().then();
                            }
                        }}
                    >
                    {sorting ? <StopIcon/> : <PlayIcon/>}
                </motion.button>
            </div>
        </div>
        <motion.div animate={fadeDiv} initial={{opacity:0}} className="bars">
            {bars.map((value, index) => {
                const barHeight = Math.floor((value / maxHeight) * containerHeight);
                return (
                    <div
                        key={index}
                        ref={setBarRef(index)}
                        className={`bar ${sorting ? 'transition-all' : 'transition-[colors,shadow,opacity]'}`}
                        style={{height: `${barHeight}px`, width: `${barWidth}%`, transitionDuration: `${duration}`}}
                    />
                );
            })}
        </motion.div>
    </>);
};