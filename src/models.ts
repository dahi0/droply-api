import { v7 } from "uuid";
import { nanoid } from "nanoid";
import { Entity, Field, Id, ManyToOne, OneToMany } from "uql-orm";

@Entity({ name: "users" })
export class User {
  @Id({
    type: "uuid",
    unique: true,
    nullable: false,
    onInsert: () => v7(),
  })
  id!: string;
  @Field({
    type: String,
    nullable: false,
  })
  name!: string;
  @Field({
    type: String,
    unique: true,
    nullable: false,
  })
  email!: string;
  @Field({
    type: String,
    nullable: false,
  })
  passwordHash!: string;
  @OneToMany({
    entity: () => UFile,
    mappedBy: (file) => file.owner,
  })
  files?: UFile[];
}

@Entity({ name: "files" })
export class UFile {
  @Id({
    type: String,
    unique: true,
    nullable: false,
    onInsert: () => nanoid(),
  })
  id!: string;
  @Field({
    type: String,
    nullable: false,
  })
  filename!: string;
  /* @Field({
     type: String,
     unique: true,
     nullable: false,
  })
  url!: string; */
  @Field({
    type: Number,
  })
  size!: number;
  @Field({ type: String })
  ownerId!: string;
  @ManyToOne({
    entity: () => User,
    cascade: true,
  })
  owner?: User;
}
