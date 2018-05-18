import { Component, Input } from '@angular/core';

type Entry =  {key: string, value: string | null, level: number};

@Component({
  selector: 'object-table',
  templateUrl: './object-table.component.html',
  styleUrls: ['./object-table.component.scss']
})
export class ObjectTableComponent {
  @Input() public object: object = {};

  private objectToEntries(
    obj: object,
    level: number = 0,
    res: Entry[] = []
  ): Entry[] {
    const keys = Object.keys(obj);
    keys.forEach(key => {
        const value = obj[key];
        if (typeof value === 'string') {
            res.push({key, value, level});
        } else if (
            typeof value === 'number' ||
            typeof value === 'boolean' ||
            value === null
        ) {
            const str = JSON.stringify(value);
            res.push({key, value: str, level});
        } else if (typeof value === 'object') {
            res.push({key, value: null, level});
            this.objectToEntries(value, level + 1, res);
        }
    });

    return res;
  }

  private getEntries(): Entry[] {
    return this.objectToEntries(this.object);
  }

  private styleForEntry(entry: Entry) {
    const keyStyle = entry.value === null
      ? {'font-style': 'italic'}
      : {};

    return {
      'padding-left': 2 * entry.level + 'em',
      ...keyStyle
    };
  }
}
