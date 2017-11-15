import { Measure } from './datatypes'

/**
 * Maps distances (mi) to times (min).
 */
export const TIME_DISTANCES: Map<Measure, number> = new Map
TIME_DISTANCES.set(15, 30)
TIME_DISTANCES.set(20, 40)
TIME_DISTANCES.set(30, 60)
