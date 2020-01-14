type RGB = {
  r: number
  g: number
  b: number
}

interface BaseRGBClass {
  toString(): string
}

interface IRGBClass extends BaseRGBClass {
  rgb: RGB
}

enum WCAG {
  'AA_LG' = 3.0,
  'AA_SM' = 4.5,
  'AAA_LG' = 4.5,
  'AAA_SM' = 7.0,
  'FONT_CUTOFF' = 18
}

type Pairs = {
  colorA: string
  colorB: string
  fontSize?: number
}

type CheckReturn = WCAGResultClass | CustomRadioResult | boolean

interface ColorContrastChecker {
  r: number
  g: number
  b: number
  fontSize: number
  isValidSixDigitColorCode(hex: string): boolean
  isValidThreeDigitColorCode(hex: string): boolean
  isValidColorCode(hex: string): boolean
  convertColorToSixDigit(hex: string): string
  calculateLuminance(lRGB: RGB): number
  getRGBFromHex(color: string): RGBClass
  calculateSRGB(rgb: RGBClass): RGBClass
  calculateLRGB(rgb: RGBClass): RGBClass
  getContrastRatio(lumA: number, lumB: number): number
  verifyContrastRatio(ratio: number): WCAGResultClass
  verifyCustomContrastRatio(inputRatio: number, checkRatio: number): CustomRadioResult
  hexToLuminance(color: string): number
  check(colorA: string, colorB: string, fontSize: number, customRatio?: number): CheckReturn
  isLevelAA(colorA: string, colorB: string, fontSize?: number): boolean
  isLevelAAA(colorA: string, colorB: string, fontSize?: number): boolean
  isLevelCustom(colorA: string, colorB: string, ratio: number): boolean
  checkPairs(pairs: Array<Pairs>, customRatio?: number): Array<CheckReturn>
}

class RGBClass implements IRGBClass {
  rgb = {
    r: 0,
    g: 0,
    b: 0
  }

  toString = (): string => {
    return `<r: ${this.rgb.r} g: ${this.rgb.g} b: ${this.rgb.b} >`
  }
}

class WCAGResultClass implements BaseRGBClass {
  AA: boolean = false
  AAA: boolean = false

  ratingText = (condition: boolean): string => (condition ? 'pass' : 'fail')

  toString = (): string => {
    return `< WCAG-AA: ${this.ratingText(this.AA)} WCAG-AAA: ${this.ratingText(this.AAA)} >`
  }
}

class CustomRadioResult implements BaseRGBClass {
  customRatio: boolean = false

  toString = (): string => {
    return `< Custom Ratio: ${this.customRatio ? 'pass' : 'fail'} >`
  }
}

export {
  ColorContrastChecker,
  RGB,
  BaseRGBClass,
  RGBClass,
  WCAGResultClass,
  CustomRadioResult,
  IRGBClass,
  WCAG,
  Pairs,
  CheckReturn
}
