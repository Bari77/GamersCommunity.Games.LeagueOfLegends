export interface GamePostModerateRequestDto {
    publicId: string;
    approve: boolean;
    reason?: string | null;
}
