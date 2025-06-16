import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { SQLitePorter } from '@awesome-cordova-plugins/sqlite-porter/ngx';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class DbtaskService {
  private db: SQLiteObject | null = null;

  constructor(
    private sqlite: SQLite,
    private sqlitePorter: SQLitePorter,
    private storage: Storage
  ) {
    this.initStorage(); // Se ejecuta al instanciar el servicio
  }

  // 1. Inicializar el almacenamiento local
  private async initStorage() {
    await this.storage.create();
  }

  // 2. Inicializar la base de datos y crear tabla
  async setDatabase() {
    try {
      const dbInstance = await this.sqlite.create({
        name: 'usuarios.db',
        location: 'default'
      });

      this.db = dbInstance;

      const sql = `
        CREATE TABLE IF NOT EXISTS sesion_data (
          user_name TEXT PRIMARY KEY NOT NULL,
          password INTEGER NOT NULL,
          active INTEGER NOT NULL
        );
      `;

      await this.sqlitePorter.importSqlToDb(this.db, sql);
      console.log('✅ Tabla sesion_data creada o ya existente');
    } catch (error) {
      console.error('❌ Error creando la base de datos', error);
    }
  }

  // 3. Validar si el usuario existe
  async validarUsuario(user: string, pass: number): Promise<boolean> {
    if (!this.db) return false;
    const res = await this.db.executeSql(
      'SELECT * FROM sesion_data WHERE user_name = ? AND password = ?',
      [user, pass]
    );
    return res.rows.length > 0;
  }

  // 4. Registrar sesión activa
  async registrarSesion(user: string, pass: number): Promise<void> {
    if (!this.db) return;
    await this.db.executeSql(
      'INSERT OR REPLACE INTO sesion_data (user_name, password, active) VALUES (?, ?, ?)',
      [user, pass, 1]
    );
    await this.storage.set('usuario_activo', user);
  }

  // 5. Verificar si hay sesión activa
  async existeSesionActiva(): Promise<boolean> {
    const user = await this.storage.get('usuario_activo');
    return !!user;
  }

  // 6. Cerrar sesión
  async cerrarSesion(user: string): Promise<void> {
    if (!this.db) return;
    await this.db.executeSql(
      'UPDATE sesion_data SET active = 0 WHERE user_name = ?',
      [user]
    );
    await this.storage.remove('usuario_activo');
  }
}
