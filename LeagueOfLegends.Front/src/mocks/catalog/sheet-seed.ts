import { PlayerSheetDto } from "@features/players/dto/player-sheet.dto";

export interface SheetSeed {
    who: string;
    presentationIrl: string;
    presentationIg: string;
    region: { id: number; code: string };
    primaryLane: { id: number; code: string };
    secondaryLanes: { id: number; code: string }[];
    solo: NonNullable<PlayerSheetDto["solo"]>;
    flex: NonNullable<PlayerSheetDto["flex"]>;
    champions: NonNullable<PlayerSheetDto["champions"]>;
    creationDate: string;
}
