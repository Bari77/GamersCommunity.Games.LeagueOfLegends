import { TeamLeaveResultDto } from "@features/teams/dto/team-leave-result.dto";

export class TeamLeaveResult {
    public constructor(public teamPublicId: string) {}

    public static fromDto(dto: TeamLeaveResultDto): TeamLeaveResult {
        return new TeamLeaveResult(dto.teamPublicId);
    }
}
