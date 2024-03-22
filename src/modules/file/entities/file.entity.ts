import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity('file')
export class File {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    url: string;
    
    @Column()
    key: string;
}
