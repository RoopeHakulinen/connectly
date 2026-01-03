import { inject, Injectable } from '@angular/core';
import { injectMutation, injectQuery, QueryClient } from '@ngneat/query';
import { HttpClient } from '@angular/common/http';
import { Tier } from './tiers/tiers.service';

export type TargetType = 'FRIEND' | 'TASK';

export interface Target {
  id: number;
  name: string;
  type: TargetType;
  notes: string;
  tier: Tier;
  activities: any[];
}

export interface CreateTargetDto {
  name: string;
  type: TargetType;
  notes: string;
  tierId: number;
}

export interface UpdateTargetDto extends Partial<CreateTargetDto> { }

@Injectable({
  providedIn: 'root',
})
export class TargetsService {
  #query = injectQuery();
  #mutation = injectMutation();
  #http = inject(HttpClient);
  #queryClient = inject(QueryClient);

  getTargets() {
    return this.#query({
      queryKey: ['targets'] as const,
      queryFn: () => {
        return this.#http.get<Target[]>('/api/targets');
      },
    }).result$;
  }

  createTarget() {
    return this.#mutation({
      mutationFn: (dto: CreateTargetDto) => {
        return this.#http.post<Target>('/api/targets', dto);
      },
      onSuccess: () => {
        this.#queryClient.invalidateQueries({ queryKey: ['targets'] });
        this.#queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      },
    });
  }

  updateTarget() {
    return this.#mutation({
      mutationFn: ({ id, dto }: { id: number; dto: UpdateTargetDto }) => {
        return this.#http.patch<Target>(`/api/targets/${id}`, dto);
      },
      onSuccess: () => {
        this.#queryClient.invalidateQueries({ queryKey: ['targets'] });
        this.#queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      },
    });
  }

  deleteTarget() {
    return this.#mutation({
      mutationFn: (id: number) => {
        return this.#http.delete(`/api/targets/${id}`);
      },
      onSuccess: () => {
        this.#queryClient.invalidateQueries({ queryKey: ['targets'] });
        this.#queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      },
    });
  }
}
