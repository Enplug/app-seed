import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { TranslocoService } from '@jsverse/transloco';
import { EnplugService } from './enplug.service';
import { PaginationResponse, PaginationConfig, ReorderAssets } from '../models/pagination';
import { initialPagination } from '../models/initial-values';
import { environment } from '../../environments/environment';

const TAG_INACTIVE = 'tag-inactive';
const TAG_PRIORITY_PLAY = 'tag-priority-play';

@Injectable({
  providedIn: 'root',
})
export class AssetService {
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  private assetsSubject = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private tagsSubject = new BehaviorSubject<string[]>([]);
  private selectedSpecialTagsSubject = new BehaviorSubject<string[]>([]);
  private paginationSubject = new BehaviorSubject<PaginationResponse>({
    CurrentPage: initialPagination.CurrentPage,
    Limit: initialPagination.Limit,
    TotalPages: initialPagination.TotalPages,
    TotalItems: initialPagination.TotalItems,
  });

  assets$ = this.assetsSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  tags$ = this.tagsSubject.asObservable();
  selectedSpecialTags$ = this.selectedSpecialTagsSubject.asObservable();
  pagination$ = this.paginationSubject.asObservable();

  paginationParams: PaginationConfig = {
    limit: initialPagination.Limit,
    page: initialPagination.CurrentPage,
    enableNewPagination: environment.newPagination,
  };

  constructor(
    private enplug: EnplugService,
    private zone: NgZone,
    private transloco: TranslocoService
  ) {
    this.searchSubject
      .pipe(debounceTime(600), takeUntil(this.destroy$))
      .subscribe((search) => this.handleSearch(search));
  }

  async loadAssetsPagination(
    params?: PaginationConfig
  ): Promise<{ assets: any[]; pagination: PaginationResponse; tags: string[] }> {
    const mergedParams = { ...this.paginationParams, ...params };
    const initialTags = mergedParams?.tags || '';
    const { cleanedTags, specialTags, hasTagInactive, hasPriorityPlay } =
      this.handleSpecialTags(initialTags);

    const options: PaginationConfig = {
      page: mergedParams?.page ?? 1,
      enableNewPagination: environment.newPagination,
      limit: mergedParams?.limit ?? 25,
      name: mergedParams?.name ?? undefined,
      tags: cleanedTags ?? undefined,
      isInactive: hasTagInactive ?? false,
      isPriority: hasPriorityPlay ?? false,
    };

    this.loadingSubject.next(true);

    try {
      const response = await this.enplug.account.getAssetsPagination(options);

      this.zone.run(() => {
        this.assetsSubject.next(response.Assets || []);
      });

      this.paginationSubject.next(response.Pagination);
      this.selectedSpecialTagsSubject.next(specialTags);
      this.tagsSubject.next(response.Tags || []);

      return {
        assets: response.Assets || [],
        pagination: response.Pagination,
        tags: response.Tags || [],
      };
    } finally {
      this.loadingSubject.next(false);
    }
  }

  async saveOrderPagination(data: ReorderAssets): Promise<void> {
    this.enplug.dashboard.loadingIndicator(
      this.transloco.translate('assetList.mySigns.reorderAssets.inProgress')
    );

    try {
      await this.enplug.account.reorderAssets(data);
      this.enplug.dashboard.successIndicator(
        this.transloco.translate('assetList.mySigns.reorderAssets.success')
      );
    } catch (err) {
      this.enplug.dashboard.errorIndicator(
        this.transloco.translate('assetList.mySigns.reorderAssets.failed')
      );
      console.error(err);
    }
  }

  paginationChange(event: { page: number; limit: number }): void {
    this.paginationParams = { ...this.paginationParams, ...event };
    this.loadAssetsPagination();
  }

  searchExternalTags(search: string): void {
    this.searchSubject.next(search);
  }

  clearFilters(): void {
    this.paginationParams = {
      ...this.paginationParams,
      tags: '',
      name: '',
    };
    this.loadAssetsPagination();
  }

  private handleSearch(search: string): void {
    if (this.paginationParams.enableNewPagination && search) {
      try {
        const params = JSON.parse(search);
        const tags = params.filters?.tags?.length ? params.filters.tags.join(',') : '';
        const name = params.filters?.value || '';
        this.paginationParams = { ...this.paginationParams, tags, name, page: 1 };
        this.loadAssetsPagination();
      } catch (e) {
        console.error('Error parsing search params:', e);
      }
    }
  }

  private handleSpecialTags(tags: string): {
    cleanedTags: string;
    specialTags: string[];
    hasTagInactive: boolean;
    hasPriorityPlay: boolean;
  } {
    const specialTags: string[] = [];
    let hasTagInactive = false;
    let hasPriorityPlay = false;

    let cleanedTagsArray = tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (cleanedTagsArray.includes(TAG_INACTIVE)) {
      specialTags.push(TAG_INACTIVE);
      hasTagInactive = true;
      cleanedTagsArray = cleanedTagsArray.filter((tag) => tag !== TAG_INACTIVE);
    }

    if (cleanedTagsArray.includes(TAG_PRIORITY_PLAY)) {
      specialTags.push(TAG_PRIORITY_PLAY);
      hasPriorityPlay = true;
      cleanedTagsArray = cleanedTagsArray.filter((tag) => tag !== TAG_PRIORITY_PLAY);
    }

    return {
      cleanedTags: cleanedTagsArray.join(','),
      specialTags,
      hasTagInactive,
      hasPriorityPlay,
    };
  }

  async updateAssetName(asset: any, newName: string): Promise<void> {
    if (newName !== asset.Value?.name) {
      asset.Value.name = newName.trim();
      await this.enplug.account.saveAsset(asset);
      await this.loadAssetsPagination();
    }
  }

  async deleteAsset(assetId: string): Promise<void> {
    await this.enplug.account.deleteAsset(assetId);
  }

  async deleteAssets(assetIds: string[]): Promise<void> {
    await this.enplug.account.deleteAsset(assetIds);
  }

  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }
}
