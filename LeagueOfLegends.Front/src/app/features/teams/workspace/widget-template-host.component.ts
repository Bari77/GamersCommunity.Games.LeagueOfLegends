import { Component, computed, input, output } from "@angular/core";
import {
    GcGalleryItem,
    LinkListComponent,
    MediaGalleryComponent,
    WidgetDefDirective,
    WidgetSettings,
} from "@bari77/gc-widgets";
import { CatalogItem } from "@features/players/models/player.model";
import { PlayerPresentationComponent } from "@features/players/components/player-presentation/player-presentation.component";
import {
    TeamApplicationDraft,
    TeamApplyFormComponent,
} from "@features/teams/components/team-apply-form/team-apply-form.component";
import { TeamApplicationsComponent } from "@features/teams/components/team-applications/team-applications.component";
import { TeamLinkAdminComponent } from "@features/teams/components/team-link-admin/team-link-admin.component";
import { TeamLinkBoardComponent } from "@features/teams/components/team-link-board/team-link-board.component";
import { TeamRankChange, TeamRosterChange } from "@features/teams/components/team-roster/team-roster.component";
import { TeamRosterComponent } from "@features/teams/components/team-roster/team-roster.component";
import { TeamStatsComponent } from "@features/teams/components/team-stats/team-stats.component";
import { TeamWallComponent } from "@features/teams/components/team-wall/team-wall.component";
import { TeamUpdateRequestDto } from "@features/teams/dto/team.dto";
import { TeamSheet } from "@features/teams/models/team.model";
import {
    WORKSPACE_PREVIEW_TEAM,
    WORKSPACE_PREVIEW_TEAM_LINKS,
    WORKSPACE_PREVIEW_TEAM_MEMBERS,
    WORKSPACE_PREVIEW_TEAM_PHOTOS,
    WORKSPACE_PREVIEW_TEAM_VIDEOS,
} from "@features/teams/workspace/preview-team";
import { CreateSheetWallComponent } from "@shared/components/create-sheet-wall/create-sheet-wall.component";

@Component({
    standalone: true,
    selector: "lol-team-widget-template-host",
    imports: [
        CreateSheetWallComponent,
        LinkListComponent,
        MediaGalleryComponent,
        PlayerPresentationComponent,
        TeamApplyFormComponent,
        TeamApplicationsComponent,
        TeamLinkAdminComponent,
        TeamLinkBoardComponent,
        TeamRosterComponent,
        TeamStatsComponent,
        TeamWallComponent,
        WidgetDefDirective,
    ],
    templateUrl: "./widget-template-host.component.html",
    styleUrl: "./widget-template-host.component.scss",
})
export class LolTeamWidgetTemplateHostComponent {
    public readonly preview = input(false);
    public readonly team = input<TeamSheet | null>(null);
    public readonly editing = input(false);
    public readonly savingField = input(false);
    public readonly errorCode = input<string | null>(null);
    public readonly playerPublicId = input<string | null>(null);
    public readonly busy = input(false);
    public readonly lanes = input<CatalogItem[]>([]);
    public readonly applyLoading = input(false);
    public readonly applySaving = input(false);
    public readonly applyErrorCode = input<string | null>(null);
    public readonly needsSheet = input(false);

    public readonly setRank = output<TeamRankChange>();
    public readonly setRoster = output<TeamRosterChange>();
    public readonly kick = output<string>();
    public readonly transfer = output<string>();
    public readonly leave = output<string>();
    public readonly apply = output<TeamApplicationDraft>();
    public readonly withdraw = output<void>();
    public readonly rosterChanged = output<void>();
    public readonly saveField = output<TeamUpdateRequestDto>();

    protected readonly view = computed(() => (this.preview() ? WORKSPACE_PREVIEW_TEAM : this.team()!));
    protected readonly emptyGalleryLabel = $localize`:@@lol.team.widget.media.empty:Nothing here yet.`;
    protected readonly noSentenceLabel = $localize`:@@lol.team.noSentence:This team has not written a presentation yet.`;
    protected readonly mediaAddLabel = $localize`:@@lol.team.widget.media.add:Add a media`;
    protected readonly mediaSaveLabel = $localize`:@@lol.team.admin.save:Save`;
    protected readonly mediaCancelLabel = $localize`:@@lol.team.form.cancel:Cancel`;
    protected readonly mediaTitleLabel = $localize`:@@lol.team.widget.media.title:Caption`;
    protected readonly mediaUrlPlaceholder = "https://…";
    protected readonly sheetWallMessage = $localize`:@@lol.team.sheet.sheetWall:Create your player profile to apply to this team.`;
    protected readonly previewMembers = WORKSPACE_PREVIEW_TEAM_MEMBERS;
    protected readonly previewViewerRank = WORKSPACE_PREVIEW_TEAM.viewerRank;
    protected readonly previewLinks = WORKSPACE_PREVIEW_TEAM_LINKS;
    protected readonly previewLinksEmpty = $localize`:@@lol.links.empty:No link shared yet.`;
    protected readonly previewPhotos = WORKSPACE_PREVIEW_TEAM_PHOTOS;
    protected readonly previewVideos = WORKSPACE_PREVIEW_TEAM_VIDEOS;

    /** Managers and the captain edit widget data; rearranging the page is a mode of its own. */
    protected readonly canEditFields = computed(
        () => !this.editing() && !this.preview() && this.view().canEditSheet(),
    );

    protected galleryItems(settings: WidgetSettings): GcGalleryItem[] {
        return this.readGallery(settings, this.previewPhotos);
    }

    protected videoItems(settings: WidgetSettings): GcGalleryItem[] {
        return this.readGallery(settings, this.previewVideos);
    }

    protected saveGallery(
        settings: WidgetSettings,
        updateSettings: ((next: WidgetSettings) => void) | undefined,
        stopDataEdit: (() => void) | undefined,
        items: GcGalleryItem[],
    ): void {
        updateSettings?.({ ...settings, items });
        stopDataEdit?.();
    }

    private readGallery(settings: WidgetSettings, fallback: GcGalleryItem[]): GcGalleryItem[] {
        const items = settings["items"];
        if (!Array.isArray(items)) {
            return this.preview() ? fallback : [];
        }

        const configured = items
            .map((item) => item as { url?: unknown; title?: unknown })
            .filter((item) => typeof item.url === "string" && item.url.trim().length > 0)
            .map((item) => ({
                url: (item.url as string).trim(),
                title: typeof item.title === "string" ? item.title : null,
            }));

        return configured.length > 0 ? configured : this.preview() ? fallback : [];
    }
}
