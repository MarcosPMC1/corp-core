import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("company")
export class Company {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "varchar", length: 255 })
    name: string;

    @Column({ type: "varchar", length: 255 })
    address: string;

    @Column({ type: "varchar", length: 255 })
    phone: string;

    @Column({ type: "varchar", length: 255 })
    email: string;

    @Column({ type: "varchar", length: 255 })
    website: string;

    @Column({ type: "varchar", length: 255 })
    logo: string;

    @Column({ type: "varchar", length: 255 })
    description: string;
    
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    createdAt: Date;

    @DeleteDateColumn({ type: "timestamp" })
    deletedAt: Date;

    @OneToMany(() => Company, (company) => company.companyOwners, { cascade: true })
    companyOwners: Company[];

}
