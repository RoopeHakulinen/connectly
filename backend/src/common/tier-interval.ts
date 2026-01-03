import { Frequency, Options as RRuleOptions, RRule } from 'rrule';

/**
 * Type-safe wrapper around RRule for handling recurring intervals in Tiers.
 * Provides a clean interface for defining how often users should contact their targets.
 */
export class TierInterval {
  private rule: RRule;

  private constructor(rule: RRule) {
    this.rule = rule;
  }

  /**
   * Create a TierInterval from an RRule string (stored in database)
   * @param ruleString - RRule string format (e.g., "FREQ=WEEKLY;INTERVAL=1")
   */
  static fromString(ruleString: string): TierInterval {
    const rule = RRule.fromString(ruleString);
    return new TierInterval(rule);
  }

  /**
   * Create a TierInterval from RRule options
   */
  static fromOptions(options: Partial<RRuleOptions>): TierInterval {
    const rule = new RRule(options);
    return new TierInterval(rule);
  }

  /**
   * Create a TierInterval from an RRule instance
   */
  static fromRRule(rule: RRule): TierInterval {
    return new TierInterval(rule);
  }

  // ========== Common Interval Factories ==========

  /**
   * Create a "once a week" interval
   */
  static weekly(interval: number = 1): TierInterval {
    return TierInterval.fromOptions({
      freq: Frequency.WEEKLY,
      interval,
    });
  }

  /**
   * Create a "once every N days" interval
   */
  static daily(interval: number = 1): TierInterval {
    return TierInterval.fromOptions({
      freq: Frequency.DAILY,
      interval,
    });
  }

  /**
   * Create a "once a month" interval
   */
  static monthly(interval: number = 1): TierInterval {
    return TierInterval.fromOptions({
      freq: Frequency.MONTHLY,
      interval,
    });
  }

  /**
   * Create a "once every N months on the last day" interval
   */
  static lastDayOfMonth(interval: number = 1): TierInterval {
    return TierInterval.fromOptions({
      freq: Frequency.MONTHLY,
      interval,
      bymonthday: -1,
    });
  }

  /**
   * Create a "once a year" interval
   */
  static yearly(interval: number = 1): TierInterval {
    return TierInterval.fromOptions({
      freq: Frequency.YEARLY,
      interval,
    });
  }

  /**
   * Create a bi-weekly (every 2 weeks) interval
   */
  static biweekly(): TierInterval {
    return TierInterval.weekly(2);
  }

  /**
   * Create a quarterly (every 3 months) interval
   */
  static quarterly(): TierInterval {
    return TierInterval.monthly(3);
  }

  // ========== Instance Methods ==========

  /**
   * Convert to RRule string format for database storage
   */
  toString(): string {
    return this.rule.toString();
  }

  /**
   * Get human-readable description
   * @example "every week", "every month", "every 2 weeks"
   */
  toText(): string {
    return this.rule.toText();
  }

  /**
   * Get the next occurrence after a given date
   * @param after - The date to calculate from (defaults to now)
   * @returns The next occurrence date, or null if there are no more occurrences
   */
  getNextOccurrence(after: Date = new Date()): Date | null {
    return this.rule.after(after);
  }

  /**
   * Get all occurrences between two dates
   * @param start - Start date
   * @param end - End date
   * @returns Array of occurrence dates
   */
  getOccurrencesBetween(start: Date, end: Date): Date[] {
    return this.rule.between(start, end);
  }

  /**
   * Check if a target is overdue based on last activity
   * @param lastActivity - Date of last activity with the target
   * @returns true if the next contact date has passed
   */
  isOverdue(lastActivity: Date): boolean {
    const nextDue = this.getNextOccurrence(lastActivity);
    return nextDue ? new Date() > nextDue : false;
  }

  /**
   * Get the next due date based on last activity
   * @param lastActivity - Date of last activity with the target
   * @returns The next due date, or null if cannot be calculated
   */
  getNextDueDate(lastActivity: Date): Date | null {
    return this.getNextOccurrence(lastActivity);
  }

  /**
   * Calculate days until next contact is due
   * @param lastActivity - Date of last activity with the target
   * @returns Number of days (negative if overdue), or null if cannot be calculated
   */
  getDaysUntilDue(lastActivity: Date): number | null {
    const nextDue = this.getNextDueDate(lastActivity);
    if (!nextDue) return null;

    const now = new Date();
    const diffMs = nextDue.getTime() - now.getTime();
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  }
}

/**
 * Type definition for Tier with properly typed interval
 */
export interface TierWithInterval {
  id: number;
  interval: TierInterval;
  userId: number;
}

/**
 * Helper to convert Prisma Tier to TierWithInterval
 */
export function parseTierInterval(tier: {
  id: number;
  interval: string;
  userId: number;
}): TierWithInterval {
  return {
    ...tier,
    interval: TierInterval.fromString(tier.interval),
  };
}

/**
 * Predefined common intervals for easy reference
 */
export const CommonIntervals = {
  DAILY: TierInterval.daily(),
  EVERY_TWO_DAYS: TierInterval.daily(2),
  EVERY_THREE_DAYS: TierInterval.daily(3),
  WEEKLY: TierInterval.weekly(),
  BIWEEKLY: TierInterval.biweekly(),
  MONTHLY: TierInterval.monthly(),
  QUARTERLY: TierInterval.quarterly(),
  YEARLY: TierInterval.yearly(),
  LAST_DAY_OF_MONTH: TierInterval.lastDayOfMonth(),
} as const;
