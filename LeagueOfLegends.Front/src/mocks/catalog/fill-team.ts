import { TeamMemberSeed } from "./team-member-seed";

export interface FillTeam {
    entitled: string;
    discriminator: string;
    tag: string;
    sentence: string;
    regionCode: string;
    creationDate: string;
    members: TeamMemberSeed[];
}
