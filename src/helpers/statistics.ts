//Local storage keys
const STREAK_KEY = "streak"
const LONGEST_STREAK_KEY = "longestStreak"
const LAST_GAME_DATE_KEY = "lastGameDate"
const GAMES_PLAYED_KEY = "gamesPlayed"

export function updateGameFinishedOnDate(gameDate: string){
    const lastFinishedDay = getLastDayPlayed();

    if(lastFinishedDay === gameDate){
        return;
    }

    const oldStreak = getNumberFromLocalStorage(STREAK_KEY);
    const oldLongestStreak = getNumberFromLocalStorage(LONGEST_STREAK_KEY);

    const yesterdaysDate = getPreviousDay(gameDate);
    if(yesterdaysDate === lastFinishedDay){
        const newStreak = oldStreak + 1;
        localStorage.setItem(STREAK_KEY, newStreak.toString())

        if(oldLongestStreak < newStreak){
            localStorage.setItem(LONGEST_STREAK_KEY, newStreak.toString());
        }

    } else {
        const newStreak = 1;
        localStorage.setItem(STREAK_KEY, newStreak.toString());

        if(oldLongestStreak < newStreak){
            localStorage.setItem(LONGEST_STREAK_KEY, newStreak.toString());
        }
    }

    localStorage.setItem(LAST_GAME_DATE_KEY, gameDate);

    const gamesPlayed = getNumberFromLocalStorage(GAMES_PLAYED_KEY);
    const newGamesPlayed = gamesPlayed + 1
    localStorage.setItem(GAMES_PLAYED_KEY, newGamesPlayed.toString())

    return;
}

function getNumberFromLocalStorage(key:string){
    const string = localStorage.getItem(key);

    if(string === null){
        return 0;
    }

    const number = parseInt(string)

    if(Number.isNaN(number)){
        return 0;
    }

    return number;
}

export function getLastDayPlayed(): string|null {
    return localStorage.getItem(LAST_GAME_DATE_KEY);
}

export function getPlayerStreakStatistics():PlayerStreakStatistics{
    return {
        currentStreak: getNumberFromLocalStorage(STREAK_KEY),
        longestStreak: getNumberFromLocalStorage(LONGEST_STREAK_KEY),
        gamesPlayed: getNumberFromLocalStorage(GAMES_PLAYED_KEY)
    }
}

function getPreviousDay(dateString: string): string {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        throw new Error("Invalid date string");
    }

    date.setDate(date.getDate() - 1);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

type PlayerStreakStatistics = {
    currentStreak: number,
    longestStreak: number,
    gamesPlayed: number,
}