import { inject, Injectable } from '@angular/core';
import { injectQuery } from '@ngneat/query';
import { HttpClient } from '@angular/common/http';

export interface Tier {
    id: number;
    interval: string;
    userId: number;
}

@Injectable({
    providedIn: 'root',
})
export class TiersService {
    #query = injectQuery();
    #http = inject(HttpClient);

    getTiers() {
        return this.#query({
            queryKey: ['tiers'] as const,
            queryFn: () => {
                return this.#http.get<Tier[]>('/api/tiers');
            },
        }).result$;
    }
}
