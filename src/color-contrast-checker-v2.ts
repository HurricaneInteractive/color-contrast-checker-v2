import { ColorContrastChecker, RBG } from './ccc'

// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
export default class CCC implements ColorContrastChecker {
  r!: number
  g!: number
  b!: number
  fontSize: number = 14

  regSixDigitColorcode: RegExp = new RegExp('^(#)?([0-9a-fA-F]{6})?$')
  regThreeDigitColorcode: RegExp = new RegExp('^(#)?([0-9a-fA-F]{3})?$')

  rgbClass = (): string => `<r: ${this.r} g: ${this.g} b: ${this.b} >`

  isValidSixDigitColorCode = (hex: string): boolean => this.regSixDigitColorcode.test(hex)
  isValidThreeDigitColorCode = (hex: string): boolean => this.regThreeDigitColorcode.test(hex)

  isValidColorCode = (hex: string): boolean =>
    this.isValidSixDigitColorCode(hex) || this.isValidThreeDigitColorCode(hex)

  convertColorToSixDigit = (hex: string) =>
    `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`

  calculateLuminance = ({ r, g, b }: RBG): number => 0.2126 * r + 0.7152 * g + 0.0722 * b
}
