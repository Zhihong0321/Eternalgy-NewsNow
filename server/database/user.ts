import type { Database } from "db0"
import type { UserInfo } from "#/types"
import { logger } from "#/utils/logger"
import { logger } from "#/utils/logger"
import { logger } from "#/utils/logger"
import { logger } from "#/utils/logger"
import { logger } from "#/utils/logger"
import { logger } from "#/utils/logger"
import { logger } from "#/utils/logger"

export class UserTable {
  private db
  private tableName: string
  private indexName: string
  constructor(db: Database) {
    this.db = db
    // Use table prefix if provided to avoid conflicts with existing tables
    const prefix = process.env.TABLE_PREFIX || ""
    this.tableName = prefix ? `${prefix}_user` : "user"
    this.indexName = prefix ? `idx_${prefix}_user_id` : "idx_user_id"
  }

  async init() {
    await this.db.prepare(`
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        id TEXT PRIMARY KEY,
        email TEXT,
        data TEXT,
        type TEXT,
        created INTEGER,
        updated INTEGER
      );
    `).run()
    await this.db.prepare(`
      CREATE INDEX IF NOT EXISTS ${this.indexName} ON ${this.tableName}(id);
    `).run()
    logger.success(`init ${this.tableName} table`)
  }

  async addUser(id: string, email: string, type: "github") {
    const u = await this.getUser(id)
    const now = Date.now()
    if (!u) {
      await this.db.prepare(`INSERT INTO ${this.tableName} (id, email, data, type, created, updated) VALUES (?, ?, ?, ?, ?, ?)`)
        .run(id, email, "", type, now, now)
      logger.success(`add user ${id}`)
    } else if (u.email !== email && u.type !== type) {
      await this.db.prepare(`UPDATE ${this.tableName} SET email = ?, updated = ? WHERE id = ?`).run(email, now, id)
      logger.success(`update user ${id} email`)
    } else {
      logger.info(`user ${id} already exists`)
    }
  }

  async getUser(id: string) {
    return (await this.db.prepare(`SELECT id, email, data, created, updated FROM ${this.tableName} WHERE id = ?`).get(id)) as UserInfo
  }

  async setData(key: string, value: string, updatedTime = Date.now()) {
    const state = await this.db.prepare(
      `UPDATE ${this.tableName} SET data = ?, updated = ? WHERE id = ?`,
    ).run(value, updatedTime, key)
    if (!state.success) throw new Error(`set user ${key} data failed`)
    logger.success(`set ${key} data`)
  }

  async getData(id: string) {
    const row: any = await this.db.prepare(`SELECT data, updated FROM ${this.tableName} WHERE id = ?`).get(id)
    if (!row) throw new Error(`user ${id} not found`)
    logger.success(`get ${id} data`)
    return row as {
      data: string
      updated: number
    }
  }

  async deleteUser(key: string) {
    const state = await this.db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`).run(key)
    if (!state.success) throw new Error(`delete user ${key} failed`)
    logger.success(`delete user ${key}`)
  }
}