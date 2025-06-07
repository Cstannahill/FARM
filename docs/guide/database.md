# Database Integration

MongoDB is the primary database with Beanie ODM providing async models and validation. The architecture also supports other databases such as PostgreSQL or MySQL through a provider layer.

```text
┌─────────────────────────────────────────────────────────────────┐
│                    FARM Database Integration                    │
└─────────────────────────────────────────────────────────────────┘
```

Schemas defined in Python generate migrations and TypeScript types to keep the stack in sync.
