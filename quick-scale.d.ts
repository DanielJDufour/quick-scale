export declare function createScaleFunction(
  [old_min, old_max]: [number, number],
  [new_min, new_max]: [number, number],
  options?: {
    flip?: boolean;
    no_range_value?: number;
    no_range_value_strategy?: "highest" | "middle" | "lowest";
    round?: boolean;
  }
): (value: number) => number;
