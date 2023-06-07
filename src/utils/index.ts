// WMOの天気コードをテキストに変換します
// see: https://open-meteo.com/en/docs
export const convertWeathercodetoText = (weathercode: number) => {
  switch (weathercode) {
    case 0:
      return "晴れ"
    case 1:
    case 2:
    case 3:
      return "晴れ時々曇り"
    case 45:
    case 48:
      return "霧"
    case 51:
    case 53:
    case 55:
      return "霧雨"
    case 56:
    case 57:
      return "雨氷"
    case 61:
    case 63:
    case 65:
      return "雨"
    case 66:
    case 67:
      return "雨氷"
    case 71:
    case 73:
    case 75:
      return "雪"
    case 77:
      return "霧雪"
    case 80:
    case 81:
    case 82:
      return "豪雨"
    case 85:
    case 86:
      return "豪雪"
    case 95:
    case 96:
    case 99:
      return "雷雨"
    default:
      return "-"
  }
}

