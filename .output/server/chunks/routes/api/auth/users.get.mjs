import { d as defineEventHandler } from '../../../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';

const users_get = defineEventHandler(async (event) => {
  const testUsers = [
    {
      id: "1",
      email: "admin@anwalts.ai",
      password: "admin123",
      // In production this would be hashed
      name: "Dr. Max M\xFCller",
      role: "admin",
      created: "2024-01-01"
    },
    {
      id: "2",
      email: "user@anwalts.ai",
      password: "user123",
      name: "Maria Schmidt",
      role: "user",
      created: "2024-01-15"
    },
    {
      id: "3",
      email: "demo@anwalts.ai",
      password: "demo123",
      name: "Demo User",
      role: "demo",
      created: "2024-08-01"
    },
    {
      id: "4",
      email: "test@example.com",
      password: "test123",
      name: "Test User",
      role: "user",
      created: "2024-08-20"
    }
  ];
  console.log("\u{1F4CB} Available test users:", testUsers.length);
  return {
    success: true,
    users: testUsers.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      created: u.created,
      // Don't return passwords in API response
      hasPassword: !!u.password
    })),
    message: "Test users available for authentication"
  };
});

export { users_get as default };
//# sourceMappingURL=users.get.mjs.map
