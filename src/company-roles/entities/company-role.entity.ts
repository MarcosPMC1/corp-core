import { Company } from "src/company/entities/company.entity";
import { CompanyRole } from "src/enums/company-role.enum";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("company_role")
export class CompanyRoles {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column({ type: "varchar", length: 255 })
    user_id: string;

    @Column({ type: "uuid" })
    company_id: string;

    @Column({ type: 'enum', enum: CompanyRole, default: CompanyRole.Employee })
    role: CompanyRole

    @ManyToOne(() => Company, (company) => company.companyRoles)
    @JoinColumn({ name: "company_id" })
    company: Company;
}
