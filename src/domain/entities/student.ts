import { Entity } from "@/core/entities/entity";
import { UniqueEntityId } from "@/core/entities/unique-entity-id";

interface Props {
  name: string;
}

export class Student extends Entity<Props> {
  get name() {
    return this.props.name;
  }

  static create(props: Props, id?: UniqueEntityId) {
    const student = new Student(
      {
        ...props,
      },
      id
    );
    return student;
  }
}
