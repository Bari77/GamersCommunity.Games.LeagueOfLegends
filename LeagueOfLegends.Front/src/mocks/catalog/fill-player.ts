import { SheetSeed } from "./sheet-seed";

/** Generated summoner: persona identity plus the sheet it plays with. */
export interface FillPlayer extends SheetSeed {
    discriminator: string;
    gameName: string;
    tagLine: string;
}
