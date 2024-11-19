import { inject, Injectable } from '@angular/core';
import { injectQuery } from '@ngneat/query';
import { HttpClient } from '@angular/common/http';

export type TargetType = 'FRIEND' | 'TASK';

export interface Tier {
  priority: number;
}

export interface Target {
  name: string;
  type: TargetType;
  notes: string;
  tier: Tier;
}

@Injectable({
  providedIn: 'root',
})
export class TargetsService {
  #query = injectQuery();
  #http = inject(HttpClient);

  getTargets() {
    return this.#query({
      queryKey: ['targets'] as const,
      queryFn: () => {
        return this.#http.get<Target[]>('/api/targets');
      },
    }).result$;
  }
}
