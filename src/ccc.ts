type RBG = {
  r: number
  g: number
  b: number
}

interface BaseRGBClass {
  toString(): string
}

interface ColorContrastChecker {
  r: number
  g: number
  b: number
  fontSize: number
  rgbClass(): string
  isValidSixDigitColorCode(hex: string): boolean
  isValidThreeDigitColorCode(hex: string): boolean
  isValidColorCode(hex: string): boolean
  convertColorToSixDigit(hex: string): string
  calculateLuminance(lRGB: RBG): number
}

class RGBClass implements BaseRGBClass {
  r: number = 0
  g: number = 0
  b: number = 0

  toString = (): string => {
    return `<r: ${this.r} g: ${this.g} b: ${this.b} >`
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

export { ColorContrastChecker, RBG, BaseRGBClass, RGBClass, WCAGResultClass, CustomRadioResult }
