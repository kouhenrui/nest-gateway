import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('account') // 表名为 'account'
export class Account {
  @PrimaryGeneratedColumn()
  id: number; // 主键自增

  @Column({ type: 'varchar', length: 255 })
  user_name: string; // 用户名

  @Column({ type: 'varchar', length: 255 })
  salt: string; // 密码盐
  @Column({ type: 'varchar', length: 255 })
  password: string; // 密码

  @Column({ type: 'varchar', length: 20 })
  role: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string; // 邮箱

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string; // 头像
  @Column({ type: 'varchar', length: 255, nullable: true })
  nick_name: string; // 昵称

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string; // 手机号码（可选）

  @Column({ type: 'varchar', length: 255, nullable: true })
  access_token: string; // 访问令牌

  @Column({ type: 'enum', enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' })
  status: string; // 用户状态（可以是枚举）

  @CreateDateColumn()
  created_at: Date; // 创建时间

  @UpdateDateColumn()
  updated_at: Date; // 更新时间

  @DeleteDateColumn()
  deleted_at: Date; // 删除时间
}
