import { Pipe, PipeTransform } from "@angular/core";

const CATALOG_LABELS: Record<string, string> = {
    euw: "EU West",
    eune: "EU Nordic & East",
    na: "North America",
    kr: "Korea",
    jarvaniv: "Jarvan IV",
    kaisa: "Kai'Sa",
    khazix: "Kha'Zix",
    leblanc: "LeBlanc",
    leesin: "Lee Sin",
    missfortune: "Miss Fortune",
    xinzhao: "Xin Zhao",
    grandmaster: "Grandmaster",
    "4": "IV",
    "3": "III",
    "2": "II",
    "1": "I",
};

export function gameTerm(value: string | null | undefined): string {
    if (!value) {
        return "";
    }

    const label = CATALOG_LABELS[value];
    if (label) {
        return label;
    }

    const words = value.split("_").filter(Boolean);
    return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

@Pipe({ name: "gameTerm", standalone: true })
export class GameTermPipe implements PipeTransform {
    public transform(value: string | null | undefined): string {
        return gameTerm(value);
    }
}
