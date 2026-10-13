import { SearchScope } from "../stores/global-search.store";

export interface SearchCriteria {
    query: string;
    scope: SearchScope;
    idRegion: number | null;
}
