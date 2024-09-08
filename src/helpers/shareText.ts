export const WORMLE_LINK = "https://wormle.com"

export function getShareText(numberOfMoves: number, numberOfSeconds: number, numberOfHints: number, date: string){
    const dateObj = new Date(date);
    return(`🪱 ${dateObj.toLocaleDateString()} 🪱\n🧠 ${numberOfMoves} moves 🧠\n⏰ ${numberOfSeconds} seconds ⏰\n🔎 ${numberOfHints} hint${numberOfHints != 1 ? "s" : ""} 🔎\n${WORMLE_LINK}`)
}