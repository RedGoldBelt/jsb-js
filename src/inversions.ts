export type Inversion = 0 | 1 | 2 | 3;

export default class Inversions<T> {
  root;
  third;
  fifth;
  seventh;

  constructor(root: T, third: T, fifth: T, seventh: T | undefined) {
    this.root = root;
    this.third = third;
    this.fifth = fifth;
    this.seventh = seventh;
  }

  get(inversion: Inversion) {
    switch (inversion) {
      case 0:
        return this.root;
      case 1:
        return this.third;
      case 2:
        return this.fifth;
      case 3:
        return this.seventh as T;
    }
  }

  set(inversion: Inversion, value: T) {
    switch (inversion) {
      case 0:
        return (this.root = value);
      case 1:
        return (this.third = value);
      case 2:
        return (this.fifth = value);
      case 3:
        return (this.seventh = value);
    }
  }
}
