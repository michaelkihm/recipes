export const ALL_DURATION_UNITS = ['min' , 'h'] as const;

type Unit = typeof ALL_DURATION_UNITS[number];

export interface Duration {
    duration: number,
    unit: Unit
}