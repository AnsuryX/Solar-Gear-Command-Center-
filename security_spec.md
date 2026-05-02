# Security Specification - Solar Gear Marketing Hub

## Data Invariants
1.  A `Post` must have a valid `authorId` matching the creator's UID.
2.  `Post.scheduledAt` (if present) must be a future timestamp.
3.  `Campaign.budget` must be a positive number.
4.  `AIGeneration.createdAt` must be set by the server.

## The Dirty Dozen Payloads

1.  **Identity Spoofing**: `POST /posts/post123 { "platform": "linkedin", "content": "Hello", "status": "draft", "authorId": "ANOTHER_USER_UID" }`
2.  **State Shortcutting**: `PATCH /posts/post123 { "status": "published", "publishedAt": "2020-01-01T00:00:00Z" }`
3.  **Resource Poisoning (Long Content)**: `POST /posts/post123 { "content": "A".repeat(100000), ... }`
4.  **Resource Poisoning (Invalid ID)**: `POST /posts/bad-id-!@#$% { ... }`
5.  **Type Mismatch**: `POST /campaigns/camp1 { "budget": "one thousand dollars", ... }`
6.  **Unauthorized List Query**: `GET /posts` (without `where("authorId", "==", currentUser.uid)`)
7.  **Immutable Field Update**: `PATCH /posts/post123 { "authorId": "NEW_UID" }`
8.  **Shadow Update**: `PATCH /campaigns/camp1 { "isVerified": true }` (where `isVerified` is not in schema)
9.  **Temporal Integrity (Past Schedule)**: `POST /posts/post1 { "scheduledAt": "2020-01-01T00:00:00Z", ... }`
10. **Empty Required Fields**: `POST /posts/post1 { "status": "draft" }` (missing platform/authorId)
11. **Malicious Enum**: `POST /posts/post1 { "platform": "hacking_platform", ... }`
12. **Accessing Others' Data**: `GET /campaigns/someone_elses_campaign_id`

## Test Runner (Logic Check)
The `firestore.rules` will be designed to block these payloads.
