import CCC from '../src/color-contrast-checker-v2'
import { RGB } from '../src/ccc'

let checker: CCC

describe('Color Contrast Checker', () => {
  it('can be instantiated', () => {
    expect(new CCC()).toBeInstanceOf(CCC)
  })
})

describe('Validation', () => {
  beforeEach(() => {
    checker = new CCC()
  })

  it('should validate 3 digit hex values', () => {
    const hex = '#333'
    expect(checker.isValidThreeDigitColorCode(hex)).toBeTruthy()
  })

  it('should validate 6 digit hex values', () => {
    const hex = '#666666'
    expect(checker.isValidSixDigitColorCode(hex)).toBeTruthy()
  })

  it('should fail 2 digit hex code', () => {
    const hex = '#22'
    expect(checker.isValidThreeDigitColorCode(hex)).toBeFalsy()
  })

  it('should fail 5 digit hex code', () => {
    const hex = '#33333'
    expect(checker.isValidSixDigitColorCode(hex)).toBeFalsy()
  })

  it('should pass valid color code check - 3 digits', () => {
    const hex = '#333'
    expect(checker.isValidColorCode(hex)).toBeTruthy()
  })

  it('should pass valid color code check - 6 digits', () => {
    const hex = '#666666'
    expect(checker.isValidColorCode(hex)).toBeTruthy()
  })

  it('should fail invalid color code check - 4 digits', () => {
    const hex = '#3334'
    expect(checker.isValidColorCode(hex)).toBeFalsy()
  })

  it('should fail invalid color code check - 8 digits', () => {
    const hex = '#66666688'
    expect(checker.isValidColorCode(hex)).toBeFalsy()
  })
})

describe('Convert hex', () => {
  beforeEach(() => {
    checker = new CCC()
  })

  it('should convert to 6 digit hex - basic', () => {
    expect(checker.convertColorToSixDigit('#333')).toBe('#333333')
  })

  it('should convert to 6 digit hex - advanced', () => {
    expect(checker.convertColorToSixDigit('#e6a')).toBe('#ee66aa')
  })
})

describe('Luminance', () => {
  beforeEach(() => {
    checker = new CCC()
  })

  it('should calculate luminance - 0', () => {
    const rgb: RGB = {
      r: 0,
      g: 0,
      b: 0
    }

    expect(checker.calculateLuminance(rgb)).toBe(0)
  })

  it('should calculate luminance - 1', () => {
    const rgb: RGB = {
      r: 40,
      g: 130,
      b: 5
    }

    expect(checker.calculateLuminance(rgb)).toBe(101.84100000000001)
  })
})
