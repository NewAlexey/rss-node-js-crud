import { generateUUID } from "../utils/generateUUID";

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

  public add(dto: Omit<D, "id">): D {
    const entity = { ...dto, id: generateUUID() } as D;

    this.db.set(entity.id, entity);

    return entity;
  }
}
