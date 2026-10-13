import { GamePostDto } from "./game-post.dto";

export interface GamePostPageDto {
    items?: GamePostDto[];
    hasMore?: boolean;
}
