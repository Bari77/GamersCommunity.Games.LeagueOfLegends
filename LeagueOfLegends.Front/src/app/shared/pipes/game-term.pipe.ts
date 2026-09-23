import { Pipe, PipeTransform } from "@angular/core";

const CATALOG_LABELS: Record<string, string> = {
    euw: "EU West",
    eune: "EU Nordic & East",
    na: "North America",
    kr: "Korea",
    aurelionsol: "Aurelion Sol",
    belveth: "Bel'Veth",
    chogath: "Cho'Gath",
    drmundo: "Dr. Mundo",
    jarvaniv: "Jarvan IV",
    kaisa: "Kai'Sa",
    khazix: "Kha'Zix",
    kogmaw: "Kog'Maw",
    ksante: "K'Sante",
    leblanc: "LeBlanc",
    leesin: "Lee Sin",
    masteryi: "Master Yi",
    missfortune: "Miss Fortune",
    monkeyking: "Wukong",
    nunu: "Nunu & Willump",
    reksai: "Rek'Sai",
    renata: "Renata Glasc",
    tahmkench: "Tahm Kench",
    twistedfate: "Twisted Fate",
    velkoz: "Vel'Koz",
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
