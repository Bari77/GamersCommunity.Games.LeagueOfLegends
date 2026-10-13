import { SearchScope } from "../stores/global-search.store";

export interface SearchCriteria {
    query: string;
    scope: SearchScope;
    idRegion: number | null;
    idLane: number | null;
    idMissingLane: number | null;
    minSoloTier: string | null;
    minMembers: number | null;
    openRoster: boolean;
    lookingForTeam: boolean;
}
