import { RRule } from 'rrule';

export class RecurrenceService {
  static parseRRule(rruleString: string): RRule {
    return RRule.fromString(rruleString);
  }

  static getNextOccurrences(rrule: RRule, count = 5): Date[] {
    return rrule.all((_, len) => len < count);
  }

  static formatRecurrence(rrule: RRule): string {
    const options = rrule.options;
    const freq = options.freq;
    const interval = options.interval || 1;

    let base = '';
    switch (freq) {
      case RRule.DAILY:
        base = interval === 1 ? 'Daily' : `Every ${interval} days`;
        break;
      case RRule.WEEKLY:
        base = interval === 1 ? 'Weekly' : `Every ${interval} weeks`;
        if (options.byweekday?.length) {
          base += ` on ${options.byweekday
            .map(day => RRule.WEEKDAY_NAMES[day])
            .join(', ')}`;
        }
        break;
      case RRule.MONTHLY:
        base = interval === 1 ? 'Monthly' : `Every ${interval} months`;
        if (options.bymonthday) {
          base += ` on day ${options.bymonthday}`;
        }
        break;
      case RRule.YEARLY:
        base = interval === 1 ? 'Yearly' : `Every ${interval} years`;
        break;
    }

    if (options.count) {
      base += `, ${options.count} times`;
    } else if (options.until) {
      base += `, until ${options.until.toLocaleDateString()}`;
    }

    return base;
  }
}