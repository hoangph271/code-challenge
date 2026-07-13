/**
 * Assumption: n is a non-negative integer. The spec only demonstrates
 * positive input (sum_to_n(5) === 15) and doesn't define negative behavior,
 * so we *fail fast* for negative n by throwing a RangeError.
 * Should we need to support negative n, we should first *clarify* the spec & make sure all 03
 * functions handle negative n the same way.
 */

function assertNonNegativeInteger(n: number): void {
  if (n < 0) {
    throw new RangeError(`sum_to_n expects a non-negative integer, received ${n}`)
  }
}

// ? using for loop
export function sum_to_n_a(n: number) {
  assertNonNegativeInteger(n)

  let sum = 0

  for (let i = 1; i <= n; i++) {
    sum += i
  }

  return sum
}

// ? using recursion
export function sum_to_n_b(n: number): number {
  assertNonNegativeInteger(n)

  if (n === 0) return 0

  return n + sum_to_n_b(n - 1)
}

// ? Gauss' trick: sum from 1 to n = n * (n + 1) / 2
export function sum_to_n_c(n: number): number {
  assertNonNegativeInteger(n)

  return n * (n + 1) / 2
}
