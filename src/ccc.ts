interface ColorContrastChecker {
  r: string
  g: string
  b: string
  fontSize: number
  rgbClass(): string
  isValidSixDigitColorCode(hex: string): boolean
  isValidThreeDigitColorCode(hex: string): boolean
  isValidColorCode(hex: string): boolean
}

export { ColorContrastChecker }
