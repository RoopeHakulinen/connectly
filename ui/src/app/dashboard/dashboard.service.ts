import { inject, Injectable } from '@angular/core';
import { injectQuery } from '@ngneat/query';
import { HttpClient } from '@angular/common/http';

export type TargetType = 'FRIEND' | 'TASK';

export interface UpcomingTarget {
  id: number;
  name: string;
  type: TargetType;
  notes: string;
  lastActivity: string | null;
  deadline: string;
  isOverdue: boolean;
  tier: {
    id: number;
    interval: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  #query = injectQuery();
  #http = inject(HttpClient);

  getUpcomingDeadlines() {
    return this.#query({
      queryKey: ['dashboard', 'upcoming'] as const,
      queryFn: () => {
        return this.#http.get<UpcomingTarget[]>('/api/dashboard/upcoming');
      },
    }).result$;
  }
}
