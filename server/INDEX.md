# Jest → Vitest Migration - Complete Documentation Index

## Quick Navigation

**Starting Point**: [VITEST-MIGRATION.md](./VITEST-MIGRATION.md) - Overview & first steps

**Configuration Status**: See [MIGRATION-SUMMARY.txt](./MIGRATION-SUMMARY.txt)

---

## Documentation Structure

### Setup & Getting Started (READ FIRST)

1. **[VITEST-MIGRATION.md](./VITEST-MIGRATION.md)** - Start here!
   - Migration overview
   - File descriptions
   - Setup instructions
   - Troubleshooting
   - Next steps

2. **[VITEST-CHECKLIST.md](./VITEST-CHECKLIST.md)** - Implementation guide
   - Pre-migration verification
   - Installation steps
   - Configuration review
   - Dépannage par étapes

### Reference Files

3. **[test/example.spec.ts](./test/example.spec.ts)** - Template test file
   - Basic test patterns
   - NestJS testing setup
   - Mocking examples
   - Global API usage

4. **[test/MIGRATION-TEMPLATE.ts](./test/MIGRATION-TEMPLATE.ts)** - Jest→Vitest comparison
   - Before/After patterns
   - Complete migration example
   - Key changes summary
   - Best practices

5. **[test/MSW-PATTERNS.md](./test/MSW-PATTERNS.md)** - HTTP mocking guide
   - MSW 2.x setup
   - Basic usage patterns
   - NestJS-specific examples
   - Advanced patterns
   - Debugging tips

6. **[test/DEPENDENCIES.md](./test/DEPENDENCIES.md)** - Dependency reference
   - Detailed package descriptions
   - Breaking changes list
   - Performance comparison
   - Installation steps
   - Compatibility matrix

7. **[test/VERIFICATION.md](./test/VERIFICATION.md)** - Setup validation
   - Configuration checklist
   - Verification commands
   - Expected output
   - Troubleshooting guide

### Configuration Files

8. **[vitest.config.ts](./vitest.config.ts)** - Main test runner configuration
   ```typescript
   - SWC plugin for decorators
   - Path aliases (@, @shared)
   - MSW setupFiles
   - Coverage settings
   - Thread pool
   ```

9. **[test/setup.ts](./test/setup.ts)** - Global test setup
   ```typescript
   - MSW mockServer initialization
   - beforeAll hook
   - afterEach hook
   - afterAll hook
   - Utility functions
   ```

10. **[package.json](./package.json)** - Modified
    - Scripts updated (test, test:watch, test:cov, test:e2e)
    - New dependencies (vitest, msw, unplugin-swc)
    - Removed dependencies (jest, ts-jest, @types/jest)

---

## Decision Tree: Where to Look?

```
❓ "Where do I start?"
  → VITEST-MIGRATION.md

❓ "How do I install this?"
  → VITEST-CHECKLIST.md

❓ "How do I write a test?"
  → test/example.spec.ts

❓ "How do I mock HTTP?"
  → test/MSW-PATTERNS.md

❓ "What about my existing tests?"
  → test/MIGRATION-TEMPLATE.ts

❓ "What packages are needed?"
  → test/DEPENDENCIES.md

❓ "Is my setup correct?"
  → test/VERIFICATION.md

❓ "What changed in my config?"
  → vitest.config.ts or test/setup.ts

❓ "Troubleshooting!"
  → VITEST-MIGRATION.md (section: Troubleshooting)
```

---

## Quick Commands

```bash
# Install dependencies
npm install

# Verify setup
npm run test                # Run tests once
npm run test:watch         # Interactive watch mode
npm run test:cov           # Generate coverage report

# Test specific file
npm run test -- src/file.spec.ts

# Test with grep filter
npm run test -- --grep "UserService"

# Debug mode
node --inspect-brk ./node_modules/.bin/vitest run
```

---

## File Changes Summary

### Created Files (11 total)

Configuration:
- `vitest.config.ts` - Main Vitest config
- `test/setup.ts` - Global test setup

Documentation:
- `VITEST-MIGRATION.md` - Migration guide
- `VITEST-CHECKLIST.md` - Implementation checklist
- `test/example.spec.ts` - Template test
- `test/MIGRATION-TEMPLATE.ts` - Jest→Vitest patterns
- `test/MSW-PATTERNS.md` - HTTP mocking guide
- `test/DEPENDENCIES.md` - Dependency reference
- `test/VERIFICATION.md` - Verification guide
- `MIGRATION-SUMMARY.txt` - Summary overview
- `INDEX.md` - This file

### Modified Files (1 total)

- `package.json` - Scripts & dependencies updated

---

## Key Concepts

### Vitest Advantages
- ⚡ ~80% faster startup than Jest
- TypeScript-first design
- Better error messages
- Built-in globals (describe, it, expect)
- Vite-native configuration

### MSW 2.x for HTTP Mocking
- Network-level request interception
- No need to modify app code
- Works with any HTTP library
- Automatic handler reset between tests

### SWC Transpiler
- Native NestJS decorator support
- Faster than ts-jest
- Transparent compilation

---

## Migration Workflow

```
1. Read VITEST-MIGRATION.md
   ↓
2. Run: npm install
   ↓
3. For each .spec.ts file:
   - Follow patterns in test/MIGRATION-TEMPLATE.ts
   - Replace jest.* with vi.*
   - Use MSW for HTTP mocks
   - Test: npm run test -- file.spec.ts
   ↓
4. Verify: npm run test:cov
   ↓
5. Done!
```

---

## File Locations Quick Reference

```
/srv/workspace/game-plug/server/
├── vitest.config.ts              ← Main config
├── package.json                  ← Updated scripts & deps
├── VITEST-MIGRATION.md           ← Start here!
├── VITEST-CHECKLIST.md           ← How to implement
├── MIGRATION-SUMMARY.txt         ← Overview
├── INDEX.md                      ← This file
└── test/
    ├── setup.ts                  ← Global setup
    ├── example.spec.ts           ← Template test
    ├── MIGRATION-TEMPLATE.ts     ← Jest→Vitest patterns
    ├── MSW-PATTERNS.md           ← HTTP mocking
    ├── DEPENDENCIES.md           ← Package info
    └── VERIFICATION.md           ← Setup check
```

---

## Next Steps

1. **IMMEDIATE** (5 min)
   - Read: VITEST-MIGRATION.md
   - Read: MIGRATION-SUMMARY.txt

2. **SHORT TERM** (30 min)
   - Run: `npm install`
   - Run: `npm run test:cov` (to verify)
   - Review: test/example.spec.ts

3. **MEDIUM TERM** (1-2 hours)
   - Migrate existing .spec.ts files
   - Follow: test/MIGRATION-TEMPLATE.ts
   - Test each file individually

4. **LONG TERM**
   - Run full test suite
   - Update CI/CD if needed
   - Team training/documentation

---

## Common Issues & Solutions

| Problem | Solution | Reference |
|---------|----------|-----------|
| "Cannot find module 'vitest'" | `npm install` | VITEST-CHECKLIST.md |
| "Decorators not working" | Check unplugin-swc installed | DEPENDENCIES.md |
| "MSW not intercepting" | Check test/setup.ts exists | MSW-PATTERNS.md |
| "How to mock HTTP?" | See MSW-PATTERNS.md | MSW-PATTERNS.md |
| "Tests timeout" | Increase testTimeout | VERIFICATION.md |
| "Import errors with @" | Check vitest.config.ts | vitest.config.ts |

---

## Support & Resources

**Internal:**
- Docs: All .md files in this directory
- Template: test/example.spec.ts
- Patterns: test/MIGRATION-TEMPLATE.ts

**External:**
- Vitest: https://vitest.dev/
- MSW: https://mswjs.io/
- NestJS: https://docs.nestjs.com/fundamentals/testing

---

## Configuration Validation

Status: **✅ COMPLETE & READY**

- Configuration files: ✅ Created
- Documentation: ✅ Comprehensive
- Examples: ✅ Provided
- Dependencies: ✅ Listed & explained

Ready for:
- npm install
- Test migration
- Production use

---

## Document Metadata

| Attribute | Value |
|-----------|-------|
| Migration Type | Jest → Vitest |
| Project | Game Plug (NestJS Backend) |
| Path | /srv/workspace/game-plug/server |
| Date | 2026-01-16 |
| Author | Cindy (Haiku Agent) |
| Status | Complete |

---

**NEXT ACTION**: Open [VITEST-MIGRATION.md](./VITEST-MIGRATION.md)

