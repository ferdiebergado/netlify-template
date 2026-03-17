# .clinerules/testing.md

---

paths:

- "\*_/_.test.ts"
- "\*_/_.spec.ts"
- "**/**tests**/**"

---

# Testing Standards

- Use descriptive test names: "should [expected behavior] when [condition]"
- One assertion per test when possible
- Mock external dependencies, not internal modules
- Use factories for test data, not fixtures
