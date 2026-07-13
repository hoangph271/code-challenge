import { describe, test, expect } from "bun:test"
import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from "./index"

describe("sum_to_n", () => {
  const impls = { sum_to_n_a, sum_to_n_b, sum_to_n_c }

  for (const [name, fn] of Object.entries(impls)) {
    describe(name, () => {
      test("sum_to_n(5) === 15", () => {
        expect(fn(5)).toBe(15)
      })

      test("sum_to_n(1) === 1", () => {
        expect(fn(1)).toBe(1)
      })

      test("sum_to_n(0) === 0", () => {
        expect(fn(0)).toBe(0)
      })

      test("sum_to_n(10) === 55", () => {
        expect(fn(10)).toBe(55)
      })

      test("sum_to_n(100) === 5050", () => {
        expect(fn(100)).toBe(5050)
      })
    })
  }
})

describe("negative n", () => {
  const impls = { sum_to_n_a, sum_to_n_b, sum_to_n_c }

  for (const [name, fn] of Object.entries(impls)) {
    test(`${name}(-1) throws RangeError`, () => {
      expect(() => fn(-1)).toThrow(RangeError)
    })
  }
})
