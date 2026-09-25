import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export interface LocalUser {
  id: string;
  email: string;
  password: string;
  name: string;
  age?: number;
  bloodGroup?: string;
  allergies: string[];
  preExistingConditions: string[];
  isPregnant: boolean;
  createdAt: string;
}

export interface LocalSymptomCheck {
  _id: string;
  userId: string;
  primarySymptom: string;
  answers: Record<string, unknown>;
  severity: string;
  specialty: string;
  reasoning: string;
  redFlags: string[];
  createdAt: string;
}

interface LocalDatabase {
  users: LocalUser[];
  symptomChecks: LocalSymptomCheck[];
}

const storePath = process.env.MEDIGUIDE_DATA_FILE || path.join(process.cwd(), 'data', 'localStore.json');

function emptyDatabase(): LocalDatabase {
  return { users: [], symptomChecks: [] };
}

function readDatabase(): LocalDatabase {
  try {
    const parsed = JSON.parse(fs.readFileSync(storePath, 'utf8')) as Partial<LocalDatabase>;
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      symptomChecks: Array.isArray(parsed.symptomChecks) ? parsed.symptomChecks : [],
    };
  } catch {
    return emptyDatabase();
  }
}

function writeDatabase(database: LocalDatabase): void {
  fs.mkdirSync(path.dirname(storePath), { recursive: true });
  const temporaryPath = `${storePath}.${process.pid}.tmp`;
  fs.writeFileSync(temporaryPath, JSON.stringify(database, null, 2), { mode: 0o600 });
  fs.renameSync(temporaryPath, storePath);
}

export const localStore = {
  findUserByEmail(email: string): LocalUser | undefined {
    return readDatabase().users.find((user) => user.email === email.toLowerCase());
  },

  findUserById(id: string): LocalUser | undefined {
    return readDatabase().users.find((user) => user.id === id);
  },

  createUser(input: Pick<LocalUser, 'email' | 'password' | 'name'>): LocalUser {
    const database = readDatabase();
    const user: LocalUser = {
      id: randomUUID(),
      email: input.email.toLowerCase(),
      password: input.password,
      name: input.name.trim(),
      allergies: [],
      preExistingConditions: [],
      isPregnant: false,
      createdAt: new Date().toISOString(),
    };
    database.users.push(user);
    writeDatabase(database);
    return user;
  },

  updateUser(id: string, updates: Partial<Omit<LocalUser, 'id' | 'email' | 'password' | 'createdAt'>>): LocalUser | undefined {
    const database = readDatabase();
    const index = database.users.findIndex((user) => user.id === id);
    if (index < 0) return undefined;
    database.users[index] = { ...database.users[index], ...updates };
    writeDatabase(database);
    return database.users[index];
  },

  addSymptomCheck(input: Omit<LocalSymptomCheck, '_id' | 'createdAt'>): LocalSymptomCheck {
    const database = readDatabase();
    const check = { ...input, _id: randomUUID(), createdAt: new Date().toISOString() };
    database.symptomChecks.push(check);
    writeDatabase(database);
    return check;
  },

  latestSymptomCheck(userId: string): LocalSymptomCheck | undefined {
    return readDatabase().symptomChecks
      .filter((check) => check.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  },

  symptomHistory(userId: string): LocalSymptomCheck[] {
    return readDatabase().symptomChecks
      .filter((check) => check.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 50);
  },
};
