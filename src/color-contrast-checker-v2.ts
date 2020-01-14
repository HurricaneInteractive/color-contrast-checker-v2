import {
  ColorContrastChecker,
  RGB,
  RGBClass,
  WCAGResultClass,
  WCAG,
  CustomRadioResult,
  Pairs,
  CheckReturn
} from './ccc'

export default class CCC implements ColorContrastChecker {
  r!: number
  g!: number
  b!: number
  fontSize: number = 14

  regSixDigitColorcode: RegExp = new RegExp('^(#)?([0-9a-fA-F]{6})?$')
  regThreeDigitColorcode: RegExp = new RegExp('^(#)?([0-9a-fA-F]{3})?$')

  isValidSixDigitColorCode = (hex: string): boolean => this.regSixDigitColorcode.test(hex)
  isValidThreeDigitColorCode = (hex: string): boolean => this.regThreeDigitColorcode.test(hex)

  isValidColorCode = (hex: string): boolean =>
    this.isValidSixDigitColorCode(hex) || this.isValidThreeDigitColorCode(hex)

  convertColorToSixDigit = (hex: string) =>
    `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`

  calculateLuminance = ({ r, g, b }: RGB): number => 0.2126 * r + 0.7152 * g + 0.0722 * b

  getRGBFromHex = (color: string): RGBClass => {
    const rgb = new RGBClass()

    rgb.rgb.r = parseInt(color.slice(1, 3), 16)
    rgb.rgb.g = parseInt(color.slice(3, 5), 16)
    rgb.rgb.b = parseInt(color.slice(5, 7), 16)

    return rgb
  }

  calculateSRGB = (rgb: RGBClass): RGBClass => {
    const sRGB = new RGBClass()
    const keys: Array<keyof RGB> = ['r', 'g', 'b']

    keys.forEach(k => {
      if (rgb.hasOwnProperty(k)) {
        sRGB.rgb[k] = parseFloat(`${rgb.rgb[k] / 255}`)
      }
    })

    return sRGB
  }

  calculateLRGB = (rgb: RGBClass): RGBClass => {
    const sRGB: RGBClass = this.calculateSRGB(rgb)
    const lRGB: RGBClass = new RGBClass()
    let val: number = 0
    const keys: Array<keyof RGB> = ['r', 'g', 'b']

    keys.forEach(k => {
      val = parseFloat(`${sRGB.rgb[k]}`)
      if (val <= 0.03928) {
        lRGB.rgb[k] = val / 12.92
      } else {
        lRGB.rgb[k] = Math.pow((val + 0.055) / 1.055, 2.4)
      }
    })

    return lRGB
  }

  getContrastRatio = (lumA: number, lumB: number): number => {
    let ratio: number = 0
    let lighter: number = 0
    let darker: number = 0

    lighter = lumA >= lumB ? lumA : lumB
    darker = lumA >= lumB ? lumB : lumA

    ratio = (lighter + 0.05) / (darker + 0.05)

    return ratio
  }

  verifyContrastRatio = (ratio: number): WCAGResultClass => {
    const results = new WCAGResultClass()
    const fs = this.fontSize

    if (fs >= WCAG.FONT_CUTOFF) {
      results.AA = ratio >= WCAG.AA_LG
      results.AAA = ratio >= WCAG.AAA_LG
    } else {
      results.AA = ratio >= WCAG.AA_SM
      results.AAA = ratio >= WCAG.AAA_SM
    }

    return results
  }

  verifyCustomContrastRatio = (inputRatio: number, checkRatio: number): CustomRadioResult => {
    const results = new CustomRadioResult()

    results.customRatio = inputRatio >= checkRatio
    return results
  }

  hexToLuminance = (color: string): number => {
    if (this.isValidThreeDigitColorCode(color)) {
      color = this.convertColorToSixDigit(color)
    }

    let RGBcolor: RGBClass = this.getRGBFromHex(color)
    let LRGB = this.calculateLRGB(RGBcolor)

    return this.calculateLuminance(LRGB.rgb)
  }

  check = (
    colorA: string,
    colorB: string,
    fontSize: number,
    customRatio: number | undefined = undefined
  ): CheckReturn => {
    this.fontSize = fontSize

    if (!colorA || !colorB) {
      return false
    }

    const l1 = this.hexToLuminance(colorA) /* higher value */
    const l2 = this.hexToLuminance(colorB) /* lower value */
    const contrastRatio = this.getContrastRatio(l1, l2)

    if (typeof customRatio !== 'undefined') {
      // Method does not exist
      // if (!this.isValidRatio(customRatio)) {
      //   return false
      // }
      return this.verifyCustomContrastRatio(contrastRatio, customRatio)
    } else {
      return this.verifyContrastRatio(contrastRatio)
    }
  }

  isLevelAA = (colorA: string, colorB: string, fontSize: number | undefined): boolean => {
    const result = this.check(colorA, colorB, fontSize || this.fontSize)
    if (typeof result === 'boolean') {
      return result
    } else {
      if (result instanceof WCAGResultClass) {
        return result.AA
      }
    }

    return false
  }

  isLevelAAA = (colorA: string, colorB: string, fontSize?: number): boolean => {
    const result = this.check(colorA, colorB, fontSize || this.fontSize)
    if (typeof result === 'boolean') {
      return result
    } else {
      if (result instanceof WCAGResultClass) {
        return result.AA
      }
    }

    return false
  }

  isLevelCustom = (colorA: string, colorB: string, ratio: number): boolean => {
    const result = this.check(colorA, colorB, this.fontSize, ratio)
    if (typeof result === 'boolean') {
      return result
    } else if (result instanceof CustomRadioResult) {
      return result.customRatio
    }

    return false
  }

  checkPairs = (pairs: Array<Pairs>, customRatio: number | undefined): Array<CheckReturn> => {
    let results: Array<CheckReturn> = []

    pairs.map(
      ({ colorA, colorB, fontSize }): CheckReturn => {
        if (typeof fontSize !== 'undefined') {
          return this.check(colorA, colorB, fontSize || this.fontSize, customRatio || undefined)
        } else {
          return this.check(colorA, colorB, 0, customRatio)
        }
      }
    )

    return results
  }
}
