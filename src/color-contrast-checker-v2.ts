import { ColorContrastChecker } from './ccc'

// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
export default class CCC implements ColorContrastChecker {
  r: string = ''
  g: string = ''
  b: string = ''
  fontSize: number = 14

  regSixDigitColorcode: RegExp = new RegExp('^(#)?([0-9a-fA-F]{6})?$')
  regThreeDigitColorcode: RegExp = new RegExp('^(#)?([0-9a-fA-F]{3})?$')

  rgbClass = (): string => `<r: ${this.r} g: ${this.g} b: ${this.b} >`

  isValidSixDigitColorCode = (hex: string): boolean => this.regSixDigitColorcode.test(hex)
  isValidThreeDigitColorCode = (hex: string): boolean => this.regThreeDigitColorcode.test(hex)

  isValidColorCode = (hex: string): boolean =>
    this.isValidSixDigitColorCode(hex) || this.isValidThreeDigitColorCode(hex)
}
