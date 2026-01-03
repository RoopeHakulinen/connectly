import { inject, Injectable } from '@angular/core';
import { injectMutation, injectQuery, injectQueryClient } from '@ngneat/query';
import { HttpClient } from '@angular/common/http';

export interface Tier {
    id: number;
  name: string;
    interval: string;
    userId: number;
}

export interface CreateTierDto {
  name: string;
  interval: string;
}

export interface UpdateTierDto extends Partial<CreateTierDto> {
}

@Injectable({
    providedIn: 'root',
})
export class TiersService {
    #query = injectQuery();
  #mutation = injectMutation();
  #queryClient = injectQueryClient();
    #http = inject(HttpClient);

    getTiers() {
        return this.#query({
            queryKey: ['tiers'] as const,
            queryFn: () => {
                return this.#http.get<Tier[]>('/api/tiers');
            },
        }).result$;
    }

  createTier() {
    return this.#mutation({
      mutationFn: (dto: CreateTierDto) => {
        return this.#http.post<Tier>('/api/tiers', dto);
      },
      onSuccess: () => {
        this.#queryClient.invalidateQueries({ queryKey: ['tiers'] });
      },
    });
  }

  updateTier() {
    return this.#mutation({
      mutationFn: ({ id, dto }: { id: number; dto: UpdateTierDto }) => {
        return this.#http.patch<Tier>(`/api/tiers/${id}`, dto);
      },
      onSuccess: () => {
        this.#queryClient.invalidateQueries({ queryKey: ['tiers'] });
      },
    });
  }

  deleteTier() {
    return this.#mutation({
      mutationFn: (id: number) => {
        return this.#http.delete(`/api/tiers/${id}`);
      },
      onSuccess: () => {
        this.#queryClient.invalidateQueries({ queryKey: ['tiers'] });
      },
    });
  }
}
