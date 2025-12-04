import db from '../db/database.js';
import bcrypt from 'bcryptjs';
import { Campus, Gender, Goal, ActivityLevel } from '../types.js';

export interface UserData {
  id?: number;
  email: string;
  password: string;
  name: string;
  campus: Campus;
  gender: Gender;
  age: number;
  height: number;
  weight: number;
  muscleMass?: number;
  bodyFat?: number;
  goal: Goal;
  activityLevel: ActivityLevel;
  allergies?: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserPublic {
  id: number;
  email: string;
  name: string;
  campus: Campus;
  gender: Gender;
  age: number;
  height: number;
  weight: number;
  muscleMass?: number;
  bodyFat?: number;
  goal: Goal;
  activityLevel: ActivityLevel;
  allergies?: string;
}

export class User {
  static async create(userData: Omit<UserData, 'id' | 'created_at' | 'updated_at'>): Promise<UserPublic> {
    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const stmt = db.prepare(`
      INSERT INTO users (email, password, name, campus, gender, age, height, weight, muscleMass, bodyFat, goal, activityLevel, allergies)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      userData.email,
      hashedPassword,
      userData.name,
      userData.campus,
      userData.gender,
      userData.age,
      userData.height,
      userData.weight,
      userData.muscleMass || null,
      userData.bodyFat || null,
      userData.goal,
      userData.activityLevel,
      userData.allergies || null
    );

    return this.findById(result.lastInsertRowid as number)!;
  }

  static findById(id: number): UserPublic | null {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = stmt.get(id) as UserData | undefined;
    
    if (!user) return null;

    const { password, ...publicUser } = user;
    return publicUser as UserPublic;
  }

  static findByEmail(email: string): (UserData & { id: number }) | null {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email) as UserData | undefined;
    return (user as (UserData & { id: number }) | null) || null;
  }

  static async verifyPassword(email: string, password: string): Promise<UserPublic | null> {
    const user = this.findByEmail(email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    const { password: _, ...publicUser } = user;
    return publicUser as UserPublic;
  }

  static update(id: number, updates: Partial<Omit<UserData, 'id' | 'email' | 'password' | 'created_at'>>): UserPublic | null {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.campus !== undefined) {
      fields.push('campus = ?');
      values.push(updates.campus);
    }
    if (updates.gender !== undefined) {
      fields.push('gender = ?');
      values.push(updates.gender);
    }
    if (updates.age !== undefined) {
      fields.push('age = ?');
      values.push(updates.age);
    }
    if (updates.height !== undefined) {
      fields.push('height = ?');
      values.push(updates.height);
    }
    if (updates.weight !== undefined) {
      fields.push('weight = ?');
      values.push(updates.weight);
    }
    if (updates.muscleMass !== undefined) {
      fields.push('muscleMass = ?');
      values.push(updates.muscleMass);
    }
    if (updates.bodyFat !== undefined) {
      fields.push('bodyFat = ?');
      values.push(updates.bodyFat);
    }
    if (updates.goal !== undefined) {
      fields.push('goal = ?');
      values.push(updates.goal);
    }
    if (updates.activityLevel !== undefined) {
      fields.push('activityLevel = ?');
      values.push(updates.activityLevel);
    }
    if (updates.allergies !== undefined) {
      fields.push('allergies = ?');
      values.push(updates.allergies);
    }

    if (fields.length === 0) return this.findById(id);

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);

    return this.findById(id);
  }
}

