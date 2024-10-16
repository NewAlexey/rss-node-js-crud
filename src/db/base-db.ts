export class BaseDataBase<D extends { id: string }> {
  private readonly db: Map<string, D> = new Map();

  public get(id: string): D | undefined {
    return this.db.get(id);
  }

  public getAll(): D[] {
    return [...this.db.values()];
  }

  public remove(id: string): string {
    this.db.delete(id);

    return id;
  }

  public add(entity: D): D {
    this.db.set(entity.id, entity);

    return entity;
  }
}
