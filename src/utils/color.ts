import { type radixUiColor } from "~/types/color"

const COLORS = ["gray", "gold", "bronze", "brown", "yellow", "amber", "orange", "tomato", "red", "ruby", "crimson", "pink", "plum", "purple", "violet", "iris", "indigo", "blue", "cyan", "teal", "jade", "green", "grass", "lime", "mint", "sky"]

export default function getRandomRadixColor(): radixUiColor {
    return COLORS[Math.floor(Math.random() * COLORS.length)] as radixUiColor
}
