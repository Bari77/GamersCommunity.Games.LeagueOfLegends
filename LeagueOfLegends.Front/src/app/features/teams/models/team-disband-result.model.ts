import { TeamDisbandResultDto } from "@features/teams/dto/team-disband-result.dto";

export class TeamDisbandResult {
    public constructor(
        public publicId: string,
        public handle: string,
    ) {}

    public static fromDto(dto: TeamDisbandResultDto): TeamDisbandResult {
        return new TeamDisbandResult(dto.publicId, dto.handle);
    }
}
