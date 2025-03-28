import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Enforcer, newEnforcer } from 'casbin';
import path from 'path';
import TypeORMAdapter from 'typeorm-adapter';
@Injectable()
export class CasbinAuthService {
  private enforcer: Enforcer;
  constructor(
    private readonly configService: ConfigService, // Use configService to access your environment/config
  ) {}

  async init(): Promise<void> {
    try {
      // Fetch the necessary configuration from your environment or config service
      const host = this.configService.get<string>('CASBIN_HOST');
      const port = this.configService.get<number>('CASBIN_DATABASE_PORT');
      const username = this.configService.get<string>(
        'CASBIN_DATABASE_USERNAME',
      );
      const password = this.configService.get<string>(
        'CASBIN_DATABASE_PASSWORD',
      );
      const database = this.configService.get<string>('CASBIN_DATABASE_NAME');

      // Check if required configurations are present
      if (!host || !port || !username || !password) {
        throw new Error('Missing necessary database configuration');
      }

      // Set up the adapter for Casbin with TypeORM
      const adapter = await TypeORMAdapter.newAdapter({
        type: 'mysql',
        host: host,
        port: port,
        username: username,
        password: password,
        database: database,
      });

      // Create a new Casbin Enforcer with the model and adapter
      this.enforcer = await newEnforcer(
        path.resolve(__dirname, '../../../rbac.model.conf'),
        adapter,
      );

      // Load existing policies from the database
      // 添加一些权限数据
      await this.enforcer.addPolicy('alice', '/data/resource1', 'read'); // Alice can read resource1
      await this.enforcer.addPolicy('bob', '/data/resource2', 'write'); // Bob can write resource2
      await this.enforcer.addPolicy('alice', '/data/resource2', 'write'); // Alice can also write resource2
      await this.enforcer.loadPolicy();
      console.log('Casbin policies loaded successfully.');
    } catch (error) {
      console.error('Error initializing Casbin:', error);
    }
  } /**
   * @description 验证权限是否存在
   * @author khr
   * @Date:
   * @return:
   */
  async enforce(sub: string, obj: string, act: string): Promise<boolean> {
    return await this.enforcer.enforce(sub, obj, act);
  }

  /**
   * @description 增加权限
   * @author khr
   * @Date:
   * @return:
   */
  async addPolicy(sub: string, obj: string, act: string): Promise<void> {
    await this.enforcer.addPolicy(sub, obj, act);
    await this.enforcer.savePolicy();
  }

  /**
   * @description 删除权限
   * @author khr
   * @Date:
   * @return:
   */
  async removePolicy(sub: string, obj: string, act: string): Promise<void> {
    await this.enforcer.removePolicy(sub, obj, act);
    await this.enforcer.savePolicy();
  }

  /**
   * @description 增加权限
   * @author khr
   * @Date:
   * @return:
   */
  async addRole(role: string, permission: string): Promise<void> {
    await this.enforcer.addPolicy(role, permission);
    await this.enforcer.savePolicy();
  }

  /**
   * @description 删除角色
   * @author khr
   * @Date:
   * @return:
   */
  async removeRole(role: string, permission: string): Promise<void> {
    await this.enforcer.removePolicy(role, permission);
    await this.enforcer.savePolicy();
  }

  /**
   * @description 修改角色
   * @author khr
   * @Date:
   * @return:
   */
  async updateRole(oldRole: string, newRole: string): Promise<void> {
    const rolePolicies = await this.enforcer.getFilteredPolicy(0, oldRole);
    for (const policy of rolePolicies) {
      await this.enforcer.removePolicy(...policy);
      await this.enforcer.addPolicy(newRole, ...policy.slice(1));
    }
    await this.enforcer.savePolicy();
  }

  /**
   * @description GetRolesForUser 获取用户具有的角色
   * @author khr
   * @Date:
   * @return:
   */
  async getRolesForUser(policy: string) {
    return await this.enforcer.getRolesForUser(policy);
  }

  /**
   * @description GetUsersForRole 获取具有角色的用户
   * @author khr
   * @Date:
   * @return:
   */
  async getUserForRole(user: string) {
    await this.enforcer.loadPolicy();
    return await this.enforcer.getUsersForRole(user);
  }

  /**
   * @description 获取策略中的所有授权规则
   * @author khr
   * @Date:
   */
  async findAllPolicy() {
    await this.enforcer.loadPolicy();
    return await this.enforcer.getPolicy();
  }
  /**
   * @description 获取当前策略中显示的角色列表
   * @author khr
   * @Date:
   */
  async findAllRoles() {
    return await this.enforcer.getAllRoles();
  }

  // 确定是否存在授权规则 例:'data2_admin', 'data2', 'read'
  async hasPolicy() {
    return await this.enforcer.hasPolicy();
  }

  /**
   * @description  AddPolicy 向当前策略添加授权许多规则
   * @author khr
   * @return boolean
   */

  async addPolicies(policies: string) {
    return await this.enforcer.addPolicy(policies);
  }
}
