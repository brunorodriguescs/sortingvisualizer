export async function bubbleSort(array: number[], actions: [string, number, number][]): Promise<void> {
    let n: number = array.length;
    while (n > 0) {
        let swap: number = 0;
        for (let i: number = 1; i < n; i++) {
            actions.push(["compare", i - 1, i]);
            if (array[i - 1] > array[i]) {
                [array[i - 1], array[i]] = [array[i], array[i - 1]];
                swap = i;
                actions.push(["swap", i - 1, i]);
            }
        }
        n = swap;
    }
}


export async function heapSort(array: number[], actions: [string, number, number][]): Promise<void> {
    async function heapify(size: number, index: number): Promise<void> {
        let largest:number = index;
        while (true) {
            let left:number = 2 * index + 1;
            let right:number = 2 * index + 2;
            if (left < size) {
                actions.push(["compare", left, largest]);
                if (array[left] > array[largest]) largest = left;
            }
            if (right < size) {
                actions.push(["compare", largest, right]);
                if (array[right] > array[largest]) largest = right;
            }
            if (largest != index) {
                actions.push(["compare", index, largest], ["swap", index, largest]);
                [array[index], array[largest]] = [array[largest], array[index]];
                index = largest;
            }
            else break;
        }
    }
    const n: number = array.length;
    const promises: Promise<any>[] = [];
    for (let i = Math.floor(n/2) - 1; i >= 0; i--) promises.push(heapify(n, i));
    await Promise.all(promises);
    for (let i: number = n - 1; i > 0; i--) {
        actions.push(["swap", i, 0]);
        [array[0], array[i]] = [array[i], array[0]];
        await heapify(i, 0);
    }
}


export async function insertionSort(array: number[], actions: [string, number, number][]): Promise<void> {
    for (let i: number = 1; i < array.length; i++) {
        const key: number = array[i];
        let left: number = 0, right: number = i;
        while (left < right) {
            const mid: number = Math.floor((left + right) / 2);
            actions.push(["compare", i, mid]);
            array[mid] < key ? left = mid + 1 : right = mid;
        }
        const position: number = left;
        for (let j: number = i; j > position; j--) {
            actions.push(["compare", j, j - 1], ["shift", j, j - 1]);
            array[j] = array[j - 1];
        }
        actions.push(["insert", position, key]);
        array[position] = key;
    }
}


export async function mergeSort(array: number[], buffer: number[], actions: [string, number, number][]): Promise<void> {
    const callstack: [string, number, number, number, number][] = [["split", 0, array.length - 1, -1, 0]];
    let max_depth: number = 0;
    while (callstack.length > 0) {
        const [action, left, right, mid, depth] = callstack.pop() as [string, number, number, number, number];
        const read = depth % 2 === 0 ? array : buffer;
        const write = depth % 2 === 0 ? buffer : array;
        max_depth = Math.max(max_depth, depth);
        if (action === "split" && left < right) {
            const mid: number = Math.floor((left + right) / 2);
            callstack.push(["merge", left, right, mid, depth], ["split", left, mid, -1, depth + 1], ["split", mid + 1, right, -1, depth + 1]);
        } else if (action === "merge") {
            let l: number = left, r:number = mid + 1, i: number = left;
            while (l <= mid && r <= right) {
                actions.push(["compare", l, r]);
                if (read[l] <= read[r]) {
                    actions.push(["insert", i, read[l]]);
                    write[i] = read[l];
                    l++;
                } else {
                    actions.push(["insert", i, read[r]]);
                    write[i] = read[r];
                    r++;
                }
                i++;
            }
            while (l <= mid) {
                actions.push(["compare", i, l], ["insert", i, read[l]]);
                write[i] = read[l];
                l++, i++;
            }
            while (r <= right) {
                actions.push(["compare", i, r], ["insert", i, read[r]]);
                write[i] = read[r];
                r++, i++;
            }
        }
    }
    if (max_depth % 2 === 1) array.splice(0, array.length, ...buffer);
}


export async function quickSort(array: number[], actions: [string, number, number][]): Promise<void> {
    const callstack: [number, number][] = [[0, array.length - 1]];
    while (callstack.length > 0) {
        const [first, last] = callstack.pop() as [number, number];
        let i: number = last;
        if (first >= last) continue;
        const mid: number = Math.floor((first + last) / 2);
        if (array[mid] < array[first]) {
            actions.push(["compare", mid, first], ["swap", mid, first]);
            [array[first], array[mid]] = [array[mid], array[first]]
        }
        if (array[last] < array[first]) {
            actions.push(["compare", last, first], ["swap", last, first]);
            [array[first], array[last]] = [array[last], array[first]]
        }
        if (array[mid] < array[last]) {
            actions.push(["compare", mid, last - 1], ["swap", mid, last - 1]);
            [array[mid], array[last - 1]] = [array[last - 1], array[mid]]
            i = last - 1;
        }
        const pivot: number = array[i];
        let left: number = first, right: number = last;
        while (left <= right) {
            while (array[left] < pivot) {
                actions.push(["compare", left, i]);
                left++;
            }
            while (array[right] > pivot) {
                actions.push(["compare", right, i]);
                right--;
            }
            if (left <= right) {
                actions.push(["compare", left, right], ["swap", left, right]);
                [array[left], array[right]] = [array[right], array[left]];
                left++, right--;
            }
        }
        right - first < last - left ? callstack.push([left, last], [first, right]) : callstack.push([first, right], [left, last]);
    }
}


export async function selectionSort(array: number[], actions: [string, number, number][]): Promise<void> {
    const n: number = array.length;
    for (let i: number = 0; i < n - 1; i++) {
        let min_idx: number = i;
        for (let j: number = i + 1; j < n; j++) {
            actions.push(["compare", j, min_idx]);
            if (array[j] < array[min_idx]) min_idx = j;
        }
        if (min_idx != i) {
            actions.push(["swap", i, min_idx]);
            [array[i], array[min_idx]] = [array[min_idx], array[i]];
        }
    }
}